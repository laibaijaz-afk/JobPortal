import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  shortlisted: { label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-600' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-700' },
};

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobRes] = await Promise.all([
          api.get(`/applications/job/${jobId}`),
          api.get(`/jobs/${jobId}`),
        ]);
        setApplications(appsRes.data.applications);
        setJobTitle(jobRes.data.job.title);
      } catch {
        toast.error('Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    setUpdatingId(appId);
    try {
      const { data } = await api.put(`/applications/${appId}/status`, { status });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: data.application.status } : a))
      );
      toast.success(`Status updated to ${status}.`);
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/employer/manage-jobs" className="text-sm text-gray-500 hover:text-gray-700">← Back to Manage Jobs</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{jobTitle}</h1>
          <p className="text-gray-500 mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-700">No applications yet</h3>
            <p className="text-gray-500 text-sm mt-2">Candidates haven't applied to this job yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                        {app.candidate?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.candidate?.name}</h3>
                        <p className="text-sm text-gray-500">{app.candidate?.email}</p>
                      </div>
                    </div>

                    {app.candidate?.bio && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{app.candidate.bio}</p>
                    )}

                    {app.candidate?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {app.candidate.skills.map((s, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{s}</span>
                        ))}
                      </div>
                    )}

                    {app.coverLetter && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 mb-1">Cover Letter</p>
                        <p className="text-sm text-gray-700 line-clamp-3">{app.coverLetter}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                      {app.resume && (
                        <a href={app.resume} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                          📄 View Resume
                        </a>
                      )}
                      {app.candidate?.resumeUrl && (
                        <a href={app.candidate.resumeUrl} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium flex items-center gap-1">
                          📄 Profile Resume
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 sm:min-w-[160px]">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${STATUS_CONFIG[app.status]?.color}`}>
                      {STATUS_CONFIG[app.status]?.label}
                    </span>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      disabled={updatingId === app._id}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50"
                    >
                      <option value="applied">Applied</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
