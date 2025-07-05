import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Cookie } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
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
      
      <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
        <Cookie className="w-4 h-4 mr-2 text-secondary" />
        <span>¿Con qué galletas vienes hoy? 🍪</span>
      </div>
    </div>
  );
};