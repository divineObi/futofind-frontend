import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // <-- Get the login function from context
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Registration successful! Please log in.');
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const response = await loginApi(formData); // Using loginApi to avoid name conflict
            login(response.data); // <-- Use the context's login function
            navigate('/dashboard'); // <-- Redirect to dashboard on success
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

  const title = "Welcome back 👋";
  const subtitle = "Log in to track your lost items, report finds, and get instant updates.";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {/* This form content is passed into AuthLayout as children */}
      <div className="p-8 border border-gray-200 rounded-lg bg-white">
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">Welcome Back</h2>
        {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-center text-green-500 text-sm mt-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <input
            type="email"
            name="email"
            placeholder="Email:"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password:"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition duration-300 disabled:bg-teal-300 flex items-center justify-center"
          >
          {loading ? <Spinner /> : 'Log In'}
          </button>
        </form>
        <div className="text-sm text-center mt-4">
           <button
                type="button"
                // We can add an onClick handler here in the future. For now, it just looks like a link.
                // For a slightly better user experience, we can alert the user that the feature isn't ready.
                onClick={() => alert('Forgot Password feature is not yet implemented.')}
                className="font-medium text-gray-600 hover:text-teal-500"
              >
                Forgot password?
            </button>
        </div>
        <div className="text-sm text-center mt-6">
          <p className="text-gray-600">Don't have an account? 
            <Link to="/register" className="font-semibold text-teal-500 hover:underline ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;