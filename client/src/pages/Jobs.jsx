// src/pages/Jobs.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [recommending, setRecommending] = useState(false);

  // Fetch all jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        setJobs(res.data);
      } catch (err) {
        setError('❌ Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle recommendation click
  const handleMatchClick = async () => {
    setRecommending(true);
    setError('');

    try {
      if (!user || !user.username || !user.skills || !user.experience) {
        setError('❌ Missing user info for recommendation.');
        setRecommending(false);
        return;
      }

      const payload = {
        name: user.username,
        experience: Number(user.experience),
        skills: Array.isArray(user.skills) ? user.skills : [],
        preferences: user.jobType || 'any',
      };

      console.log('Sending recommendation request:', payload);

      const res = await axios.post(
        'http://localhost:5000/api/jobs/recommend',
        payload,
        { withCredentials: true } // ✅ send JWT cookie
      );

      setRecommended(res.data.matches || []);
    } catch (err) {
      console.error('Recommendation API error:', err.response?.data || err.message);
      setError('❌ Failed to fetch recommendations.');
    } finally {
      setRecommending(false);
    }
  };

  return (
    <div className="px-6 py-10 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-blue-700 tracking-tight">
        AI-Powered Job Match
      </h2>

      <div className="flex justify-center mb-10">
        <button
          onClick={handleMatchClick}
          disabled={recommending}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 disabled:opacity-60"
        >
          {recommending ? '🔍 Finding Matches...' : '🎯 Find My Matches'}
        </button>
      </div>

      {error && <p className="text-center text-red-500 mb-6 font-medium">{error}</p>}

      {/* Recommended Jobs */}
      {recommended.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-center text-green-700 mb-6">
            🎯 Top Recommended Jobs for You
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((job) => (
              <div
                key={job._id}
                className="bg-green-50 border-l-4 border-green-500 p-5 rounded-lg shadow hover:shadow-md transition"
              >
                <h4 className="text-lg font-bold text-gray-800">{job.title}</h4>
                <p className="text-sm text-gray-600">
                  {job.company} – {job.location}
                </p>
                <p className="mt-1 text-sm">🛠 Skills: {job.skillsRequired.join(', ')}</p>
                <p className="mt-1 text-sm">📍 Type: {job.jobType}</p>
                <p className="mt-2 text-sm font-semibold text-green-700">
                  ✅ Match Score: {(job.score * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
          <hr className="mt-10 border-gray-300" />
        </section>
      )}

      {/* All Jobs */}
      <section>
        <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          📄 All Job Listings
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h4 className="text-lg font-bold text-gray-800">{job.title}</h4>
              <p className="text-sm text-gray-600">
                {job.company} – {job.location}
              </p>
              <p className="mt-1 text-sm">🛠 Skills: {job.skillsRequired.join(', ')}</p>
              <p className="mt-1 text-sm">📍 Type: {job.jobType}</p>
            </div>
          ))}
        </div>
      </section>

      {loading && (
        <p className="text-center mt-10 text-gray-500 text-sm">Loading jobs...</p>
      )}
    </div>
  );
}
