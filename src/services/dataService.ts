import { useLocalStorageManager } from '@/hooks/useLocalStorage';
import { 
  KnowledgeBase, 
  CaseHistory, 
  TroubleshootingProblem,
  ChecklistItem,
  EscalationInfo 
} from '@/data/troubleshootingData';
import { Estacion } from '@/hooks/useEstaciones';

// Data service using localStorage
export class NOCDataService {
  private storage = useLocalStorageManager('noc_app');

  // Initialize with default data if empty
  initializeDefaultData() {
    const kbs = this.getKnowledgeBases();
    const cases = this.getCaseHistory();
    const estaciones = this.getEstaciones();
    
    if (kbs.length === 0) {
      this.storage.setItem('knowledge_bases', this.getDefaultKBs());
    }
    
    if (cases.length === 0) {
      this.storage.setItem('case_history', this.getDefaultCases());
    }

    if (estaciones.length === 0) {
      this.storage.setItem('estaciones', this.getDefaultEstaciones());
    }
  }

  // Knowledge Base methods
  getKnowledgeBases(): KnowledgeBase[] {
    return this.storage.getItem('knowledge_bases', []);
  }

  saveKnowledgeBase(kb: KnowledgeBase): void {
    const kbs = this.getKnowledgeBases();
    const existingIndex = kbs.findIndex(existing => existing.id === kb.id);
    
    if (existingIndex >= 0) {
      kbs[existingIndex] = { ...kb, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      kbs.push({
        ...kb,
        dateCreated: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
    
    this.storage.setItem('knowledge_bases', kbs);
  }

  deleteKnowledgeBase(id: string): void {
    const kbs = this.getKnowledgeBases().filter(kb => kb.id !== id);
    this.storage.setItem('knowledge_bases', kbs);
  }

  // Case History methods
  getCaseHistory(): CaseHistory[] {
    return this.storage.getItem('case_history', []);
  }

  saveCaseHistory(case_: CaseHistory): void {
    const cases = this.getCaseHistory();
    const existingIndex = cases.findIndex(existing => existing.id === case_.id);
    
    if (existingIndex >= 0) {
      cases[existingIndex] = case_;
    } else {
      cases.push(case_);
    }
    
    this.storage.setItem('case_history', cases);
  }

  deleteCaseHistory(id: string): void {
    const cases = this.getCaseHistory().filter(case_ => case_.id !== id);
    this.storage.setItem('case_history', cases);
  }

  // Search functionality
  searchProblems(query: string): TroubleshootingProblem[] {
    const kbs = this.getKnowledgeBases();
    const cases = this.getCaseHistory();
    const lowerQuery = query.toLowerCase();
    
    const matchingKBs = kbs.filter(kb => 
      kb.title.toLowerCase().includes(lowerQuery) ||
      kb.description.toLowerCase().includes(lowerQuery) ||
      kb.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
    
    return matchingKBs.map(kb => {
      const lastCase = cases.find(case_ => case_.relatedKB === kb.id);
      
      return {
        id: kb.id.replace('KB', 'troubleshoot-'),
        title: kb.title,
        description: kb.description,
        keywords: kb.keywords,
        checklist: kb.checklist,
        escalation: kb.escalation,
        category: kb.category,
        kb: kb,
        lastSimilarCase: lastCase
      };
    });
  }

  // Configuration methods
  getUserRole(): 'admin' | 'editor' | 'user' {
    return this.storage.getItem('user_role', 'user');
  }

  setUserRole(role: 'admin' | 'editor' | 'user'): void {
    this.storage.setItem('user_role', role);
  }

  // Estaciones methods
  getEstaciones(): Estacion[] {
    return this.storage.getItem('estaciones', []);
  }

  saveEstacion(estacion: Estacion): void {
    const estaciones = this.getEstaciones();
    const existingIndex = estaciones.findIndex(existing => existing.id === estacion.id);
    
    if (existingIndex >= 0) {
      estaciones[existingIndex] = estacion;
    } else {
      estaciones.push(estacion);
    }
    
    this.storage.setItem('estaciones', estaciones);
  }

  deleteEstacion(id: string): void {
    const estaciones = this.getEstaciones().filter(est => est.id !== id);
    this.storage.setItem('estaciones', estaciones);
  }

  // Default data
  private getDefaultKBs(): KnowledgeBase[] {
    return [
      {
        id: "KB001",
        title: "No llega mensajería a Aircom",
        description: "Problemas con la recepción de mensajes en el sistema Aircom",
        keywords: ["aircom", "mensajería", "mensaje", "no llega", "correo"],
        category: "Comunicaciones",
        dateCreated: "2024-01-01",
        lastUpdated: "2024-01-15",
        checklist: [
          {
            id: "check-connection",
            description: "Verificar conectividad de red al servidor Aircom",
            completed: false
          },
          {
            id: "check-service",
            description: "Validar que el servicio de mensajería esté activo",
            completed: false
          },
          {
            id: "check-queue",
            description: "Revisar cola de mensajes pendientes",
            completed: false
          },
          {
            id: "check-logs",
            description: "Analizar logs del sistema para errores específicos",
            completed: false
          },
          {
            id: "test-message",
            description: "Enviar mensaje de prueba para validar funcionamiento",
            completed: false
          }
        ],
        escalation: {
          provider: "Soporte Aircom",
          email: "soporte@aircom.com",
          id: "AIRCOM-MSG-001",
          lastUpdate: "2024-01-15",
          additionalInfo: "Incluir capturas de pantalla de los logs y detallar la hora exacta del problema. Mencionar si afecta a todos los usuarios o solo algunos."
        }
      },
      {
        id: "KB002",
        title: "No hay Internet en YUL",
        description: "Problemas de conectividad a Internet en la ubicación YUL",
        keywords: ["yul", "internet", "conexión", "red", "sin internet"],
        category: "Conectividad",
        dateCreated: "2024-01-01",
        lastUpdated: "2024-01-14",
        checklist: [
          {
            id: "check-physical",
            description: "Verificar conexiones físicas (cables, switches, router)",
            completed: false
          },
          {
            id: "check-ping",
            description: "Hacer ping al gateway principal (192.168.1.1)",
            completed: false
          },
          {
            id: "check-dns",
            description: "Probar resolución DNS (ping google.com, 8.8.8.8)",
            completed: false
          },
          {
            id: "check-bandwidth",
            description: "Verificar uso de ancho de banda en el router",
            completed: false
          },
          {
            id: "reboot-equipment",
            description: "Reiniciar equipos de red en orden: modem → router → switches",
            completed: false
          }
        ],
        escalation: {
          provider: "ISP Proveedor Principal",
          email: "noc@proveedorisp.com",
          id: "YUL-NET-789",
          lastUpdate: "2024-01-14 - NetBox",
          additionalInfo: "Reportar ID de circuito: YUL-001-FIBER. Mencionar si es corte total o degradación de servicio. Incluir resultados de las pruebas de conectividad."
        }
      },
      {
        id: "KB003",
        title: "Servidor de aplicaciones caído",
        description: "El servidor principal de aplicaciones no responde",
        keywords: ["servidor", "caído", "down", "aplicación", "no responde"],
        category: "Infraestructura",
        dateCreated: "2024-01-01",
        lastUpdated: "2024-01-15",
        checklist: [
          {
            id: "check-server-status",
            description: "Verificar estado del servidor en el panel de monitoreo",
            completed: false
          },
          {
            id: "check-ping-server",
            description: "Hacer ping al servidor (IP: 10.0.1.100)",
            completed: false
          },
          {
            id: "check-services",
            description: "Verificar servicios críticos (Apache, MySQL, Redis)",
            completed: false
          },
          {
            id: "check-disk-space",
            description: "Verificar espacio en disco disponible",
            completed: false
          },
          {
            id: "check-memory",
            description: "Revisar uso de memoria RAM",
            completed: false
          },
          {
            id: "restart-services",
            description: "Reiniciar servicios en orden seguro",
            completed: false
          }
        ],
        escalation: {
          provider: "Equipo de Infraestructura",
          email: "infra@empresa.com",
          id: "SRV-001-CRITICAL",
          lastUpdate: "2024-01-15",
          additionalInfo: "Contactar al administrador de sistemas senior. Incluir capturas del monitoreo y logs del sistema. Si no hay respuesta en 15 minutos, escalar a gerencia IT."
        }
      }
    ];
  }

  private getDefaultCases(): CaseHistory[] {
    return [
      {
        id: "CAS001",
        relatedKB: "KB001",
        incidentDescription: "Mensajería de Aircom no funcionando desde las 14:30. Usuarios reportan que no reciben notificaciones.",
        dateResolved: "2024-01-10",
        technicianName: "Carlos Mendez",
        actionsPerformed: [
          "Verificó conectividad - OK",
          "Reinició servicio de mensajería",
          "Limpió cola de mensajes pendientes",
          "Probó envío de mensaje de prueba - Exitoso"
        ],
        finalResult: "resuelto",
        additionalNotes: "El problema se debía a una cola saturada de mensajes pendientes. Se recomienda implementar monitoreo automático."
      },
      {
        id: "CAS002",
        relatedKB: "KB002",
        incidentDescription: "Usuarios en YUL reportan intermitencia en conexión a internet desde las 09:00.",
        dateResolved: "2024-01-12",
        technicianName: "Ana Rodriguez",
        actionsPerformed: [
          "Verificó conexiones físicas - OK",
          "Ping al gateway - Paquetes perdidos 15%",
          "Contactó al ISP",
          "ISP realizó ajustes en el circuito"
        ],
        finalResult: "escalado",
        additionalNotes: "Problema resuelto por el ISP. Era un issue de configuración en su lado. Tiempo de resolución: 3 horas."
      },
      {
        id: "CAS003",
        relatedKB: "KB003",
        incidentDescription: "Servidor principal no responde desde las 22:15. Aplicaciones críticas fuera de servicio.",
        dateResolved: "2024-01-08",
        technicianName: "Luis Gomez",
        actionsPerformed: [
          "Verificó estado del servidor - Sin respuesta",
          "Acceso físico al servidor",
          "Reinició servidor manualmente",
          "Verificó servicios críticos - Todos operativos"
        ],
        finalResult: "resuelto",
        additionalNotes: "Falla de hardware en la fuente de poder. Se reemplazó componente. Downtime total: 45 minutos."
      }
    ];
  }

  private getDefaultEstaciones(): Estacion[] {
    return [
      {
        id: 'yul-001',
        codigo: 'YUL',
        nombre: 'Aeropuerto Pierre Elliott Trudeau',
        ubicacion: 'Montreal, Quebec, Canada',
        proveedores: ['Cirion', 'Tigo', 'Bell Canada'],
        equipos: [
          {
            id: 'yul-router-01',
            modelo: 'Cisco ISR 4000 Series',
            imagen: '/src/assets/equipos/router-cisco.jpg',
            descripcion: 'Router principal para conexión WAN',
            metodoReinicio: 'Desconectar alimentación por 10 segundos, luego reconectar'
          },
          {
            id: 'yul-switch-01',
            modelo: 'Cisco Catalyst 2960-X',
            imagen: '/src/assets/equipos/network-switch.jpg',
            descripcion: 'Switch de acceso para red LAN',
            metodoReinicio: 'Desconectar alimentación por 10 segundos'
          }
        ],
        contacto: {
          email: 'noc@yul.aero',
          telefono: '+1-514-123-4567'
        }
      },
      {
        id: 'bog-001',
        codigo: 'BOG',
        nombre: 'Aeropuerto El Dorado',
        ubicacion: 'Bogotá, Colombia',
        proveedores: ['Claro', 'Tigo', 'ETB'],
        equipos: [
          {
            id: 'bog-server-01',
            modelo: 'Dell PowerEdge R740',
            imagen: '/src/assets/equipos/server-rack.jpg',
            descripcion: 'Servidor de aplicaciones principal',
            metodoReinicio: 'Reinicio desde consola de administración o botón power'
          }
        ],
        contacto: {
          email: 'soporte@bog.aero',
          telefono: '+57-1-266-2000'
        }
      }
    ];
  }
}

// Singleton instance
export const nocDataService = new NOCDataService();