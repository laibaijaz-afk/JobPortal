import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get('/jobs/employer/stats'),
          api.get('/jobs/employer/myjobs'),
        ]);
        setStats(statsRes.data.stats);
        setRecentJobs(jobsRes.data.jobs.slice(0, 5));
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
            <p className="text-gray-500 mt-1">{user?.company || 'Your Company'} · Employer Dashboard</p>
          </div>
          <Link
            to="/employer/post-job"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Jobs" value={stats?.totalJobs ?? 0} icon="📋" color="bg-blue-50" />
          <StatCard label="Active Jobs" value={stats?.activeJobs ?? 0} icon="✅" color="bg-green-50" />
          <StatCard label="Total Applications" value={stats?.totalApplications ?? 0} icon="📨" color="bg-purple-50" />
          <StatCard label="Shortlisted" value={stats?.shortlisted ?? 0} icon="⭐" color="bg-yellow-50" />
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Job Posts</h2>
            <Link to="/employer/manage-jobs" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-500 text-sm">You haven't posted any jobs yet.</p>
              <Link to="/employer/post-job" className="text-blue-600 text-sm hover:underline mt-2 block font-medium">
                Post your first job →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${job._id}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm">
                      {job.title}
                    </Link>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{job.location}</span>
                      <span className={`text-xs font-medium ${job.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-sm text-gray-500">{job.applicationCount ?? 0} applicants</span>
                    <Link
                      to={`/employer/jobs/${job._id}/applicants`}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { to: '/employer/post-job', icon: '✏️', label: 'Post a Job', desc: 'Create a new job listing' },
            { to: '/employer/manage-jobs', icon: '📋', label: 'Manage Jobs', desc: 'Edit or close job posts' },
            { to: '/jobs', icon: '🔍', label: 'Browse Portal', desc: 'See how candidates view jobs' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all flex items-start gap-3"
            >
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
