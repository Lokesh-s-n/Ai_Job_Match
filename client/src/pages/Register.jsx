import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const allSkills = [
  'Python', 'Data Engineering', 'SQL', 'AWS', 'Airflow',
  'React', 'Node.js', 'MongoDB', 'Express', 'Docker',
  'TypeScript', 'Next.js', 'Kubernetes', 'Redis', 'GraphQL',
  'GCP', 'Azure', 'Java', 'Spring Boot', 'PostgreSQL'
];

const topIndianCities = [
  'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Chennai',
  'Delhi NCR', 'Noida', 'Gurgaon', 'Ahmedabad', 'Kolkata',
  'Jaipur', 'Indore', 'Chandigarh', 'Coimbatore', 'Remote'
];

export default function Register() {
  const { setAuth, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    location: '',
    experience: '',
    jobType: 'any',
    skills: []
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (skill) => {
    const updated = formData.skills.includes(skill)
      ? formData.skills.filter((s) => s !== skill)
      : [...formData.skills, skill];
    setFormData({ ...formData, skills: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/register',
        {
          ...formData,
          experience: Number(formData.experience) || 0,
        },
        { withCredentials: true }
      );

      if (res.data.user) {
        setAuth(true);
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/jobs');
      }
    } catch (err) {
  console.error("❌ Registration API error:", err.response?.data || err.message);
  setError(err.response?.data?.message || "Registration failed");
}

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Create Your Account</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* 🔽 Location dropdown with top Indian cities */}
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Select Location</option>
            {topIndianCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          />
          <select
            name="jobType"
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="any">Any</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        <div className="mt-6">
          <label className="block font-medium mb-2">Select Skills:</label>
          <div className="flex flex-wrap gap-3">
            {allSkills.map((skill) => (
              <label key={skill} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md shadow-sm">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={() => handleSkillChange(skill)}
                  className="form-checkbox accent-blue-600"
                />
                <span className="text-sm text-gray-800">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
        >
          Register
        </button>
      </form>
    </div>
  );
}
