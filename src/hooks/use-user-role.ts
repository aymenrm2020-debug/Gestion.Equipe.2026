import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/SessionContextProvider';
import { getProfileById } from '@/integrations/supabase/teams';

export const useUserRole = () => {
  const { user, loading: sessionLoading } = useSession();

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => getProfileById(user!.id),
    enabled: !!user?.id && !sessionLoading,
  });

  const role = userProfile?.role || 'employee'; // Default to 'employee' if not found or loading

  return {
    role,
    isLoading: isLoadingProfile || sessionLoading,
    isAdmin: role === 'admin',
    isManager: role === 'manager',
    isEmployee: role === 'employee',
  };
};