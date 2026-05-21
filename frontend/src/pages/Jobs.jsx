import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import FilterPanel from '../components/FilterPanel';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const INIT_FILTERS = { location: '', experience: '', jobType: '', skills: '' };

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [inputVal, setInputVal] = useState(searchParams.get('keyword') || '');
  const [filters, setFilters] = useState(INIT_FILTERS);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (keyword) params.keyword = keyword;
      if (filters.location) params.location = filters.location;
      if (filters.experience) params.experience = filters.experience;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.skills) params.skills = filters.skills;

      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }, [keyword, filters, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(inputVal);
    setPage(1);
    setSearchParams(inputVal ? { keyword: inputVal } : {});
  };

  const resetFilters = () => {
    setFilters(INIT_FILTERS);
    setKeyword('');
    setInputVal('');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search jobs by title, skill, or company..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterPanel filters={filters} setFilters={setFilters} onReset={resetFilters} />
          </div>

          {/* Job List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-600 text-sm">
                {loading ? 'Loading...' : `${total} job${total !== 1 ? 's' : ''} found`}
                {keyword && <span className="font-medium"> for "{keyword}"</span>}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No jobs found</h3>
                <p className="text-gray-500 text-sm mb-4">Try different keywords or remove filters.</p>
                <button
                  onClick={resetFilters}
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600 px-2">
                      Page {page} of {pages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
