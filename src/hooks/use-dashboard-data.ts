import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export const useDashboardData = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const startOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
  const endOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd');

  // Query for total employees
  const { data: totalEmployees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['totalEmployees'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count;
    },
  });

  // Query for today's attendance
  const { data: todayAttendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ['todayAttendance', today],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('attendances')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'present');
      if (error) throw error;
      return count;
    },
  });

  // Query for monthly overtime
  const { data: monthlyOvertime, isLoading: isLoadingOvertime } = useQuery({
    queryKey: ['monthlyOvertime', startOfMonth, endOfMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('overtime')
        .select('hours')
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);
      if (error) throw error;
      return data.reduce((sum, record) => sum + (record.hours || 0), 0);
    },
  });

  return {
    totalEmployees,
    isLoadingEmployees,
    todayAttendance,
    isLoadingAttendance,
    monthlyOvertime,
    isLoadingOvertime,
    isLoading: isLoadingEmployees || isLoadingAttendance || isLoadingOvertime,
  };
};