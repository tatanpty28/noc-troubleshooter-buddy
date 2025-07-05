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
import { Plus, Edit2, Eye, Trash2, BookOpen, Settings2 } from "lucide-react";
import { KnowledgeBase, CaseHistory, ChecklistItem, EscalationInfo } from "@/data/troubleshootingData";
import { useToast } from "@/hooks/use-toast";
import { useNOCData } from "@/hooks/useNOCData";

interface AdminPanelProps {
  onClose: () => void;
}

interface KBFormData extends Partial<KnowledgeBase> {
  keywordsText?: string;
  escalationProvider?: string;
  escalationEmail?: string;
}

interface CaseFormData extends Partial<CaseHistory> {
  actionsText?: string;
  finalResult?: 'resuelto' | 'escalado' | 'sin_resolver';
}

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { toast } = useToast();
  const { kbs, cases, saveKB, saveCase, deleteKB, deleteCase, userRole, updateUserRole } = useNOCData();
  const [activeTab, setActiveTab] = useState("kbs");
  const [kbDialogOpen, setKbDialogOpen] = useState(false);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null);
  const [editingCase, setEditingCase] = useState<CaseHistory | null>(null);
  const [kbFormData, setKbFormData] = useState<KBFormData>({});
  const [caseFormData, setCaseFormData] = useState<CaseFormData>({});

  const handleSaveKB = () => {
    if (!kbFormData.id || !kbFormData.title || !kbFormData.description) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    const newKB: KnowledgeBase = {
      id: kbFormData.id,
      title: kbFormData.title,
      description: kbFormData.description,
      keywords: kbFormData.keywordsText?.split(',').map(k => k.trim()) || [],
      category: kbFormData.category || "General",
      checklist: kbFormData.checklist || [],
      escalation: kbFormData.escalation || {
        provider: kbFormData.escalationProvider || "",
        email: kbFormData.escalationEmail || ""
      },
      dateCreated: editingKB?.dateCreated || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const success = saveKB(newKB);
    if (success) {
      toast({
        title: "KB Guardado",
        description: "El Knowledge Base ha sido guardado exitosamente.",
      });
      setKbDialogOpen(false);
      setEditingKB(null);
      setKbFormData({});
    }
  };

  const handleSaveCase = () => {
    if (!caseFormData.id || !caseFormData.incidentDescription || !caseFormData.relatedKB) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    const newCase: CaseHistory = {
      id: caseFormData.id,
      relatedKB: caseFormData.relatedKB,
      incidentDescription: caseFormData.incidentDescription,
      dateResolved: caseFormData.dateResolved || new Date().toISOString().split('T')[0],
      technicianName: caseFormData.technicianName,
      actionsPerformed: caseFormData.actionsText?.split('\n').filter(a => a.trim()) || [],
      finalResult: (caseFormData.finalResult as 'resuelto' | 'escalado' | 'sin_resolver') || 'resuelto',
      additionalNotes: caseFormData.additionalNotes
    };

    const success = saveCase(newCase);
    if (success) {
      toast({
        title: "Caso Guardado",
        description: "El caso histórico ha sido registrado exitosamente.",
      });
      setCaseDialogOpen(false);
      setEditingCase(null);
      setCaseFormData({});
    }
  };

  const KBForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kb-id">ID del KB*</Label>
          <Input 
            id="kb-id" 
            placeholder="KB004" 
            value={kbFormData.id || ''}
            onChange={(e) => setKbFormData(prev => ({ ...prev, id: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="kb-category">Categoría</Label>
          <Select 
            value={kbFormData.category} 
            onValueChange={(value) => setKbFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comunicaciones">Comunicaciones</SelectItem>
              <SelectItem value="Conectividad">Conectividad</SelectItem>
              <SelectItem value="Infraestructura">Infraestructura</SelectItem>
              <SelectItem value="Aplicaciones">Aplicaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="kb-title">Título*</Label>
        <Input 
          id="kb-title" 
          placeholder="Descripción del problema" 
          value={kbFormData.title || ''}
          onChange={(e) => setKbFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="kb-description">Descripción*</Label>
        <Textarea 
          id="kb-description" 
          placeholder="Descripción detallada del problema" 
          value={kbFormData.description || ''}
          onChange={(e) => setKbFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="kb-keywords">Palabras clave (separadas por comas)</Label>
        <Input 
          id="kb-keywords" 
          placeholder="palabra1, palabra2, palabra3" 
          value={kbFormData.keywordsText || ''}
          onChange={(e) => setKbFormData(prev => ({ ...prev, keywordsText: e.target.value }))}
        />
      </div>
      
      <div>
        <Label>Información de Escalamiento</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input 
            placeholder="Proveedor" 
            value={kbFormData.escalationProvider || ''}
            onChange={(e) => setKbFormData(prev => ({ ...prev, escalationProvider: e.target.value }))}
          />
          <Input 
            placeholder="Email" 
            value={kbFormData.escalationEmail || ''}
            onChange={(e) => setKbFormData(prev => ({ ...prev, escalationEmail: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setKbDialogOpen(false);
          setEditingKB(null);
          setKbFormData({});
        }}>Cancelar</Button>
        <Button onClick={handleSaveKB}>Guardar KB</Button>
      </div>
    </div>
  );

  const CaseForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="case-id">ID del Caso*</Label>
          <Input 
            id="case-id" 
            placeholder="CAS004" 
            value={caseFormData.id || ''}
            onChange={(e) => setCaseFormData(prev => ({ ...prev, id: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="related-kb">KB Relacionado*</Label>
          <Select 
            value={caseFormData.relatedKB} 
            onValueChange={(value) => setCaseFormData(prev => ({ ...prev, relatedKB: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar KB" />
            </SelectTrigger>
            <SelectContent>
              {kbs.map((kb) => (
                <SelectItem key={kb.id} value={kb.id}>{kb.id} - {kb.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="case-description">Descripción del Incidente*</Label>
        <Textarea 
          id="case-description" 
          placeholder="¿Qué pasó exactamente?" 
          value={caseFormData.incidentDescription || ''}
          onChange={(e) => setCaseFormData(prev => ({ ...prev, incidentDescription: e.target.value }))}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="case-date">Fecha de Resolución</Label>
          <Input 
            id="case-date" 
            type="date" 
            value={caseFormData.dateResolved || ''}
            onChange={(e) => setCaseFormData(prev => ({ ...prev, dateResolved: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="technician">Técnico Responsable</Label>
          <Input 
            id="technician" 
            placeholder="Nombre del técnico" 
            value={caseFormData.technicianName || ''}
            onChange={(e) => setCaseFormData(prev => ({ ...prev, technicianName: e.target.value }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="actions">Acciones Realizadas (una por línea)</Label>
        <Textarea 
          id="actions" 
          placeholder="Acción 1&#10;Acción 2&#10;Acción 3" 
          value={caseFormData.actionsText || ''}
          onChange={(e) => setCaseFormData(prev => ({ ...prev, actionsText: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="result">Resultado Final</Label>
        <Select 
          value={caseFormData.finalResult} 
          onValueChange={(value) => setCaseFormData(prev => ({ ...prev, finalResult: value as 'resuelto' | 'escalado' | 'sin_resolver' }))}
        >
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
        <Textarea 
          id="notes" 
          placeholder="Observaciones importantes..." 
          value={caseFormData.additionalNotes || ''}
          onChange={(e) => setCaseFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setCaseDialogOpen(false);
          setEditingCase(null);
          setCaseFormData({});
        }}>Cancelar</Button>
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
            <Badge variant="outline" className="ml-2">Rol: {userRole}</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Select value={userRole} onValueChange={(value: any) => updateUserRole(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
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
              {kbs.map((kb) => (
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
                          setKbFormData({
                            id: kb.id,
                            title: kb.title,
                            description: kb.description,
                            keywordsText: kb.keywords.join(', '),
                            category: kb.category,
                            escalationProvider: kb.escalation.provider,
                            escalationEmail: kb.escalation.email
                          });
                          setKbDialogOpen(true);
                        }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este KB?')) {
                            deleteKB(kb.id);
                            toast({
                              title: "KB Eliminado",
                              description: "El Knowledge Base ha sido eliminado.",
                            });
                          }
                        }}>
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
              {cases.map((case_) => (
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
                          setCaseFormData({
                            id: case_.id,
                            relatedKB: case_.relatedKB,
                            incidentDescription: case_.incidentDescription,
                            dateResolved: case_.dateResolved,
                            technicianName: case_.technicianName,
                            actionsText: case_.actionsPerformed.join('\n'),
                            finalResult: case_.finalResult,
                            additionalNotes: case_.additionalNotes
                          });
                          setCaseDialogOpen(true);
                        }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este caso?')) {
                            deleteCase(case_.id);
                            toast({
                              title: "Caso Eliminado",
                              description: "El caso histórico ha sido eliminado.",
                            });
                          }
                        }}>
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