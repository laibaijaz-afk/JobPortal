import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  shortlisted: { label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
};

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    api.get('/applications/user')
      .then(({ data }) => setApplications(data.applications))
      .catch(() => toast.error('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Withdraw this application?')) return;
    setWithdrawingId(appId);
    try {
      await api.delete(`/applications/${appId}`);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      toast.success('Application withdrawn.');
    } catch {
      toast.error('Failed to withdraw application.');
    } finally {
      setWithdrawingId(null);
    }
  };

  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <Link to="/jobs" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm">
            Browse Jobs
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'total', label: 'Total', value: applications.length, color: 'bg-gray-100 text-gray-700' },
            { key: 'shortlisted', label: 'Shortlisted', value: counts.shortlisted || 0, color: 'bg-yellow-100 text-yellow-700' },
            { key: 'hired', label: 'Hired', value: counts.hired || 0, color: 'bg-green-100 text-green-700' },
            { key: 'rejected', label: 'Rejected', value: counts.rejected || 0, color: 'bg-red-100 text-red-600' },
          ].map((stat) => (
            <div key={stat.key} className={`rounded-xl p-4 text-center ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No applications yet</h3>
            <p className="text-gray-500 text-sm mb-4">Start applying to jobs you're interested in.</p>
            <Link to="/jobs" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
              const job = app.job;
              return (
                <div key={app._id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <Link to={`/jobs/${job?._id}`} className="font-semibold text-gray-900 hover:text-blue-600 text-sm line-clamp-1">
                          {job?.title || 'Job no longer available'}
                        </Link>
                        {!job?.isActive && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full whitespace-nowrap">Closed</span>
                        )}
                      </div>
                      <p className="text-sm text-blue-600 mt-0.5">{job?.company}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        {job?.location && <span>📍 {job.location}</span>}
                        {job?.experience && <span>💼 {job.experience}</span>}
                        {job?.jobType && <span className="capitalize">🕐 {job.jobType}</span>}
                        <span>📅 Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                      {app.status === 'applied' && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          disabled={withdrawingId === app._id}
                          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          {withdrawingId === app._id ? '...' : 'Withdraw'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
