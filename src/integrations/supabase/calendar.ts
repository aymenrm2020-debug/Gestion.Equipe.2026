import { supabase } from './client';
import { format } from 'date-fns';

// Original interfaces (kept for reference if used elsewhere, but we'll define specific ones for calendar)
export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'present' | 'absent' | 'late';
  notes: string | null;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  type: string;
  start_date: string;
  end_date: string | null;
  start_time?: string;
  end_time?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at?: string;
  approved_by_user_id?: string;
  approved_at?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
}

// New interfaces specifically for calendar data, matching the select statements
export interface CalendarAttendance {
  id: string;
  user_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  // Correction: profiles est un tableau d'objets (ou null)
  profiles: Array<{ first_name: string | null; last_name: string | null }> | null;
}

export interface CalendarLeaveRequest {
  id: string;
  user_id: string;
  type: string;
  start_date: string;
  end_date: string | null;
  status: 'pending' | 'approved' | 'rejected';
  // Correction: profiles est un tableau d'objets (ou null)
  profiles: Array<{ first_name: string | null; last_name: string | null }> | null;
}

export const getCalendarAttendances = async (startDate: Date, endDate: Date): Promise<CalendarAttendance[]> => {
  const { data, error } = await supabase
    .from('attendances')
    .select('id, user_id, date, status, profiles(first_name, last_name)')
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'));
  if (error) throw error;
  return data as CalendarAttendance[];
};

export const getCalendarLeaveRequests = async (startDate: Date, endDate: Date): Promise<CalendarLeaveRequest[]> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('id, user_id, type, start_date, end_date, status, profiles(first_name, last_name)')
    .or(`and(start_date.gte.${format(startDate, 'yyyy-MM-dd')},start_date.lte.${format(endDate, 'yyyy-MM-dd')}),and(end_date.gte.${format(startDate, 'yyyy-MM-dd')},end_date.lte.${format(endDate, 'yyyy-MM-dd')}),and(start_date.lte.${format(startDate, 'yyyy-MM-dd')},end_date.gte.${format(endDate, 'yyyy-MM-dd')})`)
    .eq('status', 'approved'); // Only show approved leave requests on calendar
  if (error) throw error;
  return data as CalendarLeaveRequest[];
};

export const getCalendarHolidays = async (startDate: Date, endDate: Date): Promise<Holiday[]> => {
  const { data, error } = await supabase
    .from('holidays')
    .select('*')
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'));
  if (error) throw error;
  return data as Holiday[];
};