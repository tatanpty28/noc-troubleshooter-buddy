import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { TroubleshootingProblem, ChecklistItem } from "@/data/troubleshootingData";

interface TroubleshootingCardProps {
  problem: TroubleshootingProblem;
  onComplete: () => void;
}

export const TroubleshootingCard = ({ problem, onComplete }: TroubleshootingCardProps) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(problem.checklist);
  const [showEscalation, setShowEscalation] = useState(false);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedItems = checklist.filter(item => item.completed).length;
  const totalItems = checklist.length;
  const allCompleted = completedItems === totalItems;

  const handleNext = () => {
    if (allCompleted) {
      setShowEscalation(true);
    }
  };

  return (
    <Card className="noc-card w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl text-foreground flex items-center gap-2">
              {problem.title}
              <Badge variant="secondary" className="ml-2">{problem.category}</Badge>
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {problem.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Progreso</div>
            <div className="text-2xl font-bold text-primary">
              {completedItems}/{totalItems}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-6">
          {/* KB Information Section */}
          <div className="space-y-4 border border-border rounded-lg p-4 bg-accent/30">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              📄 KB {problem.kb.id}: {problem.kb.title}
            </h3>
            <div className="text-sm text-muted-foreground mb-3">
              <p><strong>Descripción:</strong> {problem.kb.description}</p>
              <p><strong>Última actualización:</strong> {problem.kb.lastUpdated}</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Pasos a verificar:</h4>
              {checklist.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                  <Checkbox
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={() => toggleChecklistItem(item.id)}
                    className="mt-1"
                  />
                  <label 
                    htmlFor={item.id} 
                    className={`flex-1 text-sm cursor-pointer ${
                      item.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {item.description}
                  </label>
                  {item.completed && (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Last Similar Case Section */}
          {problem.lastSimilarCase && (
            <div className="space-y-4 border border-secondary/20 rounded-lg p-4 bg-secondary/10">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-secondary" />
                📝 Último incidente similar ({problem.lastSimilarCase.id})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-foreground">Fecha de resolución:</strong>
                  <p className="text-muted-foreground">{problem.lastSimilarCase.dateResolved}</p>
                </div>
                {problem.lastSimilarCase.technicianName && (
                  <div>
                    <strong className="text-foreground">Técnico:</strong>
                    <p className="text-muted-foreground">{problem.lastSimilarCase.technicianName}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <strong className="text-foreground">Descripción del incidente:</strong>
                  <p className="text-muted-foreground mt-1">{problem.lastSimilarCase.incidentDescription}</p>
                </div>
              </div>

              <div className="space-y-2">
                <strong className="text-foreground">Acciones realizadas:</strong>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  {problem.lastSimilarCase.actionsPerformed.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-secondary/20">
                <div className="flex items-center gap-2">
                  <strong className="text-foreground">Resultado:</strong>
                  <Badge 
                    variant={
                      problem.lastSimilarCase.finalResult === 'resuelto' ? 'default' : 
                      problem.lastSimilarCase.finalResult === 'escalado' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {problem.lastSimilarCase.finalResult.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {problem.lastSimilarCase.additionalNotes && (
                <div className="pt-2 border-t border-secondary/20">
                  <strong className="text-foreground">Notas adicionales:</strong>
                  <p className="text-muted-foreground mt-1 text-sm">{problem.lastSimilarCase.additionalNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {allCompleted && (
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <div className="text-success font-medium">
                ¡Excelente! Completaste todos los pasos 🎉
              </div>
              <Button onClick={handleNext} variant="default" className="glow-effect">
                ¿Se solucionó?
              </Button>
            </div>
          </div>
        )}

        {showEscalation && (
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Información de Escalamiento</h3>
            </div>
            
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong className="text-foreground">Proveedor:</strong>
                  <p className="text-muted-foreground">{problem.escalation.provider}</p>
                </div>
                <div>
                  <strong className="text-foreground">Email:</strong>
                  <p className="text-muted-foreground flex items-center gap-2">
                    {problem.escalation.email}
                    <ExternalLink className="w-4 h-4" />
                  </p>
                </div>
                {problem.escalation.id && (
                  <div>
                    <strong className="text-foreground">ID:</strong>
                    <p className="text-muted-foreground">{problem.escalation.id}</p>
                  </div>
                )}
                {problem.escalation.lastUpdate && (
                  <div>
                    <strong className="text-foreground">Última actualización:</strong>
                    <p className="text-muted-foreground">{problem.escalation.lastUpdate}</p>
                  </div>
                )}
              </div>
              
              {problem.escalation.additionalInfo && (
                <div className="pt-2 border-t border-warning/20">
                  <strong className="text-foreground">Información adicional:</strong>
                  <p className="text-muted-foreground mt-1">{problem.escalation.additionalInfo}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEscalation(false)}>
                Reintentar pasos
              </Button>
              <Button onClick={onComplete} variant="success">
                Marcar como resuelto
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};