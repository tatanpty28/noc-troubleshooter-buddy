import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

export interface FilterOptions {
  proveedor: string;
  area: string;
}

interface EstacionFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableProviders: string[];
}

export function EstacionFilters({ onFilterChange, availableProviders }: EstacionFiltersProps) {
  const [selectedProveedor, setSelectedProveedor] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");

  const areas = [
    { value: "backoffice", label: "Back Office" },
    { value: "mostradores", label: "Mostradores" },
    { value: "ambos", label: "Ambos" }
  ];

  const handleProveedorChange = (value: string) => {
    setSelectedProveedor(value);
    onFilterChange({
      proveedor: value,
      area: selectedArea
    });
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    onFilterChange({
      proveedor: selectedProveedor,
      area: value
    });
  };

  const clearFilters = () => {
    setSelectedProveedor("");
    setSelectedArea("");
    onFilterChange({
      proveedor: "",
      area: ""
    });
  };

  const hasActiveFilters = selectedProveedor || selectedArea;

  return (
    <Card className="noc-card mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtros:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Filtro por Proveedor */}
            <div className="min-w-[180px]">
              <Select value={selectedProveedor} onValueChange={handleProveedorChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  {availableProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Área */}
            <div className="min-w-[150px]">
              <Select value={selectedArea} onValueChange={handleAreaChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  {areas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Filtros activos */}
        {hasActiveFilters && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            {selectedProveedor && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedProveedor}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleProveedorChange("")}
                />
              </Badge>
            )}
            {selectedArea && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {areas.find(a => a.value === selectedArea)?.label || selectedArea}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleAreaChange("")}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}