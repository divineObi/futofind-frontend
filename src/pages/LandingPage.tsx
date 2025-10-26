import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';
import illustration from '../assets/illustration.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* 1. Header Navigation (Desktop) */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4">
        <nav className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="FutoFind Logo" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/about"
              className="text-gray-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition"
            >
              About
            </Link>
            <Link
              to="/register"
              className="bg-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-600 transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-300 transition"
            >
              Log in
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 flex items-center w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Column: Text Content (Order 2 on Mobile) */}
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-teal-500 tracking-tight">
              FIND IT. <br />
              REPORT IT. <br />
              CLAIM IT.
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Lost something on campus? Or did you find an item that belongs to someone else?
              <strong className="font-bold text-teal-500"> FutoFind </strong>
              is the official digital lost-and-found platform of FUTO, designed to make it simple for students and staff to report, track, and recover items in real-time.
            </p>
          </div>

          {/* Right Column: Illustration (Order 1 on Mobile) */}
          <div className="order-1 md:order-2">
            <img src={illustration} alt="Person looking for an item" className="w-full h-auto" />
          </div>

        </div>
      </main>
      
      {/* 3. Mobile-Only Buttons at the Bottom */}
      <footer className="md:hidden p-6">
          <div className="flex flex-col gap-4">
              <Link
                to="/register"
                className="w-full text-center bg-teal-500 text-white font-semibold py-3 rounded-full hover:bg-teal-600 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="w-full text-center bg-gray-200 text-gray-800 font-semibold py-3 rounded-full hover:bg-gray-300 transition"
              >
                Login
              </Link>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;