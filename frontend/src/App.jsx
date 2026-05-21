import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import EditJob from './pages/EditJob';
import Applicants from './pages/Applicants';
import CandidateDashboard from './pages/CandidateDashboard';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
          }}
        />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Employer */}
              <Route
                path="/employer/dashboard"
                element={<ProtectedRoute roles={['employer']}><EmployerDashboard /></ProtectedRoute>}
              />
              <Route
                path="/employer/post-job"
                element={<ProtectedRoute roles={['employer']}><PostJob /></ProtectedRoute>}
              />
              <Route
                path="/employer/manage-jobs"
                element={<ProtectedRoute roles={['employer']}><ManageJobs /></ProtectedRoute>}
              />
              <Route
                path="/employer/jobs/:id/edit"
                element={<ProtectedRoute roles={['employer']}><EditJob /></ProtectedRoute>}
              />
              <Route
                path="/employer/jobs/:jobId/applicants"
                element={<ProtectedRoute roles={['employer']}><Applicants /></ProtectedRoute>}
              />

              {/* Candidate */}
              <Route
                path="/candidate/applied-jobs"
                element={<ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>}
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
