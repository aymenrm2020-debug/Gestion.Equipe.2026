import { supabase } from './client';

export interface LeaveRequest {
  id?: string;
  user_id: string;
  type: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  duration_type?: 'full_day' | 'half_day_morning' | 'half_day_afternoon' | 'hourly'; // New field
  reason?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'cancelled'; // Added 'cancelled' status
  requested_at?: string;
  approved_by_user_id?: string;
  approved_at?: string;
}

export const createLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'requested_at' | 'status' | 'approved_by_user_id' | 'approved_at'>) => {
  const { data, error } = await supabase
    .from('leave_requests')
    .insert(request)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getLeaveRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('user_id', userId)
    .order('requested_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getPendingLeaveRequests = async () => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select('*, profiles(first_name, last_name)') // Fetch user profile info
    .eq('status', 'pending')
    .order('requested_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const updateLeaveRequestStatus = async (requestId: string, status: 'approved' | 'rejected' | 'cancelled', approvedByUserId?: string) => {
  const updates: { status: 'approved' | 'rejected' | 'cancelled'; approved_by_user_id?: string; approved_at?: string } = { status };
  if (status === 'approved' || status === 'rejected') {
    updates.approved_by_user_id = approvedByUserId;
    updates.approved_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from('leave_requests')
    .update(updates)
    .eq('id', requestId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const cancelLeaveRequest = async (requestId: string) => {
  const { data, error } = await supabase
    .from('leave_requests')
    .update({ status: 'cancelled' })
    .eq('id', requestId)
    .select()
    .single();
  if (error) throw error;
  return data;
};