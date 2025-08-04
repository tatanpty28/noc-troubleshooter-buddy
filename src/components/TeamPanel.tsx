import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Calendar } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  birthday: string;
  isActive: boolean;
}

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Luisa",
    role: "Especialista de Monitoreo",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    birthday: "08 marzo",
    isActive: true
  },
  {
    id: "2",
    name: "Laura",
    role: "Especialista de Monitoreo",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    birthday: "15 abril",
    isActive: true
  },
  {
    id: "3",
    name: "Antonio",
    role: "Especialista de Monitoreo",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    birthday: "22 marzo",
    isActive: true
  },
  {
    id: "4",
    name: "Ana",
    role: "Especialista de Monitoreo",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    birthday: "21 mayo",
    isActive: true
  },
  {
    id: "5",
    name: "Pedro",
    role: "Ex-Especialista de Monitoreo",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    birthday: "10 enero",
    isActive: false
  },
  {
    id: "6",
    name: "Andrés",
    role: "Ex-Especialista de Monitoreo",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    birthday: "03 diciembre",
    isActive: false
  }
];

export const TeamPanel = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const activeMembers = teamMembers.filter(member => member.isActive);
  const exMembers = teamMembers.filter(member => !member.isActive);

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
  };

  const handleSave = (updatedMember: TeamMember) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleAddMember = (newMember: Omit<TeamMember, 'id'>) => {
    const member: TeamMember = {
      ...newMember,
      id: Date.now().toString()
    };
    setTeamMembers(prev => [...prev, member]);
    setIsAddingMember(false);
  };

  return (
    <div className="w-80 bg-card border-r border-border p-4 space-y-6">
      {/* Active Team Members */}
      <Card className="noc-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Equipo del NOC</CardTitle>
            <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Miembro</DialogTitle>
                </DialogHeader>
                <MemberForm 
                  onSave={handleAddMember}
                  onCancel={() => setIsAddingMember(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </CardContent>
      </Card>

      {/* Ex-Members */}
      <Card className="noc-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-muted-foreground">Ex-miembros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {exMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.photo} alt={member.name} />
                <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{member.name}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Miembro</DialogTitle>
            </DialogHeader>
            <MemberForm 
              member={editingMember}
              onSave={handleSave}
              onCancel={() => setEditingMember(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const MemberCard = ({ 
  member, 
  onEdit, 
  onDelete 
}: { 
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.photo} alt={member.name} />
        <AvatarFallback>{member.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{member.name}</h4>
        <p className="text-sm text-muted-foreground truncate">{member.role}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Calendar className="h-3 w-3" />
          <span>{member.birthday}</span>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => onEdit(member)}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(member.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

const MemberForm = ({ 
  member, 
  onSave, 
  onCancel 
}: { 
  member?: TeamMember;
  onSave: (member: TeamMember) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(member?.name || "");
  const [role, setRole] = useState(member?.role || "Especialista de Monitoreo");
  const [photo, setPhoto] = useState(member?.photo || "");
  const [birthday, setBirthday] = useState(member?.birthday || "");
  const [isActive, setIsActive] = useState(member?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: member?.id || "",
      name: name.trim(),
      role: role.trim(),
      photo: photo.trim(),
      birthday: birthday.trim(),
      isActive
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="role">Rol</Label>
        <Input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Especialista de Monitoreo"
        />
      </div>
      
      <div>
        <Label htmlFor="photo">URL de Foto</Label>
        <Input
          id="photo"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="https://..."
          type="url"
        />
      </div>
      
      <div>
        <Label htmlFor="birthday">Cumpleaños</Label>
        <Input
          id="birthday"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          placeholder="15 abril"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-border"
        />
        <Label htmlFor="isActive">Miembro activo</Label>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};