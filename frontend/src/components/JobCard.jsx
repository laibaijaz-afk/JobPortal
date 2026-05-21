import { Link } from 'react-router-dom';

const EXPERIENCE_LABELS = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  lead: 'Lead',
  any: 'Any Level',
};

const JOB_TYPE_COLORS = {
  'full-time': 'bg-green-100 text-green-700',
  'part-time': 'bg-yellow-100 text-yellow-700',
  contract: 'bg-purple-100 text-purple-700',
  freelance: 'bg-orange-100 text-orange-700',
  internship: 'bg-blue-100 text-blue-700',
};

const JobCard = ({ job }) => {
  const salaryText =
    job.salary?.min && job.salary?.max
      ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
      : job.salary?.min
      ? `From $${job.salary.min.toLocaleString()}`
      : null;

  const postedDate = new Date(job.createdAt);
  const daysAgo = Math.floor((Date.now() - postedDate) / 86400000);
  const dateLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
            {job.title}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{job.company}</p>
        </div>
        {job.jobType && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${JOB_TYPE_COLORS[job.jobType] || 'bg-gray-100 text-gray-600'}`}>
            {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {EXPERIENCE_LABELS[job.experience] || job.experience}
        </span>
        {salaryText && (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {salaryText}
          </span>
        )}
      </div>

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-xs text-gray-400 px-2 py-1">+{job.skills.length - 5} more</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 mt-auto">
        <span className="text-xs text-gray-400">{dateLabel}</span>
        <Link
          to={`/jobs/${job._id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
