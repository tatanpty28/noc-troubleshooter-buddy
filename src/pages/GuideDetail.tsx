import { useParams, useNavigate } from "react-router-dom";
import { useNOCData } from "@/hooks/useNOCData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getGuide } = useNOCData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="noc-card">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Guía no encontrada</h1>
            <p className="text-muted-foreground mb-6">
              No se pudo cargar la guía solicitada.
            </p>
            <Button onClick={() => navigate('/guides')} variant="outline">
              ← Volver a Guías
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const guide = getGuide(id);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="noc-card">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Guía no encontrada</h1>
            <p className="text-muted-foreground mb-6">
              La guía con ID "{id}" no existe.
            </p>
            <Button onClick={() => navigate('/guides')} variant="outline">
              ← Volver a Guías
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={() => navigate('/guides')}
          variant="outline"
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Guías
        </Button>
      </div>

      {/* Guide Content */}
      <Card className="noc-card">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            📚 {guide.title}
          </CardTitle>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>Creado: {new Date(guide.dateCreated).toLocaleDateString()}</span>
            {guide.lastUpdated !== guide.dateCreated && (
              <span>• Actualizado: {new Date(guide.lastUpdated).toLocaleDateString()}</span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Contenido</h3>
            <div className="noc-card p-4">
              <pre className="whitespace-pre-wrap text-foreground font-mono text-sm leading-relaxed">
                {guide.content}
              </pre>
            </div>
          </div>

          {/* Attachments */}
          {guide.attachments && guide.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Adjuntos</h3>
              <div className="space-y-2">
                {guide.attachments.map((attachment, index) => (
                  <Card key={index} className="noc-card">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{attachment.name || `Archivo ${index + 1}`}</span>
                        {attachment.size && (
                          <Badge variant="outline" className="text-xs">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </Badge>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        Descargar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {guide.images && guide.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Imágenes de Referencia</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {guide.images.map((image, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Card className="noc-card cursor-pointer hover:scale-105 transition-transform">
                        <CardContent className="p-2">
                          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {image.url ? (
                              <img 
                                src={image.url} 
                                alt={image.name || `Imagen ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center text-muted-foreground">
                                <ImageIcon className="w-8 h-8 mb-2" />
                                <span className="text-xs text-center px-2">
                                  {image.name || `Imagen ${index + 1}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <div className="flex flex-col items-center">
                        {image.url ? (
                          <img 
                            src={image.url} 
                            alt={image.name || `Imagen ${index + 1}`}
                            className="max-w-full max-h-[70vh] object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground p-8">
                            <ImageIcon className="w-16 h-16 mb-4" />
                            <span>{image.name || `Imagen ${index + 1}`}</span>
                            <span className="text-sm mt-2">Imagen no disponible</span>
                          </div>
                        )}
                        <p className="text-center text-muted-foreground mt-4">
                          {image.name || `Imagen ${index + 1}`}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}