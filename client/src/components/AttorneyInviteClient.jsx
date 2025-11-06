import React, { useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

export default function AttorneyInviteClient() {
  const [form, setForm] = useState({
    email: '',
    label: '',
    relationship_status: 'single',
    residence_country: 'USA',
    residence_admin_area: '',
    residence_locality: '',
    residence_postal_code: '',
    residence_line1: '',
    residence_line2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/client`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to invite client');
      }

      setSuccess({
        message: 'Client invite sent successfully.',
        client: data.data?.client,
        acceptUrl: data.data?.invitation?.accept_url,
      });
      setForm({
        email: '',
        label: '',
        relationship_status: 'single',
        residence_country: 'USA',
        residence_admin_area: '',
        residence_locality: '',
        residence_postal_code: '',
        residence_line1: '',
        residence_line2: '',
      });
    } catch (err) {
      setError(err.message || 'Unable to invite client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invite a Client</h1>
        <p className="text-gray-600 mt-2">
          Invite a new client by providing their email and basic profile information. They will receive an email with a link to activate their account and complete their details.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {success.message}
              {success.client && (
                <div className="mt-2 text-xs text-green-700">
                  Client: {success.client.label}
                </div>
              )}
              {success.acceptUrl && (
                <div className="mt-2 text-xs text-green-700 break-words">
                  Accept link: {success.acceptUrl}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client email *</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="client@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client label *</label>
              <input
                type="text"
                value={form.label}
                onChange={handleChange('label')}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="e.g. John Smith Estate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship status *</label>
              <select
                value={form.relationship_status}
                onChange={handleChange('relationship_status')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="partnered">Partnered</option>
              </select>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Residence</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={form.residence_country}
                  onChange={handleChange('residence_country')}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State / Province *</label>
                <input
                  type="text"
                  value={form.residence_admin_area}
                  onChange={handleChange('residence_admin_area')}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={form.residence_locality}
                  onChange={handleChange('residence_locality')}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Postal code</label>
                <input
                  type="text"
                  value={form.residence_postal_code}
                  onChange={handleChange('residence_postal_code')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address line 1</label>
                <input
                  type="text"
                  value={form.residence_line1}
                  onChange={handleChange('residence_line1')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address line 2</label>
                <input
                  type="text"
                  value={form.residence_line2}
                  onChange={handleChange('residence_line2')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-opacity duration-200 bg-gradient-to-r from-[var(--ll-bg-2)] to-[var(--ll-bg-1)] hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Sending invite…' : 'Send invite'}
          </button>
        </form>
      </div>
    </div>
  );
}
