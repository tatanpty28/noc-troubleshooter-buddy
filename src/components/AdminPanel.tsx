import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Eye, Trash2, BookOpen, FileText } from "lucide-react";
import { knowledgeBaseDatabase, caseHistoryDatabase, KnowledgeBase, CaseHistory } from "@/data/troubleshootingData";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("kbs");
  const [kbDialogOpen, setKbDialogOpen] = useState(false);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null);
  const [editingCase, setEditingCase] = useState<CaseHistory | null>(null);

  const handleSaveKB = () => {
    toast({
      title: "KB Guardado",
      description: "El Knowledge Base ha sido guardado exitosamente.",
    });
    setKbDialogOpen(false);
    setEditingKB(null);
  };

  const handleSaveCase = () => {
    toast({
      title: "Caso Guardado",
      description: "El caso histórico ha sido registrado exitosamente.",
    });
    setCaseDialogOpen(false);
    setEditingCase(null);
  };

  const KBForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kb-id">ID del KB</Label>
          <Input id="kb-id" placeholder="KB004" defaultValue={editingKB?.id} />
        </div>
        <div>
          <Label htmlFor="kb-category">Categoría</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comunicaciones">Comunicaciones</SelectItem>
              <SelectItem value="conectividad">Conectividad</SelectItem>
              <SelectItem value="infraestructura">Infraestructura</SelectItem>
              <SelectItem value="aplicaciones">Aplicaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="kb-title">Título</Label>
        <Input id="kb-title" placeholder="Descripción del problema" defaultValue={editingKB?.title} />
      </div>
      
      <div>
        <Label htmlFor="kb-description">Descripción</Label>
        <Textarea id="kb-description" placeholder="Descripción detallada del problema" defaultValue={editingKB?.description} />
      </div>
      
      <div>
        <Label htmlFor="kb-keywords">Palabras clave (separadas por comas)</Label>
        <Input id="kb-keywords" placeholder="palabra1, palabra2, palabra3" defaultValue={editingKB?.keywords.join(", ")} />
      </div>
      
      <div>
        <Label htmlFor="kb-escalation">Información de Escalamiento</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input placeholder="Proveedor" defaultValue={editingKB?.escalation.provider} />
          <Input placeholder="Email" defaultValue={editingKB?.escalation.email} />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setKbDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleSaveKB}>Guardar KB</Button>
      </div>
    </div>
  );

  const CaseForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="case-id">ID del Caso</Label>
          <Input id="case-id" placeholder="CAS004" defaultValue={editingCase?.id} />
        </div>
        <div>
          <Label htmlFor="related-kb">KB Relacionado</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar KB" />
            </SelectTrigger>
            <SelectContent>
              {knowledgeBaseDatabase.map((kb) => (
                <SelectItem key={kb.id} value={kb.id}>{kb.id} - {kb.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="case-description">Descripción del Incidente</Label>
        <Textarea id="case-description" placeholder="¿Qué pasó exactamente?" defaultValue={editingCase?.incidentDescription} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="case-date">Fecha de Resolución</Label>
          <Input id="case-date" type="date" defaultValue={editingCase?.dateResolved} />
        </div>
        <div>
          <Label htmlFor="technician">Técnico Responsable</Label>
          <Input id="technician" placeholder="Nombre del técnico" defaultValue={editingCase?.technicianName} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="actions">Acciones Realizadas (una por línea)</Label>
        <Textarea id="actions" placeholder="Acción 1&#10;Acción 2&#10;Acción 3" defaultValue={editingCase?.actionsPerformed.join("\n")} />
      </div>
      
      <div>
        <Label htmlFor="result">Resultado Final</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar resultado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="resuelto">Resuelto</SelectItem>
            <SelectItem value="escalado">Escalado</SelectItem>
            <SelectItem value="sin_resolver">Sin Resolver</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Notas Adicionales</Label>
        <Textarea id="notes" placeholder="Observaciones importantes..." defaultValue={editingCase?.additionalNotes} />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setCaseDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleSaveCase}>Guardar Caso</Button>
      </div>
    </div>
  );

  return (
    <Card className="noc-card w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Panel de Administración NOC
          </CardTitle>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="kbs">Knowledge Bases</TabsTrigger>
            <TabsTrigger value="cases">Casos Históricos</TabsTrigger>
          </TabsList>

          <TabsContent value="kbs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Gestión de Knowledge Bases</h3>
              <Dialog open={kbDialogOpen} onOpenChange={setKbDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="glow-effect">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo KB
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingKB ? "Editar Knowledge Base" : "Nuevo Knowledge Base"}
                    </DialogTitle>
                  </DialogHeader>
                  <KBForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {knowledgeBaseDatabase.map((kb) => (
                <Card key={kb.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{kb.id}: {kb.title}</h4>
                          <Badge variant="secondary">{kb.category}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{kb.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Actualizado: {kb.lastUpdated} | Pasos: {kb.checklist.length}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingKB(kb);
                          setKbDialogOpen(true);
                        }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Gestión de Casos Históricos</h3>
              <Dialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="glow-effect">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Caso
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCase ? "Editar Caso" : "Nuevo Caso Histórico"}
                    </DialogTitle>
                  </DialogHeader>
                  <CaseForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {caseHistoryDatabase.map((case_) => (
                <Card key={case_.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{case_.id}</h4>
                          <Badge variant="outline">KB: {case_.relatedKB}</Badge>
                          <Badge 
                            variant={
                              case_.finalResult === 'resuelto' ? 'default' : 
                              case_.finalResult === 'escalado' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {case_.finalResult.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{case_.incidentDescription}</p>
                        <div className="text-xs text-muted-foreground">
                          Resuelto: {case_.dateResolved} | Técnico: {case_.technicianName || "No especificado"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingCase(case_);
                          setCaseDialogOpen(true);
                        }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};