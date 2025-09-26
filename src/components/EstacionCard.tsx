import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, HardDrive, ChevronRight } from "lucide-react";
import { Estacion } from "@/hooks/useEstaciones";

interface EstacionCardProps {
  estacion: Estacion;
  onClick: () => void;
}

export function EstacionCard({ estacion, onClick }: EstacionCardProps) {
  return (
    <Card 
      className="noc-card cursor-pointer hover:scale-[1.01] transition-all duration-200"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header con código y nombre */}
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 text-primary font-bold text-lg px-3 py-1 rounded-md">
                {estacion.codigo}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {estacion.nombre}
                </h3>
                <div className="flex items-center text-muted-foreground text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {estacion.ubicacion}
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Proveedores por área */}
              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Users className="w-4 h-4 mr-1" />
                  Proveedores
                </div>
                <div className="space-y-2">
                  {/* Proveedores generales */}
                  {estacion.proveedores.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {estacion.proveedores.slice(0, 2).map((proveedor) => (
                        <Badge key={proveedor} variant="outline" className="text-xs">
                          {proveedor}
                        </Badge>
                      ))}
                      {estacion.proveedores.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{estacion.proveedores.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Proveedores específicos por área */}
                  <div className="space-y-1">
                    {estacion.provider_backoffice && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Back Office:</span>
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {estacion.provider_backoffice}
                        </Badge>
                      </div>
                    )}
                    {estacion.provider_counter && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Mostradores:</span>
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {estacion.provider_counter}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Equipos */}
              <div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <HardDrive className="w-4 h-4 mr-1" />
                  Equipos ({estacion.equipos.length})
                </div>
                <div className="text-sm text-foreground">
                  {estacion.equipos.length > 0 ? (
                    <div className="space-y-1">
                      {estacion.equipos.slice(0, 2).map((equipo) => (
                        <div key={equipo.id} className="text-xs text-muted-foreground">
                          {equipo.modelo}
                        </div>
                      ))}
                      {estacion.equipos.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{estacion.equipos.length - 2} más
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin equipos</span>
                  )}
                </div>
              </div>

              {/* Contacto */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">
                  Contacto
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="truncate">{estacion.contacto.email}</div>
                  <div>{estacion.contacto.telefono}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="ml-4 flex items-center">
            <Button size="sm" className="glow-effect">
              Ver detalle
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}