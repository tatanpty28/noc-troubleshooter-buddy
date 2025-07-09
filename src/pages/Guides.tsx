import { GuidesList } from "@/components/GuidesList";
import { Button } from "@/components/ui/button";

export default function Guides() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button 
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="mb-4 flex items-center gap-2"
        >
          ← Volver al Inicio
        </Button>
      </div>
      <GuidesList />
    </div>
  );
}