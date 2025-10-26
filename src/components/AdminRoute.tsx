import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();

    // The user must exist AND have the role of 'admin'.
    // If not, redirect them to their regular dashboard.
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return <>{children}</>;
};

export default AdminRoute;