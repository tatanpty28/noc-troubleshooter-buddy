import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { TroubleshootingCard } from "@/components/TroubleshootingCard";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TroubleshootingProblem } from "@/data/troubleshootingData";
import { Coffee, Monitor, Zap, Users, Settings } from "lucide-react";
import nocHero from "@/assets/noc-hero.jpg";
import { useNOCData } from "@/hooks/useNOCData";

const Index = () => {
  const { searchProblems, canEdit } = useNOCData();
  const [searchResults, setSearchResults] = useState<TroubleshootingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<TroubleshootingProblem | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleSearch = (query: string) => {
    const results = searchProblems(query);
    setSearchResults(results);
    setShowWelcome(false);
  };

  const handleSelectProblem = (problem: TroubleshootingProblem) => {
    setSelectedProblem(problem);
  };

  const handleProblemComplete = () => {
    setSelectedProblem(null);
    setSearchResults([]);
    setShowWelcome(true);
  };

  const resetToHome = () => {
    setSelectedProblem(null);
    setSearchResults([]);
    setShowWelcome(true);
    setShowAdmin(false);
  };

  // Admin Panel View - redirect to /admin route instead
  if (showAdmin) {
    window.location.href = '/admin';
    return null;
  }

  if (selectedProblem) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              onClick={resetToHome}
              variant="outline"
              className="mb-4"
            >
              ← Volver al inicio
            </Button>
          </div>
          <TroubleshootingCard
            problem={selectedProblem}
            onComplete={handleProblemComplete}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative mb-12">
        <div 
          className="h-80 bg-cover bg-center bg-no-repeat flex items-center justify-center relative rounded-xl overflow-hidden"
          style={{ backgroundImage: `url(${nocHero})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 text-center text-white px-6">
            <h1 className="text-4xl font-bold mb-4 text-primary glow-effect">
              Bienvenido al NOC
            </h1>
            <p className="text-lg mb-4 text-gray-200">
              Centro de Operaciones de Red - Tu asistente inteligente
            </p>
            <div className="flex items-center justify-center gap-2 text-secondary">
              <Coffee className="w-5 h-5" />
              <span>¿Con qué galletas vienes hoy? ¡Y eso que las galletas son siempre heredadas :) ! 🍪</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            🧁 ¿En qué te ayudo hoy?
          </h2>
          <p className="text-lg text-muted-foreground">
            ¿Vienes con galletas buscando solución o vienes con soluciones para las galletas?
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Admin Access Button */}
        <div className="text-center mb-12">
          {canEdit && (
            <Button
              onClick={() => window.location.href = '/admin'}
              variant="outline"
              className="bg-card/50 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
            >
              📎 Agregar nueva KB / Caso técnico
            </Button>
          )}
        </div>

        {showWelcome && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="noc-card text-center">
                <CardContent className="p-6">
                  <Monitor className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">24/7</div>
                  <div className="text-sm text-muted-foreground">Monitoreo</div>
                </CardContent>
              </Card>
              <Card className="noc-card text-center">
                <CardContent className="p-6">
                  <Zap className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </CardContent>
              </Card>
              <Card className="noc-card text-center">
                <CardContent className="p-6">
                  <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">15</div>
                  <div className="text-sm text-muted-foreground">Técnicos</div>
                </CardContent>
              </Card>
              <Card className="noc-card text-center">
                <CardContent className="p-6">
                  <Coffee className="w-8 h-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">∞</div>
                  <div className="text-sm text-muted-foreground">Galletas</div>
                </CardContent>
              </Card>
            </div>

            {/* Welcome Message */}
            <Card className="noc-card mb-8">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  ¡Hola! ¿En qué te puedo ayudar hoy?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Soy tu asistente para troubleshooting. Solo dime qué problema tienes y te guiaré paso a paso para solucionarlo.
                  Si no se puede resolver, te daré toda la información para escalarlo correctamente.
                </p>
                <div className="text-sm text-muted-foreground">
                  <strong>Tip:</strong> Puedes buscar cosas como "no llega mensajería", "sin internet", "servidor caído", etc.
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Encontré {searchResults.length} problema{searchResults.length !== 1 ? 's' : ''} relacionado{searchResults.length !== 1 ? 's' : ''}:
            </h2>
            
            <div className="grid gap-4">
              {searchResults.map((problem) => (
                <Card 
                  key={problem.id} 
                  className="noc-card cursor-pointer hover:scale-[1.02] transition-all"
                  onClick={() => handleSelectProblem(problem)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {problem.title}
                          </h3>
                          <Badge variant="secondary">{problem.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {problem.description}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {problem.checklist.length} pasos de verificación
                        </div>
                      </div>
                      <Button className="glow-effect ml-4">
                        Resolver →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && !showWelcome && (
          <Card className="noc-card">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                No encontré problemas específicos para tu búsqueda
              </h3>
              <p className="text-muted-foreground mb-6">
                Pero no te preocupes, ¡estoy aquí para ayudarte! 
                Intenta con otros términos o describe el problema de manera diferente.
              </p>
              <Button onClick={resetToHome} variant="outline">
                Intentar otra búsqueda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;