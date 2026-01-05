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
    mutationFn: (request: Omit<Overtime, 'id' | 'approved_by_user_id' | 'approved_at' | 'created_at' | 'status'>) => createOvertimeRequest({ ...request, user_id: user!.id }),
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

  const updateOvertimeStatusMutation = useMutation({
    mutationFn: ({ overtimeId, status, approvedByUserId }: { overtimeId: string, status: 'approved' | 'rejected', approvedByUserId: string }) => updateOvertimeStatus(overtimeId, status, approvedByUserId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userOvertimeRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['pendingOvertimeRequests'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyOvertime'] }); // Invalidate dashboard data
      if (variables.status === 'approved') {
        showSuccess('Heures supplémentaires approuvées !');
      } else {
        showSuccess('Heures supplémentaires rejetées !');
      }
    },
    onError: (error) => {
      showError(`Erreur lors de la mise à jour des heures supplémentaires: ${error.message}`);
    },
  });

  return {
    userOvertimeRequests,
    pendingOvertimeRequests,
    isLoadingUserOvertimeRequests,
    isLoadingPendingOvertimeRequests,
    createOvertime: createOvertimeMutation.mutate,
    isCreatingOvertime: createOvertimeMutation.isPending,
    approveOvertime: (overtimeId: string) => updateOvertimeStatusMutation.mutate({ overtimeId, status: 'approved', approvedByUserId: user!.id }),
    rejectOvertime: (overtimeId: string) => updateOvertimeStatusMutation.mutate({ overtimeId, status: 'rejected', approvedByUserId: user!.id }),
    isUpdatingOvertimeStatus: updateOvertimeStatusMutation.isPending,
  };
};