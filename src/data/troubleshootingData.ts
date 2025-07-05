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

export interface TroubleshootingProblem {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  checklist: ChecklistItem[];
  escalation: EscalationInfo;
  category: string;
}

export const troubleshootingDatabase: TroubleshootingProblem[] = [
  {
    id: "aircom-messaging",
    title: "No llega mensajería a Aircom",
    description: "Problemas con la recepción de mensajes en el sistema Aircom",
    keywords: ["aircom", "mensajería", "mensaje", "no llega", "correo"],
    category: "Comunicaciones",
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
    id: "yul-internet",
    title: "No hay Internet en YUL",
    description: "Problemas de conectividad a Internet en la ubicación YUL",
    keywords: ["yul", "internet", "conexión", "red", "sin internet"],
    category: "Conectividad",
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
    id: "server-down",
    title: "Servidor de aplicaciones caído",
    description: "El servidor principal de aplicaciones no responde",
    keywords: ["servidor", "caído", "down", "aplicación", "no responde"],
    category: "Infraestructura",
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

export const searchProblems = (query: string): TroubleshootingProblem[] => {
  const lowerQuery = query.toLowerCase();
  
  return troubleshootingDatabase.filter(problem => 
    problem.title.toLowerCase().includes(lowerQuery) ||
    problem.description.toLowerCase().includes(lowerQuery) ||
    problem.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
};