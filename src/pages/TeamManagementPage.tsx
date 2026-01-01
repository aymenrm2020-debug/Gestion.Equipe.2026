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
import { Loader2 } from 'lucide-react';

const TeamManagementPage = () => {
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

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      createTeam(newTeamName);
      setNewTeamName('');
      setIsTeamDialogOpen(false);
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
          team_id: editedTeamId,
        },
      });
      setIsProfileDialogOpen(false);
      setEditingProfile(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion d'Équipe</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Gérez les profils des employés et les équipes.
      </p>

      {/* Employee Profiles */}
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Profils des Employés</CardTitle>
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.last_name || '-'}</TableCell>
                      <TableCell>{profile.first_name || '-'}</TableCell>
                      <TableCell>{profile.teams?.name || 'Non assignée'}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => handleEditProfile(profile)}>
                          Modifier
                        </Button>
                      </TableCell>
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
      <Card className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Gestion des Équipes</CardTitle>
          <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
            <DialogTrigger asChild>
              <Button>Créer une Équipe</Button>
            </DialogTrigger>
            <DialogContent>
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
                    className="col-span-3"
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreatingTeam}>
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

      {/* Edit Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent>
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
                className="col-span-3"
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
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">
                Équipe
              </Label>
              <Select value={editedTeamId || ''} onValueChange={setEditedTeamId}>
                <SelectTrigger id="team" className="col-span-3">
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
            <DialogFooter>
              <Button type="submit" disabled={isUpdatingProfile}>
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