import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Cookie } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const cookieMessages = [
  "¿Con qué galletas vienes hoy? ¡Y eso que las galletas son siempre heredadas :) ! 🍪",
  "¡Alerta de galleta detectada! Proceda con cuidado… podría ser de chocolate.",
  "El sistema encontró una galleta... pero no es de chispas, es de errores heredados.",
  "Bienvenido al NOC: si no rompiste nada, revisa mejor… probablemente sí lo hiciste.",
  "Debug Mode activado: ¡Que las galletas y los logs te acompañen!",
  "KB no encontrada. ¿Has probado apagar y encender la galleta?",
  "La última persona que tocó esto dejó una nota: \"buena suerte…\"",
  "¿Por qué siempre es culpa del DNS? Porque es el primo rebelde de las galletas.",
  "¿Te acuerdas de lo que hiciste ayer? No, yo tampoco. ¡Vamos a revisar los logs!",
  "El sistema encontró una coincidencia en KB1234: \"Tomarse un café y volver a intentarlo\"."
];

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const randomMessage = cookieMessages[Math.floor(Math.random() * cookieMessages.length)];
    setCurrentMessage(randomMessage);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleCookieClick = () => {
    const randomMessage = cookieMessages[Math.floor(Math.random() * cookieMessages.length)];
    setCurrentMessage(randomMessage);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder="¿Qué problema tienes? (ej: no llega mensajería a aircom)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-4 py-6 text-lg rounded-xl bg-card border-border focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg"
        />
        <Button 
          type="submit" 
          variant="default"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-lg glow-effect"
        >
          Buscar
        </Button>
      </form>
      
      <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground cursor-pointer hover:text-secondary transition-colors" onClick={handleCookieClick}>
        <Cookie className="w-4 h-4 mr-2 text-secondary" />
        <span>{currentMessage}</span>
      </div>
    </div>
  );
};