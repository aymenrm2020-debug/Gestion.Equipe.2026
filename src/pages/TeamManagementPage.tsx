import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeamManagement } from '@/hooks/use-team-management';
import { Profile } from '@/integrations/supabase/teams';
import { Loader2, UserPlus } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { signUpWithEmail } from '@/integrations/supabase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useUserRole } from '@/hooks/use-user-role'; // Import useUserRole

const TeamManagementPage = () => {
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isLoadingRole } = useUserRole(); // Get user role
  const {
    teams,
    profiles,
    isLoadingTeams,
    isLoadingProfiles,
    createTeam,
    isCreatingTeam,
    updateProfile,
    isUpdatingProfile,
  } = useTeamManagement();

  const [newTeamName, setNewTeamName] = useState('');
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);

  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedTeamId, setEditedTeamId] = useState<string | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const [isRegisterEmployeeDialogOpen, setIsRegisterEmployeeDialogOpen] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeePassword, setNewEmployeePassword] = useState('');
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState('');
  const [newEmployeeLastName, setNewEmployeeLastName] = useState('');
  const [isRegisteringEmployee, setIsRegisteringEmployee] = useState(false);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      createTeam(newTeamName);
      setNewTeamName('');
      setIsTeamDialogOpen(false);
    } else {
      showError('Le nom de l\'équipe ne peut pas être vide.');
    }
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setEditedFirstName(profile.first_name || '');
    setEditedLastName(profile.last_name || '');
    setEditedTeamId(profile.team_id || null);
    setIsProfileDialogOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProfile) {
      updateProfile({
        id: editingProfile.id,
        updates: {
          first_name: editedFirstName,
          last_name: editedLastName,
          team_id: editedTeamId === 'null' ? null : editedTeamId, // Handle 'null' string from select
        },
      });
      setIsProfileDialogOpen(false);
      setEditingProfile(null);
    }
  };

  const handleRegisterEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeEmail || !newEmployeePassword || !newEmployeeFirstName || !newEmployeeLastName) {
      showError('Veuillez remplir tous les champs pour le nouvel employé.');
      return;
    }

    setIsRegisteringEmployee(true);
    try {
      await signUpWithEmail(newEmployeeEmail, newEmployeePassword, newEmployeeFirstName, newEmployeeLastName);
      showSuccess('Nouvel employé enregistré avec succès !');
      queryClient.invalidateQueries({ queryKey: ['profiles'] }); // Invalidate to refetch profiles
      setNewEmployeeEmail('');
      setNewEmployeePassword('');
      setNewEmployeeFirstName('');
      setNewEmployeeLastName('');
      setIsRegisterEmployeeDialogOpen(false);
    } catch (error: any) {
      showError(`Erreur lors de l'enregistrement de l'employé: ${error.message}`);
    } finally {
      setIsRegisteringEmployee(false);
    }
  };

  if (isLoadingRole) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement des permissions...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-foreground">Gestion d'Équipe</h1>
      <p className="text-lg text-muted-foreground">
        Gérez les profils des employés et les équipes.
      </p>

      {/* Employee Profiles */}
      <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Profils des Employés</CardTitle>
          {isAdmin && ( // Only show for admins
            <Dialog open={isRegisterEmployeeDialogOpen} onOpenChange={setIsRegisterEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="button-hover-effect">
                  <UserPlus className="mr-2 h-4 w-4" /> Enregistrer un Employé
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card text-card-foreground border border-border rounded-md shadow-lg">
                <DialogHeader>
                  <DialogTitle>Enregistrer un Nouvel Employé</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegisterEmployee} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newEmployeeEmail" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="newEmployeeEmail"
                      type="email"
                      value={newEmployeeEmail}
                      onChange={(e) => setNewEmployeeEmail(e.target.value)}
                      className="col-span-3 border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newEmployeePassword" className="text-right">
                      Mot de passe
                    </Label>
                    <Input
                      id="newEmployeePassword"
                      type="password"
                      value={newEmployeePassword}
                      onChange={(e) => setNewEmployeePassword(e.target.value)}
                      className="col-span-3 border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newEmployeeFirstName" className="text-right">
                      Prénom
                    </Label>
                    <Input
                      id="newEmployeeFirstName"
                      value={newEmployeeFirstName}
                      onChange={(e) => setNewEmployeeFirstName(e.target.value)}
                      className="col-span-3 border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newEmployeeLastName" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="newEmployeeLastName"
                      value={newEmployeeLastName}
                      onChange={(e) => setNewEmployeeLastName(e.target.value)}
                      className="col-span-3 border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isRegisteringEmployee} className="button-hover-effect">
                      {isRegisteringEmployee ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Enregistrer
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingProfiles ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement des profils...
            </div>
          ) : profiles && profiles.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Équipe</TableHead>
                    <TableHead>Rôle</TableHead> {/* Display role */}
                    {isAdmin && <TableHead>Actions</TableHead>} {/* Only show for admins */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.last_name || '-'}</TableCell>
                      <TableCell>{profile.first_name || '-'}</TableCell>
                      <TableCell>{profile.teams?.name || 'Non assignée'}</TableCell>
                      <TableCell>{profile.role}</TableCell> {/* Display role */}
                      {isAdmin && ( // Only show for admins
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleEditProfile(profile)} className="button-hover-effect">
                            Modifier
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun profil d'employé trouvé.</p>
          )}
        </CardContent>
      </Card>

      {/* Team Management */}
      {isAdmin && ( // Only show for admins
        <Card className="bg-card text-card-foreground p-4 rounded-lg shadow-lg border border-border card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Gestion des Équipes</CardTitle>
            <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
              <DialogTrigger asChild>
                <Button className="button-hover-effect">Créer une Équipe</Button>
              </DialogTrigger>
              <DialogContent className="bg-card text-card-foreground border border-border rounded-md shadow-lg">
                <DialogHeader>
                  <DialogTitle>Créer une Nouvelle Équipe</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTeam} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newTeamName" className="text-right">
                      Nom de l'équipe
                    </Label>
                    <Input
                      id="newTeamName"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="col-span-3 border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isCreatingTeam} className="button-hover-effect">
                      {isCreatingTeam ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Créer
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {isLoadingTeams ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement des équipes...
              </div>
            ) : teams && teams.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom de l'équipe</TableHead>
                      <TableHead>Créée le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>{team.name}</TableCell>
                        <TableCell>{new Date(team.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune équipe trouvée. Créez-en une !</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="bg-card text-card-foreground border border-border rounded-md shadow-lg">
          <DialogHeader>
            <DialogTitle>Modifier le Profil de {editingProfile?.first_name} {editingProfile?.last_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Prénom
              </Label>
              <Input
                id="firstName"
                value={editedFirstName}
                onChange={(e) => setEditedFirstName(e.target.value)}
                className="col-span-3 border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Nom
              </Label>
              <Input
                id="lastName"
                value={editedLastName}
                onChange={(e) => setEditedLastName(e.target.value)}
                className="col-span-3 border-border focus-visible:ring-ring focus-visible:ring-offset-background"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">
                Équipe
              </Label>
              <Select value={editedTeamId || 'null'} onValueChange={setEditedTeamId}>
                <SelectTrigger id="team" className="col-span-3 button-hover-effect">
                  <SelectValue placeholder="Assigner à une équipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Non assignée</SelectItem>
                  {teams?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isAdmin && ( // Only allow admins to change role
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rôle
                </Label>
                <Select value={editingProfile?.role || 'employee'} onValueChange={(value: 'admin' | 'manager' | 'employee') => setEditingProfile(prev => prev ? { ...prev, role: value } : null)}>
                  <SelectTrigger id="role" className="col-span-3 button-hover-effect">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employé</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isUpdatingProfile} className="button-hover-effect">
                {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Enregistrer les modifications
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagementPage;