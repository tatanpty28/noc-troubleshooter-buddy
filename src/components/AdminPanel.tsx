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
import { KnowledgeBase, CaseHistory, ChecklistItem, EscalationInfo, Guide, GuideAttachment, GuideImage } from "@/data/troubleshootingData";
import { useToast } from "@/hooks/use-toast";
import { useNOCData } from "@/hooks/useNOCData";
import { Estacion, Equipo } from "@/hooks/useEstaciones";

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

interface EstacionFormData extends Partial<Estacion> {
  proveedoresText?: string;
  equiposData?: Array<{
    modelo: string;
    descripcion: string;
    metodoReinicio: string;
    imagen: string;
  }>;
  attachmentFiles?: FileList | null;
  photoFile?: File | null;
}

interface GuideFormData extends Partial<Guide> {
  attachmentFiles?: FileList | null;
  imageFiles?: FileList | null;
}

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { toast } = useToast();
  const { kbs, cases, estaciones, guides, saveKB, saveCase, saveEstacion, saveGuide, deleteKB, deleteCase, deleteEstacion, deleteGuide, userRole, updateUserRole } = useNOCData();
  const [activeTab, setActiveTab] = useState("kbs");
  const [kbDialogOpen, setKbDialogOpen] = useState(false);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [estacionDialogOpen, setEstacionDialogOpen] = useState(false);
  const [guideDialogOpen, setGuideDialogOpen] = useState(false);
  const [editingKB, setEditingKB] = useState<KnowledgeBase | null>(null);
  const [editingCase, setEditingCase] = useState<CaseHistory | null>(null);
  const [editingEstacion, setEditingEstacion] = useState<Estacion | null>(null);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [kbFormData, setKbFormData] = useState<KBFormData>({});
  const [caseFormData, setCaseFormData] = useState<CaseFormData>({});
  const [estacionFormData, setEstacionFormData] = useState<EstacionFormData>({});
  const [guideFormData, setGuideFormData] = useState<GuideFormData>({});

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

  const handleSaveEstacion = async () => {
    if (!estacionFormData.codigo || !estacionFormData.nombre) {
      toast({
        title: "Error",
        description: "Por favor completa código y nombre de la estación.",
        variant: "destructive"
      });
      return;
    }

    // Handle file uploads
    const attachments: string[] = [];
    let photoDataUrl = estacionFormData.photo || "";

    // Process attachments
    if (estacionFormData.attachmentFiles) {
      for (let i = 0; i < estacionFormData.attachmentFiles.length; i++) {
        const file = estacionFormData.attachmentFiles[i];
        const dataUrl = await fileToDataUrl(file);
        attachments.push(dataUrl);
      }
    }

    // Process photo
    if (estacionFormData.photoFile) {
      photoDataUrl = await fileToDataUrl(estacionFormData.photoFile);
    }

    const newEstacion: Estacion = {
      id: editingEstacion?.id || `est-${Date.now()}`,
      codigo: estacionFormData.codigo,
      nombre: estacionFormData.nombre,
      ubicacion: estacionFormData.ubicacion || "",
      ip: estacionFormData.ip || "",
      proveedores: estacionFormData.proveedoresText?.split(',').map(p => p.trim()).filter(p => p) || [],
      equipos: estacionFormData.equiposData?.map(eq => ({
        id: `${estacionFormData.codigo}-${eq.modelo.replace(/\s+/g, '-').toLowerCase()}`,
        modelo: eq.modelo,
        imagen: eq.imagen,
        descripcion: eq.descripcion,
        metodoReinicio: eq.metodoReinicio
      })) || [],
      attachments: [...(estacionFormData.attachments || []), ...attachments],
      photo: photoDataUrl,
      provider_backoffice: estacionFormData.provider_backoffice,
      ip_backoffice: estacionFormData.ip_backoffice,
      ip_publica_backoffice: estacionFormData.ip_publica_backoffice,
      provider_counter: estacionFormData.provider_counter,
      ip_counter: estacionFormData.ip_counter,
      ip_publica_counter: estacionFormData.ip_publica_counter,
      contacto: {
        email: estacionFormData.contacto?.email || "",
        telefono: estacionFormData.contacto?.telefono || ""
      }
    };

    const success = saveEstacion(newEstacion);
    if (success) {
      toast({
        title: "Estación Guardada",
        description: "La estación ha sido guardada exitosamente.",
      });
      setEstacionDialogOpen(false);
      setEditingEstacion(null);
      setEstacionFormData({});
    }
  };

  const handleSaveGuide = async () => {
    if (!guideFormData.id || !guideFormData.title || !guideFormData.content) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    // Handle file uploads
    const attachments: GuideAttachment[] = [];
    const images: GuideImage[] = [];

    // Process attachments
    if (guideFormData.attachmentFiles) {
      for (let i = 0; i < guideFormData.attachmentFiles.length; i++) {
        const file = guideFormData.attachmentFiles[i];
        const dataUrl = await fileToDataUrl(file);
        attachments.push({
          name: file.name,
          url: dataUrl,
          size: file.size
        });
      }
    }

    // Process images
    if (guideFormData.imageFiles) {
      for (let i = 0; i < guideFormData.imageFiles.length; i++) {
        const file = guideFormData.imageFiles[i];
        const dataUrl = await fileToDataUrl(file);
        images.push({
          name: file.name,
          url: dataUrl
        });
      }
    }

    const newGuide: Guide = {
      id: guideFormData.id,
      title: guideFormData.title,
      content: guideFormData.content,
      attachments: [...(guideFormData.attachments || []), ...attachments],
      images: [...(guideFormData.images || []), ...images],
      dateCreated: editingGuide?.dateCreated || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const success = saveGuide(newGuide);
    if (success) {
      toast({
        title: "Guía Guardada",
        description: "La guía ha sido guardada exitosamente.",
      });
      setGuideDialogOpen(false);
      setEditingGuide(null);
      setGuideFormData({});
    }
  };

  // Helper function to convert file to data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

  const EstacionForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="est-codigo">Código de Estación*</Label>
          <Input 
            id="est-codigo" 
            placeholder="YUL" 
            value={estacionFormData.codigo || ''}
            onChange={(e) => setEstacionFormData(prev => ({ ...prev, codigo: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="est-nombre">Nombre Completo*</Label>
          <Input 
            id="est-nombre" 
            placeholder="Aeropuerto Internacional" 
            value={estacionFormData.nombre || ''}
            onChange={(e) => setEstacionFormData(prev => ({ ...prev, nombre: e.target.value }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="est-ubicacion">Ubicación</Label>
        <Input 
          id="est-ubicacion" 
          placeholder="Ciudad, País" 
          value={estacionFormData.ubicacion || ''}
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, ubicacion: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="est-proveedores">Proveedores Generales (separados por comas)</Label>
        <Input 
          id="est-proveedores" 
          placeholder="Cirion, Tigo, Claro" 
          value={estacionFormData.proveedoresText || ''}
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, proveedoresText: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Lista general de proveedores disponibles en la estación
        </p>
      </div>
      
      <div>
        <Label htmlFor="est-ip">Dirección IP</Label>
        <Input 
          id="est-ip" 
          placeholder="192.168.1.100" 
          value={estacionFormData.ip || ''}
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, ip: e.target.value }))}
        />
      </div>

      {/* Separador visual para proveedores específicos */}
      <div className="border-t border-border pt-4">
        <h3 className="text-lg font-medium text-foreground mb-3">Proveedores por Área de Servicio</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Define los proveedores específicos para cada área (Back Office y Mostradores) para permitir filtros precisos.
        </p>
      </div>

      <div>
        <Label htmlFor="est-provider-backoffice">Proveedor Back Office</Label>
        <Select 
          value={estacionFormData.provider_backoffice || ''} 
          onValueChange={(value) => setEstacionFormData(prev => ({ ...prev, provider_backoffice: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar proveedor para Back Office" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SITA">SITA</SelectItem>
            <SelectItem value="TIGO">TIGO</SelectItem>
            <SelectItem value="CLARO">CLARO</SelectItem>
            <SelectItem value="CIRION">CIRION</SelectItem>
            <SelectItem value="Bell Canada">Bell Canada</SelectItem>
            <SelectItem value="ETB">ETB</SelectItem>
            <SelectItem value="Telefónica">Telefónica</SelectItem>
            <SelectItem value="Claro Perú">Claro Perú</SelectItem>
            <SelectItem value="Entel">Entel</SelectItem>
            <SelectItem value="Otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="est-ip-backoffice">IP Equipo Back Office</Label>
        <Input 
          id="est-ip-backoffice" 
          placeholder="192.168.x.x" 
          value={estacionFormData.ip_backoffice || ''}
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, ip_backoffice: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="est-ip-publica-backoffice">IP Pública Proveedor Back Office</Label>
        <Input 
          id="est-ip-publica-backoffice" 
          placeholder="12.34.56.78" 
          value={estacionFormData.ip_publica_backoffice || ''}
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, ip_publica_backoffice: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="est-provider-counter">Proveedor Mostradores</Label>
        <Select 
          value={estacionFormData.provider_counter || ''} 
          onValueChange={(value) => setEstacionFormData(prev => ({ ...prev, provider_counter: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar proveedor para Mostradores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SITA">SITA</SelectItem>
            <SelectItem value="TIGO">TIGO</SelectItem>
            <SelectItem value="CLARO">CLARO</SelectItem>
            <SelectItem value="CIRION">CIRION</SelectItem>
            <SelectItem value="Bell Canada">Bell Canada</SelectItem>
            <SelectItem value="ETB">ETB</SelectItem>
            <SelectItem value="Telefónica">Telefónica</SelectItem>
            <SelectItem value="Claro Perú">Claro Perú</SelectItem>
            <SelectItem value="Entel">Entel</SelectItem>
            <SelectItem value="Otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="est-ip-counter">IP Equipo Mostradores</Label>
        <Input 
          id="est-ip-counter" 
          placeholder="192.168.y.y" 
          value={estacionFormData.ip_counter || ''}
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, ip_counter: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="est-ip-publica-counter">IP Pública Proveedor Mostradores</Label>
        <Input 
          id="est-ip-publica-counter" 
          placeholder="23.45.67.89" 
          value={estacionFormData.ip_publica_counter || ''}
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, ip_publica_counter: e.target.value }))}
        />
      </div>
      
      <div>
        <Label>Información de Contacto</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input 
            placeholder="Email" 
            value={estacionFormData.contacto?.email || ''}
            onChange={(e) => setEstacionFormData(prev => ({ 
              ...prev, 
              contacto: { ...prev.contacto, email: e.target.value, telefono: prev.contacto?.telefono || '' }
            }))}
          />
          <Input 
            placeholder="Teléfono" 
            value={estacionFormData.contacto?.telefono || ''}
            onChange={(e) => setEstacionFormData(prev => ({ 
              ...prev, 
              contacto: { ...prev.contacto, telefono: e.target.value, email: prev.contacto?.email || '' }
            }))}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="est-attachments">Adjuntos</Label>
        <Input 
          id="est-attachments" 
          type="file" 
          multiple 
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, attachmentFiles: e.target.files }))}
        />
      </div>
      
      <div>
        <Label htmlFor="est-photo">Foto de Equipos</Label>
        <Input 
          id="est-photo" 
          type="file" 
          accept="image/*" 
          onChange={(e) => setEstacionFormData(prev => ({ ...prev, photoFile: e.target.files?.[0] || null }))}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setEstacionDialogOpen(false);
          setEditingEstacion(null);
          setEstacionFormData({});
        }}>Cancelar</Button>
        <Button onClick={handleSaveEstacion}>Guardar Estación</Button>
      </div>
    </div>
  );

  const GuideForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="guide-id">ID de la Guía*</Label>
        <Input 
          id="guide-id" 
          placeholder="GUIDE001" 
          value={guideFormData.id || ''}
          onChange={(e) => setGuideFormData(prev => ({ ...prev, id: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="guide-title">Título*</Label>
        <Input 
          id="guide-title" 
          placeholder="Título de la guía" 
          value={guideFormData.title || ''}
          onChange={(e) => setGuideFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="guide-content">Contenido / Pasos*</Label>
        <Textarea 
          id="guide-content" 
          placeholder="Describe la guía paso a paso" 
          rows={6}
          value={guideFormData.content || ''}
          onChange={(e) => setGuideFormData(prev => ({ ...prev, content: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="guide-attachments">Adjuntos</Label>
        <Input 
          id="guide-attachments" 
          type="file" 
          multiple 
          onChange={(e) => setGuideFormData(prev => ({ ...prev, attachmentFiles: e.target.files }))}
        />
      </div>
      
      <div>
        <Label htmlFor="guide-images">Imágenes de Referencia</Label>
        <Input 
          id="guide-images" 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={(e) => setGuideFormData(prev => ({ ...prev, imageFiles: e.target.files }))}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setGuideDialogOpen(false);
          setEditingGuide(null);
          setGuideFormData({});
        }}>Cancelar</Button>
        <Button onClick={handleSaveGuide}>Guardar Guía</Button>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="kbs">Knowledge Bases</TabsTrigger>
            <TabsTrigger value="cases">Casos Históricos</TabsTrigger>
            <TabsTrigger value="estaciones">Estaciones</TabsTrigger>
            <TabsTrigger value="guides">Guías</TabsTrigger>
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

          <TabsContent value="estaciones" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Gestión de Estaciones</h3>
              <Dialog open={estacionDialogOpen} onOpenChange={setEstacionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="glow-effect">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Estación
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEstacion ? "Editar Estación" : "Nueva Estación"}
                    </DialogTitle>
                  </DialogHeader>
                  <EstacionForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {estaciones.map((estacion) => (
                <Card key={estacion.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{estacion.codigo}: {estacion.nombre}</h4>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{estacion.ubicacion}</p>
                        <div className="text-xs text-muted-foreground">
                          Proveedores: {estacion.proveedores.join(', ')} | Equipos: {estacion.equipos.length}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingEstacion(estacion);
                          setEstacionFormData({
                            codigo: estacion.codigo,
                            nombre: estacion.nombre,
                            ubicacion: estacion.ubicacion,
                            proveedoresText: estacion.proveedores.join(', '),
                            contacto: estacion.contacto,
                            equiposData: estacion.equipos.map(eq => ({
                              modelo: eq.modelo,
                              descripcion: eq.descripcion || '',
                              metodoReinicio: eq.metodoReinicio || '',
                              imagen: eq.imagen
                            }))
                          });
                          setEstacionDialogOpen(true);
                        }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => {
                          if (confirm('¿Estás seguro de eliminar esta estación?')) {
                            deleteEstacion(estacion.id);
                            toast({
                              title: "Estación Eliminada",
                              description: "La estación ha sido eliminada.",
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

          <TabsContent value="guides" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">Gestión de Guías</h3>
              <Dialog open={guideDialogOpen} onOpenChange={setGuideDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="glow-effect">
                    <Plus className="w-4 h-4 mr-2" />
                    📚 Agregar Guía
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingGuide ? "Editar Guía" : "Nueva Guía"}
                    </DialogTitle>
                  </DialogHeader>
                  <GuideForm />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {guides.map((guide) => (
                <Card key={guide.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{guide.id}: {guide.title}</h4>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2 whitespace-pre-line">
                          {guide.content.length > 150 ? `${guide.content.substring(0, 150)}...` : guide.content}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          Actualizado: {guide.lastUpdated} | Adjuntos: {guide.attachments.length} | Imágenes: {guide.images.length}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditingGuide(guide);
                          setGuideFormData({
                            id: guide.id,
                            title: guide.title,
                            content: guide.content,
                            attachments: guide.attachments,
                            images: guide.images
                          });
                          setGuideDialogOpen(true);
                        }}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => {
                          if (confirm('¿Estás seguro de eliminar esta guía?')) {
                            deleteGuide(guide.id);
                            toast({
                              title: "Guía Eliminada",
                              description: "La guía ha sido eliminada.",
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