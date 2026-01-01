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
}

export const createOvertimeRequest = async (request: Omit<Overtime, 'id' | 'approved_by_user_id' | 'approved_at' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('overtime')
    .insert(request)
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
    .is('approved_by_user_id', null) // Assuming null means pending approval
    .order('date', { ascending: true });
  if (error) throw error;
  return data;
};

export const updateOvertimeStatus = async (overtimeId: string, approvedByUserId: string) => {
  const { data, error } = await supabase
    .from('overtime')
    .update({ approved_by_user_id: approvedByUserId, approved_at: new Date().toISOString() })
    .eq('id', overtimeId)
    .select()
    .single();
  if (error) throw error;
  return data;
};