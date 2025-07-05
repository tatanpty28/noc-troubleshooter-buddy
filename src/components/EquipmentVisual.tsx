import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Router, Server } from "lucide-react";

// Import equipment images
import routerImage from "@/assets/equipos/router-cisco.jpg";
import serverImage from "@/assets/equipos/server-rack.jpg";
import switchImage from "@/assets/equipos/network-switch.jpg";

interface EquipmentInfo {
  name: string;
  image: string;
  description: string;
  model: string;
  restartMethod: string;
  icon: React.ReactNode;
}

const equipmentDatabase: Record<string, EquipmentInfo> = {
  router: {
    name: "Router",
    image: routerImage,
    description: "Equipo de enrutamiento principal de la red",
    model: "Cisco ISR 4000 Series",
    restartMethod: "Desconectar alimentación por 10 segundos",
    icon: <Router className="w-4 h-4" />
  },
  switch: {
    name: "Switch",
    image: switchImage,
    description: "Switch de acceso para conexiones de red local",
    model: "Cisco Catalyst 2960-X",
    restartMethod: "Desconectar alimentación por 10 segundos",
    icon: <Monitor className="w-4 h-4" />
  },
  servidor: {
    name: "Servidor",
    image: serverImage,
    description: "Servidor de aplicaciones en rack",
    model: "Dell PowerEdge R740",
    restartMethod: "Reinicio desde consola de administración",
    icon: <Server className="w-4 h-4" />
  }
};

interface EquipmentVisualProps {
  stepDescription: string;
}

export const EquipmentVisual = ({ stepDescription }: EquipmentVisualProps) => {
  // Keywords to detect equipment types
  const getEquipmentType = (description: string): string | null => {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('router') || lowerDesc.includes('enrutador')) {
      return 'router';
    }
    if (lowerDesc.includes('switch') || lowerDesc.includes('conmutador')) {
      return 'switch';
    }
    if (lowerDesc.includes('servidor') || lowerDesc.includes('server')) {
      return 'servidor';
    }
    
    return null;
  };

  // Check if step involves equipment restart
  const requiresRestart = (description: string): boolean => {
    const lowerDesc = description.toLowerCase();
    return lowerDesc.includes('reiniciar') || 
           lowerDesc.includes('reinicio') || 
           lowerDesc.includes('apagar') || 
           lowerDesc.includes('encender') ||
           lowerDesc.includes('desconectar') ||
           lowerDesc.includes('reset');
  };

  const equipmentType = getEquipmentType(stepDescription);
  const needsRestart = requiresRestart(stepDescription);

  // Only show if equipment is detected and restart is needed
  if (!equipmentType || !needsRestart) {
    return null;
  }

  const equipment = equipmentDatabase[equipmentType];

  return (
    <Card className="mt-3 bg-accent/30 border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img 
              src={equipment.image} 
              alt={equipment.name}
              className="w-24 h-18 object-cover rounded-lg border border-border"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {equipment.icon}
              <h4 className="font-semibold text-foreground">{equipment.name}</h4>
              <Badge variant="outline" className="text-xs">
                {equipment.model}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {equipment.description}
            </p>
            <div className="bg-warning/10 border border-warning/20 rounded p-2">
              <p className="text-xs font-medium text-warning-foreground">
                <strong>Método de reinicio:</strong> {equipment.restartMethod}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};