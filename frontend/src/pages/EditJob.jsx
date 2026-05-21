import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => {
        const job = data.job;
        setForm({
          title: job.title,
          company: job.company,
          description: job.description,
          location: job.location,
          experience: job.experience,
          jobType: job.jobType,
          skills: job.skills || [],
          skillInput: '',
          salaryMin: job.salary?.min || '',
          salaryMax: job.salary?.max || '',
          isActive: job.isActive,
        });
      })
      .catch(() => { toast.error('Failed to load job.'); navigate('/employer/manage-jobs'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [e.target.name]: val }));
  };

  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (!skill || form.skills.includes(skill)) return;
    setForm((p) => ({ ...p, skills: [...p.skills, skill], skillInput: '' }));
  };

  const removeSkill = (skill) => setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) return toast.error('Add at least one skill.');
    setSaving(true);
    try {
      const payload = {
        title: form.title, company: form.company, description: form.description,
        location: form.location, experience: form.experience, jobType: form.jobType,
        skills: form.skills, isActive: form.isActive,
      };
      if (form.salaryMin || form.salaryMax) {
        payload.salary = {};
        if (form.salaryMin) payload.salary.min = Number(form.salaryMin);
        if (form.salaryMax) payload.salary.max = Number(form.salaryMax);
      }
      await api.put(`/jobs/${id}`, payload);
      toast.success('Job updated successfully!');
      navigate('/employer/manage-jobs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-500 mt-1">Update your job listing details.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Company *</label>
              <input name="company" value={form.company} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
              <input name="location" value={form.location} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
              <select name="jobType" value={form.jobType} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {['full-time', 'part-time', 'contract', 'freelance', 'internship'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level *</label>
            <div className="grid grid-cols-5 gap-2">
              {[['entry', 'Entry'], ['mid', 'Mid'], ['senior', 'Senior'], ['lead', 'Lead'], ['any', 'Any']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setForm((p) => ({ ...p, experience: v }))}
                  className={`py-2 px-2 rounded-lg text-sm font-medium border transition-all ${form.experience === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills *</label>
            <div className="flex gap-2">
              <input value={form.skillInput} onChange={(e) => setForm((p) => ({ ...p, skillInput: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Add skill..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={addSkill} className="bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-100 border border-blue-200">Add</button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {s} <button type="button" onClick={() => removeSkill(s)} className="text-blue-400 hover:text-blue-600 font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Salary</label>
              <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange} placeholder="50000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Salary</label>
              <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange} placeholder="90000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input type="checkbox" name="isActive" id="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Job is active (accepting applications)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/employer/manage-jobs')}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
