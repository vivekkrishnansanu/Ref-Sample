import { supabase } from '../lib/supabase';

export interface ReferralSource {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const referralSourceService = {
  async getAll(): Promise<ReferralSource[]> {
    const { data, error } = await supabase
      .from('referral_sources')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch referral sources: ${error.message}`);
    }

    return data || [];
  },

  async create(name: string): Promise<ReferralSource> {
    const { data, error } = await supabase
      .from('referral_sources')
      .insert({ name })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create referral source: ${error.message}`);
    }

    return data;
  },

  async update(id: string, name: string): Promise<ReferralSource> {
    const { data, error } = await supabase
      .from('referral_sources')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update referral source: ${error.message}`);
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('referral_sources')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete referral source: ${error.message}`);
    }
  }
};
