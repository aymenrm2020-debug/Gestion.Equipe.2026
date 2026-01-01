import { supabase } from './client';

export interface Team {
  id: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  team_id: string | null;
  teams?: Team; // Joined team data
}

export const getTeams = async () => {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
};

export const createTeam = async (name: string) => {
  const { data, error } = await supabase
    .from('teams')
    .insert({ name })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getProfilesWithTeams = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, teams(id, name)')
    .order('first_name', { ascending: true });
  if (error) throw error;
  return data;
};

export const updateProfile = async (id: string, updates: Partial<Omit<Profile, 'id' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};