import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeams, createTeam, getProfilesWithTeams, updateProfile, Profile } from '@/integrations/supabase/teams';
import { showSuccess, showError } from '@/utils/toast';

export const useTeamManagement = () => {
  const queryClient = useQueryClient();

  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  });

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: getProfilesWithTeams,
  });

  const createTeamMutation = useMutation({
    mutationFn: (name: string) => createTeam(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      showSuccess('Équipe créée avec succès !');
    },
    onError: (error) => {
      showError(`Erreur lors de la création de l'équipe: ${error.message}`);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<Profile, 'id' | 'updated_at'>> }) => updateProfile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      showSuccess('Profil mis à jour avec succès !');
    },
    onError: (error) => {
      showError(`Erreur lors de la mise à jour du profil: ${error.message}`);
    },
  });

  return {
    teams,
    profiles,
    isLoadingTeams,
    isLoadingProfiles,
    createTeam: createTeamMutation.mutate,
    isCreatingTeam: createTeamMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
};