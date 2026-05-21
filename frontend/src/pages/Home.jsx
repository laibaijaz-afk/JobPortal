import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your <span className="text-yellow-300">Dream Job</span> Today
          </h1>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Connect with top employers and discover thousands of opportunities tailored to your skills.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, skill, or company..."
              className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3.5 rounded-xl transition-colors duration-200 whitespace-nowrap"
            >
              Search Jobs
            </button>
          </form>

          <p className="mt-4 text-blue-200 text-sm">
            Popular: <button onClick={() => navigate('/jobs?keyword=React')} className="underline hover:text-white">React</button>,{' '}
            <button onClick={() => navigate('/jobs?keyword=Python')} className="underline hover:text-white">Python</button>,{' '}
            <button onClick={() => navigate('/jobs?keyword=Node.js')} className="underline hover:text-white">Node.js</button>,{' '}
            <button onClick={() => navigate('/jobs?keyword=Design')} className="underline hover:text-white">Design</button>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Job Seekers</h3>
            <p className="text-gray-600 mb-5">Create your profile, apply to jobs, and track your applications all in one place.</p>
            <Link to="/register" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Get Started Free
            </Link>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Employers</h3>
            <p className="text-gray-600 mb-5">Post jobs, review applicants, and hire top talent faster than ever before.</p>
            <Link to="/register" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© {new Date().getFullYear()} JobPortal. Built with React & Node.js.</p>
      </footer>
    </div>
  );
};

export default Home;
