import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createOvertimeRequest, getOvertimeRequests, getPendingOvertimeRequests, updateOvertimeStatus, Overtime } from '@/integrations/supabase/overtime';
import { useSession } from '@/components/SessionContextProvider';
import { showSuccess, showError } from '@/utils/toast';

export const useOvertime = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { data: userOvertimeRequests, isLoading: isLoadingUserOvertimeRequests } = useQuery({
    queryKey: ['userOvertimeRequests', user?.id],
    queryFn: () => getOvertimeRequests(user!.id),
    enabled: !!user?.id,
  });

  const { data: pendingOvertimeRequests, isLoading: isLoadingPendingOvertimeRequests } = useQuery({
    queryKey: ['pendingOvertimeRequests'],
    queryFn: getPendingOvertimeRequests,
    enabled: !!user?.id, // Only fetch if user is logged in, can add role check later
  });

  const createOvertimeMutation = useMutation({
    mutationFn: (request: Omit<Overtime, 'id' | 'approved_by_user_id' | 'approved_at' | 'created_at'>) => createOvertimeRequest({ ...request, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOvertimeRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['pendingOvertimeRequests'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyOvertime'] }); // Invalidate dashboard data
      showSuccess('Demande d\'heures supplémentaires soumise avec succès !');
    },
    onError: (error) => {
      showError(`Erreur lors de la soumission de la demande: ${error.message}`);
    },
  });

  const approveOvertimeMutation = useMutation({
    mutationFn: ({ overtimeId, approvedByUserId }: { overtimeId: string, approvedByUserId: string }) => updateOvertimeStatus(overtimeId, approvedByUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOvertimeRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['pendingOvertimeRequests'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyOvertime'] }); // Invalidate dashboard data
      showSuccess('Heures supplémentaires approuvées !');
    },
    onError: (error) => {
      showError(`Erreur lors de l'approbation des heures supplémentaires: ${error.message}`);
    },
  });

  return {
    userOvertimeRequests,
    pendingOvertimeRequests,
    isLoadingUserOvertimeRequests,
    isLoadingPendingOvertimeRequests,
    createOvertime: createOvertimeMutation.mutate,
    isCreatingOvertime: createOvertimeMutation.isPending,
    approveOvertime: approveOvertimeMutation.mutate,
    isApprovingOvertime: approveOvertimeMutation.isPending,
  };
};