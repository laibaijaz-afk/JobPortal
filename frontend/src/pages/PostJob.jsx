import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const INIT_FORM = {
  title: '',
  company: '',
  description: '',
  location: '',
  experience: 'entry',
  jobType: 'full-time',
  skillInput: '',
  skills: [],
  salaryMin: '',
  salaryMax: '',
};

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...INIT_FORM, company: user?.company || '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addSkill = () => {
    const skill = form.skillInput.trim();
    if (!skill) return;
    if (form.skills.includes(skill)) return toast.error('Skill already added.');
    setForm((p) => ({ ...p, skills: [...p.skills, skill], skillInput: '' }));
  };

  const removeSkill = (skill) => setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) return toast.error('Add at least one skill.');

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        company: form.company,
        description: form.description,
        location: form.location,
        experience: form.experience,
        jobType: form.jobType,
        skills: form.skills,
      };
      if (form.salaryMin || form.salaryMax) {
        payload.salary = {};
        if (form.salaryMin) payload.salary.min = Number(form.salaryMin);
        if (form.salaryMax) payload.salary.max = Number(form.salaryMax);
      }

      const { data } = await api.post('/jobs', payload);
      toast.success('Job posted successfully!');
      navigate(`/jobs/${data.job._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-500 mt-1">Fill in the details to attract the right candidates.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g. Senior React Developer"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
              <input
                name="company" value={form.company} onChange={handleChange} required
                placeholder="Your company"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Description *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange} required
              rows={6} placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
              <input
                name="location" value={form.location} onChange={handleChange} required
                placeholder="e.g. New York, Remote"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
              <select
                name="jobType" value={form.jobType} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {['full-time', 'part-time', 'contract', 'freelance', 'internship'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level *</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[['entry', 'Entry'], ['mid', 'Mid'], ['senior', 'Senior'], ['lead', 'Lead'], ['any', 'Any']].map(([v, l]) => (
                <button
                  key={v} type="button"
                  onClick={() => setForm((p) => ({ ...p, experience: v }))}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    form.experience === v
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Required Skills *</label>
            <div className="flex gap-2">
              <input
                value={form.skillInput}
                onChange={(e) => setForm((p) => ({ ...p, skillInput: e.target.value }))}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. React (press Enter)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button" onClick={addSkill}
                className="bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
              >
                Add
              </button>
            </div>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.skills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-blue-600 font-bold leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range <span className="font-normal text-gray-400">(optional, USD/year)</span></label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange}
                placeholder="Min (e.g. 50000)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange}
                placeholder="Max (e.g. 90000)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={() => navigate('/employer/dashboard')}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
