import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ProfileAPI } from '../api/profile';

const EMPTY_FORM = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  preferredName: '',
  dateOfBirth: '',
  birthCountry: '',
  birthState: '',
  birthCity: '',
  residenceCountry: '',
  residenceState: '',
  residenceParish: '',
  residenceCity: '',
  residenceZipCode: '',
  residenceAddress1: '',
  residenceAddress2: '',
};

function extractInitials(value = '') {
  if (!value) return EMPTY_FORM;
  const person = value.person || {};
  const client = value.client || {};

  return {
    firstName: person.first_name || '',
    middleName: person.middle_name || '',
    lastName: person.last_name || '',
    suffix: person.suffix || '',
    preferredName: person.preferred_name || '',
    dateOfBirth: person.date_of_birth ? person.date_of_birth.substring(0, 10) : '',
    birthCountry: person.birth_country || '',
    birthState: person.birth_admin_area || '',
    birthCity: person.birth_locality || '',
    residenceCountry: client.residence_country || '',
    residenceState: client.residence_admin_area || '',
    residenceParish: '',
    residenceCity: client.residence_locality || '',
    residenceZipCode: client.residence_postal_code || '',
    residenceAddress1: client.residence_line1 || '',
    residenceAddress2: client.residence_line2 || '',
  };
}

function buildPayload(form) {
  return {
    person: {
      first_name: form.firstName,
      middle_name: form.middleName || null,
      last_name: form.lastName,
      suffix: form.suffix || null,
      preferred_name: form.preferredName || null,
      date_of_birth: form.dateOfBirth || null,
      birth_country: form.birthCountry || null,
      birth_admin_area: form.birthState || null,
      birth_locality: form.birthCity || null,
    },
    client: {
      residence_country: form.residenceCountry,
      residence_admin_area: form.residenceState,
      residence_locality: form.residenceCity,
      residence_postal_code: form.residenceZipCode || null,
      residence_line1: form.residenceAddress1 || null,
      residence_line2: form.residenceAddress2 || null,
    },
  };
}

export default function AboutYou() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const formRef = useRef(null);
  const headerRef = useRef(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'none' }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const res = await ProfileAPI.getProfile();
        if (!cancelled) {
          setFormData(extractInitials(res.data));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load profile');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const canSubmit = useMemo(() => {
    return (
      formData.firstName.trim().length > 0 &&
      formData.lastName.trim().length > 0 &&
      formData.residenceCountry.trim().length > 0 &&
      formData.residenceState.trim().length > 0 &&
      formData.residenceCity.trim().length > 0
    );
  }, [formData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || !canSubmit) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      const payload = buildPayload(formData);
      const res = await ProfileAPI.updateProfile(payload);
      setFormData(extractInitials(res.data));
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="text-lg font-medium">Loading your information…</div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">About You</h1>
          <p className="text-gray-600 mt-2">
            Tell us a little bit about yourself. This information helps your attorney personalise your estate planning.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Middle name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={handleInputChange('middleName')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Suffix</label>
                <input
                  type="text"
                  value={formData.suffix}
                  onChange={handleInputChange('suffix')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred name</label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={handleInputChange('preferredName')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange('dateOfBirth')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Residence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Country *</label>
                <input
                  type="text"
                  value={formData.residenceCountry}
                  onChange={handleInputChange('residenceCountry')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State / Province *</label>
                <input
                  type="text"
                  value={formData.residenceState}
                  onChange={handleInputChange('residenceState')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parish / County</label>
                <input
                  type="text"
                  value={formData.residenceParish}
                  onChange={handleInputChange('residenceParish')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  value={formData.residenceCity}
                  onChange={handleInputChange('residenceCity')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP / Postal code</label>
                <input
                  type="text"
                  value={formData.residenceZipCode}
                  onChange={handleInputChange('residenceZipCode')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mailing address</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Address line 1</label>
                <input
                  type="text"
                  value={formData.residenceAddress1}
                  onChange={handleInputChange('residenceAddress1')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address line 2</label>
                <input
                  type="text"
                  value={formData.residenceAddress2}
                  onChange={handleInputChange('residenceAddress2')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to dashboard
            </button>
            <button
              type="submit"
              disabled={saving || !canSubmit}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[var(--ll-bg-2)] to-[var(--ll-bg-1)] px-6 py-3 font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

