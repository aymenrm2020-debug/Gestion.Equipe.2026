import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createLeaveRequest, getLeaveRequests, getPendingLeaveRequests, updateLeaveRequestStatus, LeaveRequest } from '@/integrations/supabase/leaveRequests';
import { useSession } from '@/components/SessionContextProvider';
import { showSuccess, showError } from '@/utils/toast';

export const useLeaveRequests = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const { data: userLeaveRequests, isLoading: isLoadingUserLeaveRequests } = useQuery({
    queryKey: ['userLeaveRequests', user?.id],
    queryFn: () => getLeaveRequests(user!.id),
    enabled: !!user?.id,
  });

  const { data: pendingLeaveRequests, isLoading: isLoadingPendingLeaveRequests } = useQuery({
    queryKey: ['pendingLeaveRequests'],
    queryFn: getPendingLeaveRequests,
    enabled: !!user?.id, // Only fetch if user is logged in, can add role check later
  });

  const createLeaveRequestMutation = useMutation({
    mutationFn: (request: Omit<LeaveRequest, 'id' | 'requested_at' | 'status' | 'approved_by_user_id' | 'approved_at'>) => createLeaveRequest({ ...request, user_id: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLeaveRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
      showSuccess('Demande de congé soumise avec succès !');
    },
    onError: (error) => {
      showError(`Erreur lors de la soumission de la demande: ${error.message}`);
    },
  });

  const updateLeaveRequestStatusMutation = useMutation({
    mutationFn: ({ requestId, status, approvedByUserId }: { requestId: string, status: 'approved' | 'rejected', approvedByUserId: string }) => updateLeaveRequestStatus(requestId, status, approvedByUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLeaveRequests', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['pendingLeaveRequests'] });
      showSuccess('Statut de la demande mis à jour !');
    },
    onError: (error) => {
      showError(`Erreur lors de la mise à jour du statut: ${error.message}`);
    },
  });

  return {
    userLeaveRequests,
    pendingLeaveRequests,
    isLoadingUserLeaveRequests,
    isLoadingPendingLeaveRequests,
    createLeaveRequest: createLeaveRequestMutation.mutate,
    isCreatingLeaveRequest: createLeaveRequestMutation.isPending,
    updateLeaveRequestStatus: updateLeaveRequestStatusMutation.mutate,
    isUpdatingLeaveRequestStatus: updateLeaveRequestStatusMutation.isPending,
  };
};