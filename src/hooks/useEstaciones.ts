import { useState, useEffect } from 'react';
import { useLocalStorageManager } from './useLocalStorage';

export interface Equipo {
  id: string;
  modelo: string;
  imagen: string;
  descripcion?: string;
  metodoReinicio?: string;
}

export interface Estacion {
  id: string;
  codigo: string;
  nombre: string;
  ubicacion: string;
  ip?: string;
  proveedores: string[];
  equipos: Equipo[];
  attachments?: string[];
  photo?: string;
  provider_backoffice?: string;
  ip_backoffice?: string;
  ip_publica_backoffice?: string;
  provider_counter?: string;
  ip_counter?: string;
  ip_publica_counter?: string;
  contacto: {
    email: string;
    telefono: string;
  };
}

const estacionesIniciales: Estacion[] = [
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
      },
      {
        id: 'bog-router-01',
        modelo: 'Huawei NetEngine 8000',
        imagen: '/src/assets/equipos/router-cisco.jpg',
        descripcion: 'Router de borde para conexiones WAN',
        metodoReinicio: 'Comando reload desde CLI o desconectar alimentación'
      }
    ],
    contacto: {
      email: 'soporte@bog.aero',
      telefono: '+57-1-266-2000'
    }
  },
  {
    id: 'lim-001',
    codigo: 'LIM',
    nombre: 'Aeropuerto Jorge Chávez',
    ubicacion: 'Lima, Perú',
    proveedores: ['Telefónica', 'Claro Perú', 'Entel'],
    equipos: [
      {
        id: 'lim-switch-01',
        modelo: 'HP Aruba 2930F',
        imagen: '/src/assets/equipos/network-switch.jpg',
        descripcion: 'Switch core para distribución de red',
        metodoReinicio: 'Desconectar alimentación 15 segundos, reconectar'
      }
    ],
    contacto: {
      email: 'noc@lap.com.pe',
      telefono: '+51-1-517-3100'
    }
  }
];

export function useEstaciones() {
  const storage = useLocalStorageManager('noc_estaciones');
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar estaciones desde localStorage al inicializar
  useEffect(() => {
    const loadEstaciones = () => {
      const saved = storage.getItem<Estacion[]>('lista', []);
      if (saved.length === 0) {
        // Si no hay datos guardados, usar datos iniciales
        storage.setItem('lista', estacionesIniciales);
        setEstaciones(estacionesIniciales);
      } else {
        setEstaciones(saved);
      }
      setLoading(false);
    };

    loadEstaciones();
  }, []);

  const buscarEstaciones = (query: string): Estacion[] => {
    if (!query.trim()) return estaciones;
    
    const lowerQuery = query.toLowerCase();
    return estaciones.filter(estacion => 
      estacion.codigo.toLowerCase().includes(lowerQuery) ||
      estacion.nombre.toLowerCase().includes(lowerQuery) ||
      estacion.ubicacion.toLowerCase().includes(lowerQuery) ||
      estacion.proveedores.some(proveedor => 
        proveedor.toLowerCase().includes(lowerQuery)
      )
    );
  };

  const obtenerEstacionPorId = (id: string): Estacion | undefined => {
    return estaciones.find(estacion => estacion.id === id);
  };

  const agregarEstacion = (estacion: Omit<Estacion, 'id'>) => {
    const nuevaEstacion = {
      ...estacion,
      id: `est-${Date.now()}`
    };
    
    const nuevasEstaciones = [...estaciones, nuevaEstacion];
    setEstaciones(nuevasEstaciones);
    storage.setItem('lista', nuevasEstaciones);
    
    return nuevaEstacion;
  };

  const actualizarEstacion = (id: string, cambios: Partial<Estacion>) => {
    const nuevasEstaciones = estaciones.map(estacion =>
      estacion.id === id ? { ...estacion, ...cambios } : estacion
    );
    
    setEstaciones(nuevasEstaciones);
    storage.setItem('lista', nuevasEstaciones);
  };

  const eliminarEstacion = (id: string) => {
    const nuevasEstaciones = estaciones.filter(estacion => estacion.id !== id);
    setEstaciones(nuevasEstaciones);
    storage.setItem('lista', nuevasEstaciones);
  };

  // Simular pruebas de red
  const ejecutarPing = async (estacionId: string): Promise<any> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const estacion = obtenerEstacionPorId(estacionId);
    
    if (!estacion?.ip) {
      return {
        success: false,
        error: 'IP no configurada',
        timestamp: new Date().toISOString(),
        target: estacion?.codigo || 'Unknown'
      };
    }
    
    return {
      success: Math.random() > 0.3, // 70% success rate
      latency: Math.floor(Math.random() * 50) + 20,
      packetLoss: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
      timestamp: new Date().toISOString(),
      target: estacion.ip,
      targetName: estacion.codigo
    };
  };

  const ejecutarTraceroute = async (estacionId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const estacion = obtenerEstacionPorId(estacionId);
    
    if (!estacion?.ip) {
      return {
        success: false,
        error: 'IP no configurada',
        timestamp: new Date().toISOString(),
        target: estacion?.codigo || 'Unknown'
      };
    }
    
    const hops = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
      hop: i + 1,
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      latency: Math.floor(Math.random() * 30) + 5
    }));
    
    return {
      success: true,
      hops,
      totalHops: hops.length,
      timestamp: new Date().toISOString(),
      target: estacion.ip,
      targetName: estacion.codigo
    };
  };

  return {
    estaciones,
    loading,
    buscarEstaciones,
    obtenerEstacionPorId,
    agregarEstacion,
    actualizarEstacion,
    eliminarEstacion,
    ejecutarPing,
    ejecutarTraceroute
  };
}