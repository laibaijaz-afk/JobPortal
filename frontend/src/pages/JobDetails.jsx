import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const EXPERIENCE_LABELS = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior Level', lead: 'Lead', any: 'Any Level' };

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ resume: '', coverLetter: '' });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);

        if (user?.role === 'candidate') {
          const { data: apps } = await api.get('/applications/user');
          setApplied(apps.applications.some((a) => a.job._id === id));
        }
      } catch {
        toast.error('Job not found.');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post('/applications', { jobId: id, ...applyForm });
      setApplied(true);
      setShowApplyModal(false);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!job) return null;

  const salaryText = job.salary?.min && job.salary?.max
    ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()} ${job.salary.currency || 'USD'}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
          ← Back to jobs
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-blue-600 font-medium mt-1">{job.company}</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Posted by {job.employer?.name}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {job.isActive ? 'Active' : 'Closed'}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01" />
                  </svg>
                  {EXPERIENCE_LABELS[job.experience]}
                </span>
                {job.jobType && (
                  <span className="capitalize flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.jobType}
                  </span>
                )}
                {salaryText && (
                  <span className="text-green-600 font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
                    </svg>
                    {salaryText}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{job.description}</div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-20">
              {!user && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Sign in to apply for this position.</p>
                  <Link to="/login" className="block w-full bg-blue-600 text-white text-center py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                    Sign In to Apply
                  </Link>
                </div>
              )}

              {user?.role === 'candidate' && (
                <div>
                  {applied ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="text-green-700 font-semibold text-sm">Application Submitted</p>
                      <Link to="/candidate/applied-jobs" className="text-blue-600 text-xs hover:underline mt-1 block">
                        View my applications
                      </Link>
                    </div>
                  ) : job.isActive ? (
                    <button
                      onClick={() => setShowApplyModal(true)}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  ) : (
                    <p className="text-center text-gray-500 text-sm">This job is no longer accepting applications.</p>
                  )}
                </div>
              )}

              {user?.role === 'employer' && user._id === job.employer?._id && (
                <div className="space-y-2">
                  <Link
                    to={`/employer/jobs/${job._id}/edit`}
                    className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Edit Job
                  </Link>
                  <Link
                    to={`/employer/jobs/${job._id}/applicants`}
                    className="block w-full text-center bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    View Applicants ({job.applicationCount || 0})
                  </Link>
                </div>
              )}

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-2 text-sm text-gray-500">
                <p>📅 Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                <p>👥 {job.applicationCount || 0} applicant{job.applicationCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Apply for {job.title}</h3>
            <p className="text-sm text-gray-500 mb-5">{job.company}</p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume URL <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="url"
                  value={applyForm.resume}
                  onChange={(e) => setApplyForm((p) => ({ ...p, resume: e.target.value }))}
                  placeholder="https://yourresume.com/resume.pdf"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={applyForm.coverLetter}
                  onChange={(e) => setApplyForm((p) => ({ ...p, coverLetter: e.target.value }))}
                  rows={4}
                  placeholder="Tell the employer why you're a great fit..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {applying && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
