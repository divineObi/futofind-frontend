import React from 'react';
import logo from '../assets/Logo.png'; 
import illustration from '../assets/amico.png';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50"> {/* Changed bg to gray-50 to match mobile screenshots */}
      {/* Left Column (The Form) */}
      {/* IMPROVED: Added min-h-screen for mobile to ensure it fills the view */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden"> {/* This logo is now centered and only visible on mobile */}
            <img src={logo} alt="FutoFind Logo" className="h-20 w-auto mx-auto" />
          </div>
          {children} 
        </div>
      </div>

      {/* Right Column (The Illustration and Welcome Text) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-white">
        <div className="text-center max-w-lg"> {/* Added max-w-lg for better text wrapping */}
            <img src={illustration} alt="Illustration" className="w-full max-w-md mx-auto" />
            {/* Added a logo that only shows on desktop */}
            <img src={logo} alt="FutoFind Logo" className="h-20 w-auto mx-auto my-8" />
            <h1 className="text-4xl font-bold text-gray-800" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="mt-4 text-lg text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;