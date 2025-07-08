import { useState } from "react";
import { useNOCData } from "@/hooks/useNOCData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, CheckCircle, AlertTriangle, XCircle, Calendar, User } from "lucide-react";
import { CaseHistory } from "@/data/troubleshootingData";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'resuelto': return 'default';
    case 'escalado': return 'secondary';
    case 'sin_resolver': return 'destructive';
    default: return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'resuelto': return <CheckCircle className="w-4 h-4" />;
    case 'escalado': return <AlertTriangle className="w-4 h-4" />;
    case 'sin_resolver': return <XCircle className="w-4 h-4" />;
    default: return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'resuelto': return 'Resuelto';
    case 'escalado': return 'Escalado';
    case 'sin_resolver': return 'Sin Resolver';
    default: return status;
  }
};

export default function Casos() {
  const { cases: caseHistory } = useNOCData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseHistory | null>(null);

  const filteredCases = caseHistory.filter(caso =>
    caso.incidentDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caso.technicianName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caso.relatedKB.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetSearch = () => {
    setSearchQuery("");
  };

  // Vista de detalle del caso
  if (selectedCase) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={() => setSelectedCase(null)}
            variant="outline"
            className="mb-4"
          >
            ← Volver a la lista
          </Button>
        </div>

        <Card className="noc-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl text-foreground mb-2">
                  Caso {selectedCase.id}
                </CardTitle>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedCase.dateResolved}
                  </div>
                  {selectedCase.technicianName && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedCase.technicianName}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant={getStatusColor(selectedCase.finalResult)} className="flex items-center gap-1">
                {getStatusIcon(selectedCase.finalResult)}
                {getStatusLabel(selectedCase.finalResult)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Descripción del incidente */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Descripción del Incidente</h3>
              <p className="text-muted-foreground">{selectedCase.incidentDescription}</p>
            </div>

            {/* KB Relacionado */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">KB Relacionado</h3>
              <Badge variant="outline">{selectedCase.relatedKB}</Badge>
            </div>

            {/* Acciones realizadas */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Acciones Realizadas</h3>
              <div className="space-y-2">
                {selectedCase.actionsPerformed.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                    <div className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas adicionales */}
            {selectedCase.additionalNotes && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Notas Adicionales</h3>
                <div className="p-4 bg-accent/20 border border-border rounded-lg">
                  <p className="text-sm text-foreground">{selectedCase.additionalNotes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Casos Históricos</h1>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← Volver al Inicio
          </Button>
        </div>
        <p className="text-muted-foreground text-lg">
          Historial de casos resueltos y documentación de incidencias
        </p>
      </div>

      {/* Búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar casos por descripción, técnico, o KB..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-12"
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="noc-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{caseHistory.length}</div>
            <div className="text-sm text-muted-foreground">Total Casos</div>
          </CardContent>
        </Card>
        <Card className="noc-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {caseHistory.filter(c => c.finalResult === 'resuelto').length}
            </div>
            <div className="text-sm text-muted-foreground">Resueltos</div>
          </CardContent>
        </Card>
        <Card className="noc-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">
              {caseHistory.filter(c => c.finalResult === 'escalado').length}
            </div>
            <div className="text-sm text-muted-foreground">Escalados</div>
          </CardContent>
        </Card>
        <Card className="noc-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {caseHistory.filter(c => c.finalResult === 'sin_resolver').length}
            </div>
            <div className="text-sm text-muted-foreground">Sin Resolver</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de casos */}
      <Card className="noc-card">
        <CardHeader>
          <CardTitle>
            {searchQuery 
              ? `${filteredCases.length} caso${filteredCases.length !== 1 ? 's' : ''} encontrado${filteredCases.length !== 1 ? 's' : ''}`
              : `${caseHistory.length} caso${caseHistory.length !== 1 ? 's' : ''} registrado${caseHistory.length !== 1 ? 's' : ''}`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>KB</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((caso) => (
                  <TableRow 
                    key={caso.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => setSelectedCase(caso)}
                  >
                    <TableCell className="font-medium">{caso.id}</TableCell>
                    <TableCell>{caso.dateResolved}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {caso.incidentDescription}
                    </TableCell>
                    <TableCell>{caso.technicianName || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(caso.finalResult)} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(caso.finalResult)}
                        {getStatusLabel(caso.finalResult)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{caso.relatedKB}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        Ver →
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              {searchQuery ? (
                <div>
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No se encontraron casos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    No hay casos que coincidan con tu búsqueda "{searchQuery}"
                  </p>
                  <Button onClick={resetSearch} variant="outline">
                    Ver todos los casos
                  </Button>
                </div>
              ) : (
                <div>
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No hay casos registrados
                  </h3>
                  <p className="text-muted-foreground">
                    Los casos históricos aparecerán aquí una vez que se resuelvan incidencias.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}