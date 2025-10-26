import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();

    if (!user) {
        // User not authenticated, redirect to login page
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;