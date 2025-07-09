import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, ExternalLink } from "lucide-react";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'document' | 'video' | 'link';
  url: string;
  tags: string[];
  createdAt: string;
}

// Mock data - in a real app this would come from an API
const mockGuides: Guide[] = [
  {
    id: "1",
    title: "Manual de Configuración de Red",
    description: "Guía completa para configurar equipos de red en estaciones",
    category: "Networking",
    type: "document",
    url: "#",
    tags: ["cisco", "configuración", "red"],
    createdAt: "2024-01-15"
  },
  {
    id: "2", 
    title: "Procedimientos de Escalamiento",
    description: "Cuando y como escalar incidentes críticos",
    category: "Procesos",
    type: "document",
    url: "#",
    tags: ["escalamiento", "incidentes", "sop"],
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    title: "Troubleshooting de Conectividad",
    description: "Video tutorial para diagnosticar problemas de conexión",
    category: "Troubleshooting", 
    type: "video",
    url: "#",
    tags: ["ping", "tracert", "conectividad"],
    createdAt: "2024-01-05"
  }
];

export function GuidesList() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Simulate API call
    setGuides(mockGuides);
  }, []);

  const categories = ["all", ...Array.from(new Set(guides.map(g => g.category)))];
  const filteredGuides = selectedCategory === "all" 
    ? guides 
    : guides.filter(g => g.category === selectedCategory);

  const getTypeIcon = (type: Guide['type']) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'link': return <ExternalLink className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">📚 Guías y Documentación</h1>
        <p className="text-muted-foreground">
          Recursos y documentación para el Centro de Operaciones
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === "all" ? "Todas" : category}
          </Button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="noc-card hover:scale-[1.02] transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(guide.type)}
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                </div>
                <Badge variant="secondary">{guide.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {guide.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {guide.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {new Date(guide.createdAt).toLocaleDateString()}
                </span>
                <Button size="sm" className="glow-effect">
                  Abrir →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <Card className="noc-card">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              No hay guías en esta categoría
            </h3>
            <p className="text-muted-foreground mb-6">
              Intenta seleccionar otra categoría o contacta al administrador para agregar nuevas guías.
            </p>
            <Button onClick={() => setSelectedCategory("all")} variant="outline">
              Ver todas las guías
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}