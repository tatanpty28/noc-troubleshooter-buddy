import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Estacion, Equipo, useEstaciones } from "@/hooks/useEstaciones";
import { MapPin, Wifi, Users, Activity, Play, Loader2, Eye } from "lucide-react";

interface EstacionDetailProps {
  estacion: Estacion;
  onClose: () => void;
}

export function EstacionDetail({ estacion, onClose }: EstacionDetailProps) {
  const { ejecutarPing, ejecutarTraceroute } = useEstaciones();
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [pingResult, setPingResult] = useState<any>(null);
  const [tracerouteResult, setTracerouteResult] = useState<any>(null);
  const [loadingPing, setLoadingPing] = useState(false);
  const [loadingTraceroute, setLoadingTraceroute] = useState(false);

  const handlePing = async () => {
    setLoadingPing(true);
    try {
      const result = await ejecutarPing(estacion.id);
      setPingResult(result);
    } catch (error) {
      console.error('Error en ping:', error);
    } finally {
      setLoadingPing(false);
    }
  };

  const handleTraceroute = async () => {
    setLoadingTraceroute(true);
    try {
      const result = await ejecutarTraceroute(estacion.id);
      setTracerouteResult(result);
    } catch (error) {
      console.error('Error en traceroute:', error);
    } finally {
      setLoadingTraceroute(false);
    }
  };

  const handlePingForTarget = async (section: 'backoffice' | 'counter', type: 'equipo' | 'publica') => {
    setLoadingPing(true);
    try {
      let targetIp = '';
      if (section === 'backoffice') {
        targetIp = type === 'equipo' ? estacion.ip_backoffice || '' : estacion.ip_publica_backoffice || '';
      } else {
        targetIp = type === 'equipo' ? estacion.ip_counter || '' : estacion.ip_publica_counter || '';
      }

      if (!targetIp) {
        setPingResult({
          success: false,
          error: 'IP no configurada',
          timestamp: new Date().toISOString(),
          target: 'Unknown',
          section,
          type
        });
        return;
      }

      // Simulate ping result with enhanced structure
      const result = {
        success: Math.random() > 0.3,
        latency: Math.floor(Math.random() * 50) + 20,
        packetLoss: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
        timestamp: new Date().toISOString(),
        target: targetIp,
        targetName: estacion.codigo,
        section,
        type
      };
      
      setPingResult(result);
    } catch (error) {
      console.error('Error en ping:', error);
    } finally {
      setLoadingPing(false);
    }
  };

  const handleTracerouteForTarget = async (section: 'backoffice' | 'counter', type: 'equipo' | 'publica') => {
    setLoadingTraceroute(true);
    try {
      let targetIp = '';
      if (section === 'backoffice') {
        targetIp = type === 'equipo' ? estacion.ip_backoffice || '' : estacion.ip_publica_backoffice || '';
      } else {
        targetIp = type === 'equipo' ? estacion.ip_counter || '' : estacion.ip_publica_counter || '';
      }

      if (!targetIp) {
        setTracerouteResult({
          success: false,
          error: 'IP no configurada',
          timestamp: new Date().toISOString(),
          target: 'Unknown',
          section,
          type
        });
        return;
      }

      // Simulate traceroute result with enhanced structure
      const hops = Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, i) => ({
        hop: i + 1,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        latency: Math.floor(Math.random() * 30) + 5
      }));

      const result = {
        success: true,
        hops,
        totalHops: hops.length,
        timestamp: new Date().toISOString(),
        target: targetIp,
        targetName: estacion.codigo,
        section,
        type
      };
      
      setTracerouteResult(result);
    } catch (error) {
      console.error('Error en traceroute:', error);
    } finally {
      setLoadingTraceroute(false);
    }
  };

  const openImageModal = (equipo: Equipo) => {
    setSelectedEquipo(equipo);
    setShowImageModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="noc-card">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary font-bold text-2xl px-4 py-2 rounded-lg">
                {estacion.codigo}
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">
                  {estacion.nombre}
                </CardTitle>
                <div className="flex items-center text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {estacion.ubicacion}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {estacion.equipos.length} equipo{estacion.equipos.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs de contenido */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores e IDs</TabsTrigger>
          <TabsTrigger value="equipos">Galería de Equipos</TabsTrigger>
          <TabsTrigger value="pruebas">Pruebas Rápidas</TabsTrigger>
        </TabsList>

        {/* Tab: Información General */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="noc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Código de Estación</div>
                  <div className="text-lg font-semibold text-foreground">{estacion.codigo}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nombre Completo</div>
                  <div className="text-foreground">{estacion.nombre}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Ubicación</div>
                  <div className="text-foreground">{estacion.ubicacion}</div>
                </div>
                {estacion.ip && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Dirección IP</div>
                    <div className="text-foreground font-mono">{estacion.ip}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="noc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="text-foreground">{estacion.contacto.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Teléfono</div>
                  <div className="text-foreground">{estacion.contacto.telefono}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo and Attachments */}
          {(estacion.photo || (estacion.attachments && estacion.attachments.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {estacion.photo && (
                <Card className="noc-card">
                  <CardHeader>
                    <CardTitle>Foto de Equipos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img 
                      src={estacion.photo} 
                      alt="Equipos de la estación"
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(estacion.photo, '_blank')}
                    />
                  </CardContent>
                </Card>
              )}

              {estacion.attachments && estacion.attachments.length > 0 && (
                <Card className="noc-card">
                  <CardHeader>
                    <CardTitle>Adjuntos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {estacion.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                          <span className="text-sm">Adjunto {index + 1}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(attachment, '_blank')}
                          >
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Tab: Proveedores */}
        <TabsContent value="proveedores" className="space-y-4">
          <Card className="noc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                Proveedores de Servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {estacion.proveedores.map((proveedor, index) => (
                  <div key={proveedor} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{proveedor}</h4>
                      <Badge variant="outline">Activo</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>ID: {estacion.codigo}-{proveedor.slice(0, 3).toUpperCase()}-{(index + 1).toString().padStart(3, '0')}</div>
                      <div>Tipo: WAN/Internet</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Equipos */}
        <TabsContent value="equipos" className="space-y-4">
          <Card className="noc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Equipos de Red
              </CardTitle>
            </CardHeader>
            <CardContent>
              {estacion.equipos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {estacion.equipos.map((equipo) => (
                    <div key={equipo.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="relative">
                        <img 
                          src={equipo.imagen} 
                          alt={equipo.modelo}
                          className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImageModal(equipo)}
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjMUExMUE4Ii8+CjxyZWN0IHg9IjIwIiB5PSIzNiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI1NiIgcng9IjQiIGZpbGw9IiMyMDIwMjQiLz4KPHN2ZyB4PSI5MCIgeT0iNTQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2Qjc1ODQiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0zIDcgNiA2IDYtNm0tNiA2VjJtMCAxM3YtMW0wIDBoMTBhMiAyIDAgMCAwIDItMlY2YTIgMiAwIDAgMC0yLTJINGEyIDIgMCAwIDAtMiAydjEwYTIgMiAwIDAgMCAyIDJoMTBhMiAyIDAgMCAwIDItMlY2YTIgMiAwIDAgMC0yLTJINGEyIDIgMCAwIDAtMiAydjEwYTIgMiAwIDAgMCAyIDJ6Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
                          }}
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                          onClick={() => openImageModal(equipo)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground">{equipo.modelo}</h4>
                        {equipo.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">{equipo.descripcion}</p>
                        )}
                        {equipo.metodoReinicio && (
                          <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded text-xs">
                            <strong>Reinicio:</strong> {equipo.metodoReinicio}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No hay equipos registrados para esta estación
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Pruebas */}
        <TabsContent value="pruebas" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* BackOffice Section */}
            <Card className="noc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  BackOffice - {estacion.provider_backoffice || 'Sin proveedor'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ping BackOffice */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handlePingForTarget('backoffice', 'equipo')}
                      disabled={loadingPing || !estacion.ip_backoffice}
                      className="w-full"
                      size="sm"
                    >
                      {loadingPing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Ping Equipo ({estacion.ip_backoffice || 'Sin IP'})
                    </Button>
                    
                    <Button 
                      onClick={() => handlePingForTarget('backoffice', 'publica')}
                      disabled={loadingPing || !estacion.ip_publica_backoffice}
                      className="w-full"
                      size="sm"
                      variant="secondary"
                    >
                      {loadingPing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Ping Pública ({estacion.ip_publica_backoffice || 'Sin IP'})
                    </Button>
                  </div>
                  
                  {/* Traceroute BackOffice */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleTracerouteForTarget('backoffice', 'equipo')}
                      disabled={loadingTraceroute || !estacion.ip_backoffice}
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      {loadingTraceroute ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Tracert Equipo
                    </Button>
                    
                    <Button 
                      onClick={() => handleTracerouteForTarget('backoffice', 'publica')}
                      disabled={loadingTraceroute || !estacion.ip_publica_backoffice}
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      {loadingTraceroute ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Tracert Pública
                    </Button>
                  </div>
                </div>
                
                {(!estacion.ip_backoffice && !estacion.ip_publica_backoffice) && (
                  <p className="text-sm text-muted-foreground text-center">
                    Falta IP para pruebas de BackOffice
                  </p>
                )}
                
                {pingResult && pingResult.section === 'backoffice' && (
                  <div className="p-4 bg-accent/30 rounded-lg text-sm space-y-2">
                    <div className="font-mono">
                      <div className="font-semibold text-primary">BackOffice - {pingResult.type}</div>
                      <div>Target: {pingResult.target} ({estacion.codigo})</div>
                      <div className={pingResult.success ? 'text-success' : 'text-destructive'}>
                        Status: {pingResult.success ? 'SUCCESS' : 'FAILED'}
                      </div>
                      {pingResult.error && (
                        <div className="text-destructive">Error: {pingResult.error}</div>
                      )}
                      {pingResult.success && (
                        <>
                          <div>Latency: {pingResult.latency}ms</div>
                          <div>Packet Loss: {pingResult.packetLoss}%</div>
                        </>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(pingResult.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
                
                {tracerouteResult && tracerouteResult.section === 'backoffice' && (
                  <div className="p-4 bg-accent/30 rounded-lg text-sm max-h-64 overflow-y-auto">
                    <div className="font-mono space-y-1">
                      <div className="font-semibold text-primary">BackOffice - {tracerouteResult.type}</div>
                      <div className="font-semibold">Target: {tracerouteResult.target} ({estacion.codigo})</div>
                      {tracerouteResult.error ? (
                        <div className="text-destructive">Error: {tracerouteResult.error}</div>
                      ) : (
                        <>
                          <div className="text-success">Total Hops: {tracerouteResult.totalHops}</div>
                          <div className="border-t border-border pt-2 mt-2">
                            {tracerouteResult.hops.map((hop: any) => (
                              <div key={hop.hop} className="flex justify-between">
                                <span>{hop.hop}. {hop.ip}</span>
                                <span>{hop.latency}ms</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                        {new Date(tracerouteResult.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mostrador Section */}
            <Card className="noc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary" />
                  Mostrador - {estacion.provider_counter || 'Sin proveedor'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ping Mostrador */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handlePingForTarget('counter', 'equipo')}
                      disabled={loadingPing || !estacion.ip_counter}
                      className="w-full"
                      size="sm"
                    >
                      {loadingPing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Ping Equipo ({estacion.ip_counter || 'Sin IP'})
                    </Button>
                    
                    <Button 
                      onClick={() => handlePingForTarget('counter', 'publica')}
                      disabled={loadingPing || !estacion.ip_publica_counter}
                      className="w-full"
                      size="sm"
                      variant="secondary"
                    >
                      {loadingPing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Ping Pública ({estacion.ip_publica_counter || 'Sin IP'})
                    </Button>
                  </div>
                  
                  {/* Traceroute Mostrador */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleTracerouteForTarget('counter', 'equipo')}
                      disabled={loadingTraceroute || !estacion.ip_counter}
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      {loadingTraceroute ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Tracert Equipo
                    </Button>
                    
                    <Button 
                      onClick={() => handleTracerouteForTarget('counter', 'publica')}
                      disabled={loadingTraceroute || !estacion.ip_publica_counter}
                      className="w-full"
                      size="sm"
                      variant="outline"
                    >
                      {loadingTraceroute ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Tracert Pública
                    </Button>
                  </div>
                </div>
                
                {(!estacion.ip_counter && !estacion.ip_publica_counter) && (
                  <p className="text-sm text-muted-foreground text-center">
                    Falta IP para pruebas de Mostrador
                  </p>
                )}
                
                {pingResult && pingResult.section === 'counter' && (
                  <div className="p-4 bg-accent/30 rounded-lg text-sm space-y-2">
                    <div className="font-mono">
                      <div className="font-semibold text-secondary">Mostrador - {pingResult.type}</div>
                      <div>Target: {pingResult.target} ({estacion.codigo})</div>
                      <div className={pingResult.success ? 'text-success' : 'text-destructive'}>
                        Status: {pingResult.success ? 'SUCCESS' : 'FAILED'}
                      </div>
                      {pingResult.error && (
                        <div className="text-destructive">Error: {pingResult.error}</div>
                      )}
                      {pingResult.success && (
                        <>
                          <div>Latency: {pingResult.latency}ms</div>
                          <div>Packet Loss: {pingResult.packetLoss}%</div>
                        </>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(pingResult.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
                
                {tracerouteResult && tracerouteResult.section === 'counter' && (
                  <div className="p-4 bg-accent/30 rounded-lg text-sm max-h-64 overflow-y-auto">
                    <div className="font-mono space-y-1">
                      <div className="font-semibold text-secondary">Mostrador - {tracerouteResult.type}</div>
                      <div className="font-semibold">Target: {tracerouteResult.target} ({estacion.codigo})</div>
                      {tracerouteResult.error ? (
                        <div className="text-destructive">Error: {tracerouteResult.error}</div>
                      ) : (
                        <>
                          <div className="text-success">Total Hops: {tracerouteResult.totalHops}</div>
                          <div className="border-t border-border pt-2 mt-2">
                            {tracerouteResult.hops.map((hop: any) => (
                              <div key={hop.hop} className="flex justify-between">
                                <span>{hop.hop}. {hop.ip}</span>
                                <span>{hop.latency}ms</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                        {new Date(tracerouteResult.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de imagen */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEquipo?.modelo}
            </DialogTitle>
          </DialogHeader>
          {selectedEquipo && (
            <div className="space-y-4">
              <img 
                src={selectedEquipo.imagen} 
                alt={selectedEquipo.modelo}
                className="w-full max-h-96 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUExMUE4Ii8+CjxyZWN0IHg9IjQwIiB5PSI4MCIgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxNDAiIHJ4PSI4IiBmaWxsPSIjMjAyMDI0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3NTg0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
              <div className="space-y-2">
                {selectedEquipo.descripcion && (
                  <p className="text-muted-foreground">{selectedEquipo.descripcion}</p>
                )}
                {selectedEquipo.metodoReinicio && (
                  <div className="p-3 bg-warning/10 border border-warning/20 rounded">
                    <p className="text-sm">
                      <strong>Método de reinicio:</strong> {selectedEquipo.metodoReinicio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}