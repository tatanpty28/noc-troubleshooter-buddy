export interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
}

export interface EscalationInfo {
  provider: string;
  email: string;
  id?: string;
  lastUpdate?: string;
  additionalInfo?: string;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  checklist: ChecklistItem[];
  escalation: EscalationInfo;
  category: string;
  dateCreated: string;
  lastUpdated: string;
}

export interface CaseHistory {
  id: string;
  relatedKB: string;
  incidentDescription: string;
  dateResolved: string;
  technicianName?: string;
  actionsPerformed: string[];
  finalResult: 'resuelto' | 'escalado' | 'sin_resolver';
  additionalNotes?: string;
}

export interface TroubleshootingProblem {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  checklist: ChecklistItem[];
  escalation: EscalationInfo;
  category: string;
  kb: KnowledgeBase;
  lastSimilarCase?: CaseHistory;
}

// Bases de datos separadas para KBs y casos históricos
export const knowledgeBaseDatabase: KnowledgeBase[] = [
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
        description: "Reiniciar equipos de red en orden: primero reiniciar el switch de acceso desconectando la alimentación por 10 segundos",
        completed: false
      },
      {
        id: "reboot-router",
        description: "Si el problema persiste, reiniciar el router principal desconectando la alimentación y esperar 2 minutos",
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
        description: "Si los servicios fallan, reiniciar el servidor desde la consola de administración",
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

export const caseHistoryDatabase: CaseHistory[] = [
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

export const troubleshootingDatabase: TroubleshootingProblem[] = knowledgeBaseDatabase.map(kb => {
  const lastCase = caseHistoryDatabase.find(case_ => case_.relatedKB === kb.id);
  
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

export const searchProblems = (query: string): TroubleshootingProblem[] => {
  const lowerQuery = query.toLowerCase();
  
  return troubleshootingDatabase.filter(problem => 
    problem.title.toLowerCase().includes(lowerQuery) ||
    problem.description.toLowerCase().includes(lowerQuery) ||
    problem.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
};