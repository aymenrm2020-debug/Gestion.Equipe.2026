import { supabase } from './client';

export const getTodayAttendance = async (userId: string, date: string) => {
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows found
  return data;
};

export const checkIn = async (userId: string, date: string, checkInTime: string) => {
  const { data, error } = await supabase
    .from('attendances')
    .insert({ user_id: userId, date, check_in: checkInTime, status: 'present' })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const checkOut = async (id: string, checkOutTime: string) => {
  const { data, error } = await supabase
    .from('attendances')
    .update({ check_out: checkOutTime })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getAttendanceHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('attendances')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('check_in', { ascending: false });
  if (error) throw error;
  return data;
};