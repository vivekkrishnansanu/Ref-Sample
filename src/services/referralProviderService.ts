import { supabase } from '../lib/supabase';
import { ReferralProvider, ValidationIssue, ProviderWithIssues } from '../types/referralProvider';

export const referralProviderService = {
  async getAll(): Promise<ReferralProvider[]> {
    const { data, error } = await supabase
      .from('referral_providers')
      .select('*')
      .eq('is_merged', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(provider: Omit<ReferralProvider, 'id' | 'created_at' | 'updated_at' | 'is_merged' | 'merged_into_id'>): Promise<ReferralProvider> {
    const { data, error } = await supabase
      .from('referral_providers')
      .insert(provider)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, provider: Partial<ReferralProvider>): Promise<ReferralProvider> {
    const { data, error } = await supabase
      .from('referral_providers')
      .update({ ...provider, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('referral_providers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async merge(sourceId: string, targetId: string): Promise<void> {
    const { error } = await supabase
      .from('referral_providers')
      .update({
        is_merged: true,
        merged_into_id: targetId,
        updated_at: new Date().toISOString()
      })
      .eq('id', sourceId);

    if (error) throw error;
  },

  validateNPI(npi: string): boolean {
    return /^\d{10}$/.test(npi);
  },

  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePhone(phone: string): boolean {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  },

  validateFax(fax: string): boolean {
    return /^\d{10}$/.test(fax.replace(/\D/g, ''));
  },

  validateZip(zip: string): boolean {
    return /^\d{5}(-\d{4})?$/.test(zip);
  },

  analyzeProviders(providers: ReferralProvider[]): ProviderWithIssues[] {
    const emailMap = new Map<string, string[]>();
    const npiMap = new Map<string, string[]>();

    providers.forEach(provider => {
      if (provider.email) {
        const existing = emailMap.get(provider.email) || [];
        existing.push(provider.id);
        emailMap.set(provider.email, existing);
      }

      if (provider.npi && this.validateNPI(provider.npi)) {
        const existing = npiMap.get(provider.npi) || [];
        existing.push(provider.id);
        npiMap.set(provider.npi, existing);
      }
    });

    return providers.map(provider => {
      const issues: ValidationIssue[] = [];
      const duplicateWith: string[] = [];

      if (!provider.first_name || provider.first_name.trim() === '') {
        issues.push('missing_first_name');
      }

      if (!provider.last_name || provider.last_name.trim() === '') {
        issues.push('missing_last_name');
      }

      if (!provider.email || provider.email.trim() === '') {
        issues.push('missing_email');
      } else if (!this.validateEmail(provider.email)) {
        issues.push('invalid_email');
      } else {
        const emailDuplicates = emailMap.get(provider.email) || [];
        if (emailDuplicates.length > 1) {
          issues.push('duplicate_email');
          duplicateWith.push(...emailDuplicates.filter(id => id !== provider.id));
        }
      }

      if (!provider.npi || provider.npi.trim() === '') {
        // NPI can be optional, so we don't flag it as missing
      } else if (!this.validateNPI(provider.npi)) {
        issues.push('invalid_npi');
      } else {
        const npiDuplicates = npiMap.get(provider.npi) || [];
        if (npiDuplicates.length > 1) {
          issues.push('duplicate_npi');
          duplicateWith.push(...npiDuplicates.filter(id => id !== provider.id));
        }
      }

      if (provider.phone_number && provider.phone_number.trim() !== '' && !this.validatePhone(provider.phone_number)) {
        issues.push('invalid_phone');
      }
      if (provider.fax && provider.fax.trim() !== '' && !this.validateFax(provider.fax)) {
        issues.push('invalid_fax');
      }
      if (provider.zip_code && provider.zip_code.trim() !== '' && !this.validateZip(provider.zip_code)) {
        issues.push('invalid_zip');
      }

      return {
        ...provider,
        issues,
        duplicateWith: duplicateWith.length > 0 ? Array.from(new Set(duplicateWith)) : undefined
      };
    });
  },

  getStatistics(providers: ProviderWithIssues[]) {
    const totalCount = providers.length;
    const totalSkipped = providers.filter(p => p.skipped).length;
    const totalMerged = providers.filter(p => p.is_merged).length;
    const newlyCreated = providers.filter(p => {
      const createdDate = new Date(p.created_at);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return createdDate > dayAgo;
    }).length;

    const issueCount = (issueType: ValidationIssue) =>
      providers.filter(p => p.issues.includes(issueType)).length;

    return {
      referralProvider: {
        totalCount: providers.filter(p => p.category === 'referral_provider').length,
        totalSkipped: providers.filter(p => p.category === 'referral_provider' && p.skipped).length,
        totalMerged: providers.filter(p => p.category === 'referral_provider' && p.is_merged).length,
      },
      migratedCategory: {
        totalCount: providers.filter(p => p.category === 'other').length,
        totalSkipped: providers.filter(p => p.category === 'other' && p.skipped).length,
        totalMerged: providers.filter(p => p.category === 'other' && p.is_merged).length,
        newlyCreated: providers.filter(p => {
          if (p.category !== 'other') return false;
          const createdDate = new Date(p.created_at);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return createdDate > dayAgo;
        }).length,
      },
      actions: {
        duplicateEmails: issueCount('duplicate_email'),
        missingEmail: issueCount('missing_email'),
        missingFirstName: issueCount('missing_first_name'),
        missingLastName: issueCount('missing_last_name'),
        invalidNPI: issueCount('invalid_npi'),
        invalidZip: issueCount('invalid_zip'),
        invalidFax: issueCount('invalid_fax'),
        invalidPhone: issueCount('invalid_phone'),
      }
    };
  },

  async bulkUpdate(updates: Array<{ id: string; changes: Partial<ReferralProvider> }>): Promise<void> {
    for (const update of updates) {
      await this.update(update.id, update.changes);
    }
  }
};
