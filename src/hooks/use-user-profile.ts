import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileById, updateProfile, Profile } from '@/integrations/supabase/teams';
import { useSession } from '@/components/SessionContextProvider';
import { showSuccess, showError } from '@/utils/toast';

export const useUserProfile = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: isLoadingUserProfile } = useQuery<Profile>({
    queryKey: ['userProfile', user?.id],
    queryFn: () => getProfileById(user!.id),
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Omit<Profile, 'id' | 'updated_at'>>) => updateProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      showSuccess('Profil mis à jour avec succès !');
    },
    onError: (error) => {
      showError(`Erreur lors de la mise à jour du profil: ${error.message}`);
    },
  });

  return {
    userProfile,
    isLoadingUserProfile,
    updateUserProfile: updateProfileMutation.mutate,
    isUpdatingUserProfile: updateProfileMutation.isPending,
  };
};