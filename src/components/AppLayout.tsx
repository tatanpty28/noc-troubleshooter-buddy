import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  SidebarProvider, 
  SidebarTrigger, 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Search, History, Factory, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNOCData } from "@/hooks/useNOCData";

interface AppLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { title: "Buscar", url: "/", icon: Search },
  { title: "Estaciones", url: "/estaciones", icon: Factory },
  { title: "Casos Históricos", url: "/casos", icon: History },
];

function AppSidebar() {
  const location = useLocation();
  const { canEdit } = useNOCData();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  return (
    <Sidebar collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>NOC Centro</SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive(item.url) 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {canEdit && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link 
                      to="/admin" 
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        isActive('/admin') 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="ml-2" />
            <div className="ml-4">
              <h1 className="text-lg font-semibold text-foreground">Centro de Operaciones NOC</h1>
            </div>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}