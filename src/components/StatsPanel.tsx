import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Search, CheckCircle, Calendar, Users } from "lucide-react";

const championData = {
  name: "Luisa",
  photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  score: 47,
  title: "Campeona del Mes"
};

const activeUsers = [
  { name: "Laura", score: 23, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" },
  { name: "Antonio", score: 18, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" },
  { name: "Ana", score: 15, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face" },
  { name: "Pedro", score: 12, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" }
];

const stats = {
  totalSearches: 1247,
  resolvedCases: 189,
  consecutiveDays: 23,
  activeUsers: 13
};

const monthlyActivity = [
  { month: "Ene", value: 85 },
  { month: "Feb", value: 92 },
  { month: "Mar", value: 78 },
  { month: "Abr", value: 95 },
  { month: "May", value: 88 }
];

export const StatsPanel = () => {
  return (
    <div className="w-80 bg-card border-l border-border p-4 space-y-6 overflow-y-auto">
      {/* Champion Card */}
      <Card className="noc-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Campeón Galletero
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="relative inline-block mb-3">
            <Avatar className="h-16 w-16 border-2 border-warning">
              <AvatarImage src={championData.photo} alt={championData.name} />
              <AvatarFallback>{championData.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 bg-warning text-warning-foreground text-xs px-1.5 py-0.5 rounded-full font-bold">
              #1
            </div>
          </div>
          <h3 className="font-semibold text-foreground">{championData.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{championData.title}</p>
          <Badge variant="secondary" className="bg-warning/20 text-warning">
            {championData.score} galletas
          </Badge>
        </CardContent>
      </Card>

      {/* Active Users Ranking */}
      <Card className="noc-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Usuarios Más Activos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeUsers.map((user, index) => (
            <div key={user.name} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                {index + 2}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.score} puntos</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Monthly Activity */}
      <Card className="noc-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Actividad Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyActivity.map((month) => (
              <div key={month.month} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{month.month}</span>
                  <span className="text-foreground">{month.value}%</span>
                </div>
                <Progress value={month.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card className="noc-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-foreground">Estadísticas de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Search className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{stats.totalSearches.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Búsquedas totales</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{stats.resolvedCases}</div>
              <div className="text-xs text-muted-foreground">Casos resueltos</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <Calendar className="h-4 w-4 text-warning" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{stats.consecutiveDays}</div>
              <div className="text-xs text-muted-foreground">Días consecutivos</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Users className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">{stats.activeUsers}</div>
              <div className="text-xs text-muted-foreground">Usuarios activos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};