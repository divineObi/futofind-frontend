import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import AuthLayout from '../components/AuthLayout';
import Spinner from '../components/Spinner';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [agreed, setAgreed] = useState(false); // State for the checkbox
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (!agreed) {
        return setError('You must agree to the terms and privacy policy.');
    }
    setError('');
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // For HTML rendering in the title
  const title = 'Create your <span class="text-teal-500">FutoFind</span> account!!!';
  const subtitle = "Join students and staff keeping campus items safe and found.";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
       <div className="p-8 border border-gray-200 rounded-lg bg-white">
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">Sign Up</h2>
        {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <input
            type="text" name="name" placeholder="Full Name:" required
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="email" name="email" placeholder="Email:" required
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
           <input
            type="password" name="password" placeholder="Password:" required
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password" name="confirmPassword" placeholder="Confirm Password:" required
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select name="role" onChange={handleChange} value={formData.role} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-500">
                <option value="student">Student</option>
                <option value="staff">Staff</option>
          </select>
          
          <div className="flex items-center">
            <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
            <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">I agree to the <button type="button" className="font-medium hover:text-teal-500 underline"> Terms & Privacy Policy </button>.</label>
          </div>
          
          <button
            type="submit" disabled={loading}
             className="w-full py-3 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition duration-300 disabled:bg-teal-300 flex items-center justify-center"
            >
                {loading ? <Spinner /> : 'Sign Up'}
          </button>

          
        </form>
        <div className="text-sm text-center mt-6">
          <p className="text-gray-600">Already have an account? 
            <Link to="/login" className="font-semibold text-teal-500 hover:underline ml-1">
              Login
            </Link>
          </p>
        </div>
        <div className="text-xs text-center text-gray-400 mt-4">
          <p>After registering, please check your spam folder for any confirmation emails from us and mark them as "not spam".</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;