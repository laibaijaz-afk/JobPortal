import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/employer/myjobs');
      setJobs(data.jobs);
    } catch {
      toast.error('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? All applications will also be removed.')) return;
    setDeletingId(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job deleted successfully.');
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (job) => {
    setTogglingId(job._id);
    try {
      const { data } = await api.put(`/jobs/${job._id}`, { isActive: !job.isActive });
      setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, isActive: data.job.isActive } : j)));
      toast.success(`Job marked as ${data.job.isActive ? 'active' : 'inactive'}.`);
    } catch {
      toast.error('Failed to update job status.');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="text-gray-500 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
          </div>
          <Link
            to="/employer/post-job"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            + Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs posted yet</h3>
            <Link to="/employer/post-job" className="inline-block mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-blue-700">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Job</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Type</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Applicants</th>
                    <th className="text-left px-6 py-3.5 font-semibold text-gray-600">Status</th>
                    <th className="text-right px-6 py-3.5 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/jobs/${job._id}`} className="font-medium text-gray-900 hover:text-blue-600">
                          {job.title}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{job.location}</p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="capitalize text-gray-600">{job.jobType}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <Link to={`/employer/jobs/${job._id}/applicants`} className="text-blue-600 hover:underline">
                          {job.applicationCount ?? 0} applicants
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(job)}
                          disabled={togglingId === job._id}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                            job.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {togglingId === job._id ? '...' : job.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/employer/jobs/${job._id}/edit`}
                            className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/employer/jobs/${job._id}/applicants`}
                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                          >
                            Applicants
                          </Link>
                          <button
                            onClick={() => handleDelete(job._id)}
                            disabled={deletingId === job._id}
                            className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-40"
                          >
                            {deletingId === job._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
