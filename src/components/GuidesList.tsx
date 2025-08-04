import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, FileText, Video, ExternalLink, Search } from "lucide-react";
import { useNOCData } from "@/hooks/useNOCData";
import { useNavigate } from "react-router-dom";

export function GuidesList() {
  const { guides, searchGuides } = useNOCData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();

  // Get categories from actual guides
  const categories = ["all"];
  
  // Filter guides based on search and category
  const filteredGuides = (() => {
    let filtered = guides;
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchGuides(searchQuery.trim());
    }
    
    // Apply category filter if needed (for future use)
    if (selectedCategory !== "all") {
      // Guide interface doesn't have category yet, but we keep this for future extension
      // filtered = filtered.filter(g => g.category === selectedCategory);
    }
    
    return filtered;
  })();

  const handleOpenGuide = (guideId: string) => {
    navigate(`/guides/${guideId}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">📚 Guías y Documentación</h1>
        <p className="text-muted-foreground">
          Recursos y documentación para el Centro de Operaciones
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar en guías..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Guides Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="noc-card hover:scale-[1.02] transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {guide.content.substring(0, 150)}...
              </p>
              
              {guide.images && guide.images.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="outline" className="text-xs">
                    📷 {guide.images.length} imagen{guide.images.length > 1 ? 'es' : ''}
                  </Badge>
                </div>
              )}

              {guide.attachments && guide.attachments.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="outline" className="text-xs">
                    📎 {guide.attachments.length} archivo{guide.attachments.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {new Date(guide.dateCreated).toLocaleDateString()}
                </span>
                <Button 
                  size="sm" 
                  className="glow-effect"
                  onClick={() => handleOpenGuide(guide.id)}
                >
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