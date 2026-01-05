import { supabase } from './client';

export interface Overtime {
  id?: string;
  user_id: string;
  date: string;
  hours: number;
  approved_by_user_id?: string;
  approved_at?: string;
  notes?: string;
  created_at?: string;
  status?: 'pending' | 'approved' | 'rejected'; // Added status field
}

export const createOvertimeRequest = async (request: Omit<Overtime, 'id' | 'approved_by_user_id' | 'approved_at' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('overtime')
    .insert({ ...request, status: 'pending' }) // Default status to pending
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getOvertimeRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('overtime')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
};

export const getPendingOvertimeRequests = async () => {
  const { data, error } = await supabase
    .from('overtime')
    .select('*, profiles(first_name, last_name)')
    .eq('status', 'pending') // Filter by pending status
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
};

export const updateOvertimeStatus = async (overtimeId: string, status: 'approved' | 'rejected', approvedByUserId?: string) => {
  const updates: Partial<Overtime> = { status };
  if (status === 'approved') {
    updates.approved_by_user_id = approvedByUserId;
    updates.approved_at = new Date().toISOString();
  } else if (status === 'rejected') {
    updates.approved_by_user_id = approvedByUserId; // Optionally record who rejected
    updates.approved_at = new Date().toISOString(); // Optionally record when rejected
  }

  const { data, error } = await supabase
    .from('overtime')
    .update(updates)
    .eq('id', overtimeId)
    .select()
    .single();
  if (error) throw error;
  return data;
};