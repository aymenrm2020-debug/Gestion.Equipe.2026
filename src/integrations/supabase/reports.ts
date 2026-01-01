import { supabase } from './client';
import { format } from 'date-fns';

export interface AttendanceReportRecord {
  id: string;
  user_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  profiles: Array<{ first_name: string | null; last_name: string | null }> | null;
}

export interface LeaveReportRecord {
  id: string;
  user_id: string;
  type: string;
  start_date: string;
  end_date: string | null;
  status: 'pending' | 'approved' | 'rejected';
  profiles: Array<{ first_name: string | null; last_name: string | null }> | null;
}

export const getMonthlyAttendanceRecords = async (year: number, month: number): Promise<AttendanceReportRecord[]> => {
  const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
  const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd'); // Last day of the month

  const { data, error } = await supabase
    .from('attendances')
    .select('id, user_id, date, status, profiles(first_name, last_name)')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return data as AttendanceReportRecord[];
};

export const getMonthlyLeaveRecords = async (year: number, month: number): Promise<LeaveReportRecord[]> => {
  const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
  const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd'); // Last day of the month

  const { data, error } = await supabase
    .from('leave_requests')
    .select('id, user_id, type, start_date, end_date, status, profiles(first_name, last_name)')
    .or(`and(start_date.gte.${startDate},start_date.lte.${endDate}),and(end_date.gte.${startDate},end_date.lte.${endDate}),and(start_date.lte.${startDate},end_date.gte.${endDate})`)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data as LeaveReportRecord[];
};