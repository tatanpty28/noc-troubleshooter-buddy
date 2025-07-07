import { useState } from "react";
import { useEstaciones, Estacion } from "@/hooks/useEstaciones";
import { SearchBar } from "@/components/SearchBar";
import { EstacionCard } from "@/components/EstacionCard";
import { EstacionDetail } from "@/components/EstacionDetail";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Factory, MapPin, Wifi } from "lucide-react";

export default function Estaciones() {
  const { estaciones, loading, buscarEstaciones } = useEstaciones();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEstaciones, setFilteredEstaciones] = useState<Estacion[]>([]);
  const [selectedEstacion, setSelectedEstacion] = useState<Estacion | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = buscarEstaciones(query);
      setFilteredEstaciones(results);
      setShowResults(true);
    } else {
      setFilteredEstaciones([]);
      setShowResults(false);
    }
  };

  const handleSelectEstacion = (estacion: Estacion) => {
    setSelectedEstacion(estacion);
  };

  const handleBackToList = () => {
    setSelectedEstacion(null);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setFilteredEstaciones([]);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando estaciones...</p>
        </div>
      </div>
    );
  }

  // Vista de detalle de estación
  if (selectedEstacion) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={handleBackToList}
            variant="outline"
            className="mb-4"
          >
            ← Volver a la lista
          </Button>
        </div>
        <EstacionDetail 
          estacion={selectedEstacion} 
          onClose={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Factory className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Estaciones</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Gestión y monitoreo de estaciones de telecomunicaciones
        </p>
      </div>

      {/* Búsqueda */}
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por código (YUL), nombre o proveedor..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-4 pr-10 h-12 text-lg"
          />
          {searchQuery && (
            <Button
              onClick={resetSearch}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      {!showResults && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="noc-card">
            <CardContent className="p-6 text-center">
              <Factory className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{estaciones.length}</div>
              <div className="text-sm text-muted-foreground">Estaciones</div>
            </CardContent>
          </Card>
          <Card className="noc-card">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {new Set(estaciones.map(e => e.ubicacion.split(',')[1]?.trim())).size}
              </div>
              <div className="text-sm text-muted-foreground">Países</div>
            </CardContent>
          </Card>
          <Card className="noc-card">
            <CardContent className="p-6 text-center">
              <Wifi className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {estaciones.reduce((total, est) => total + est.equipos.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Equipos</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resultados de búsqueda */}
      {showResults && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {filteredEstaciones.length === 0 
              ? "No se encontraron estaciones" 
              : `${filteredEstaciones.length} estación${filteredEstaciones.length !== 1 ? 'es' : ''} encontrada${filteredEstaciones.length !== 1 ? 's' : ''}`
            }
          </h2>
        </div>
      )}

      {/* Lista de estaciones */}
      <div className="space-y-4">
        {(showResults ? filteredEstaciones : estaciones).map((estacion) => (
          <EstacionCard
            key={estacion.id}
            estacion={estacion}
            onClick={() => handleSelectEstacion(estacion)}
          />
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {showResults && filteredEstaciones.length === 0 && (
        <Card className="noc-card">
          <CardContent className="p-8 text-center">
            <Factory className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No se encontraron estaciones
            </h3>
            <p className="text-muted-foreground mb-4">
              Intenta con otros términos de búsqueda como código de estación, nombre o proveedor.
            </p>
            <Button onClick={resetSearch} variant="outline">
              Ver todas las estaciones
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mensaje cuando no hay estaciones */}
      {!showResults && estaciones.length === 0 && (
        <Card className="noc-card">
          <CardContent className="p-8 text-center">
            <Factory className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay estaciones configuradas
            </h3>
            <p className="text-muted-foreground">
              Las estaciones aparecerán aquí una vez que se configuren en el sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}