import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayAttendance, checkIn, checkOut, getAttendanceHistory } from '@/integrations/supabase/attendance';
import { useSession } from '@/components/SessionContextProvider';
import { format } from 'date-fns';
import { showSuccess, showError } from '@/utils/toast';

export const useAttendance = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentTime = format(new Date(), 'HH:mm:ssXXX'); // ISO 8601 format with timezone

  const { data: todayAttendance, isLoading: isLoadingTodayAttendance } = useQuery({
    queryKey: ['todayAttendance', user?.id, today],
    queryFn: () => getTodayAttendance(user!.id, today),
    enabled: !!user?.id,
  });

  const { data: attendanceHistory, isLoading: isLoadingAttendanceHistory } = useQuery({
    queryKey: ['attendanceHistory', user?.id],
    queryFn: () => getAttendanceHistory(user!.id),
    enabled: !!user?.id,
  });

  const checkInMutation = useMutation({
    mutationFn: () => checkIn(user!.id, today, currentTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance', user?.id, today] });
      queryClient.invalidateQueries({ queryKey: ['attendanceHistory', user?.id] });
      showSuccess('Pointage d\'entrée enregistré !');
    },
    onError: (error) => {
      showError(`Erreur lors du pointage d'entrée: ${error.message}`);
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: () => checkOut(todayAttendance!.id, currentTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance', user?.id, today] });
      queryClient.invalidateQueries({ queryKey: ['attendanceHistory', user?.id] });
      showSuccess('Pointage de sortie enregistré !');
    },
    onError: (error) => {
      showError(`Erreur lors du pointage de sortie: ${error.message}`);
    },
  });

  const handleCheckIn = () => {
    if (user?.id) {
      checkInMutation.mutate();
    } else {
      showError('Utilisateur non authentifié.');
    }
  };

  const handleCheckOut = () => {
    if (user?.id && todayAttendance?.id) {
      checkOutMutation.mutate();
    } else {
      showError('Impossible de pointer la sortie sans un pointage d\'entrée.');
    }
  };

  return {
    todayAttendance,
    attendanceHistory,
    isLoadingTodayAttendance,
    isLoadingAttendanceHistory,
    isCheckingIn: checkInMutation.isPending,
    isCheckingOut: checkOutMutation.isPending,
    handleCheckIn,
    handleCheckOut,
  };
};