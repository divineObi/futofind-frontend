import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReportItemPage from './pages/ReportItemPage';
import ProtectedRoute from './components/ProtectedRoute';
import SearchItemsPage from './pages/SearchItemsPage'; 
import ItemDetailsPage from './pages/ItemDetailsPage';
import MyReportsPage from './pages/MyReportsPage';
import AdminRoute from './components/AdminRoute'; 
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
              path="/report-item" 
              element={
                <ProtectedRoute>
                  <ReportItemPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
              <ProtectedRoute>
                <SearchItemsPage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/item/:itemId" 
              element={
              <ProtectedRoute>
                <ItemDetailsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-reports" 
              element={
              <ProtectedRoute>
                <MyReportsPage />
                </ProtectedRoute>
              }
            />
          <Route 
            path="/admin/claims" 
            element={
              <AdminRoute> 
                <AdminPage />
              </AdminRoute>
            } 
          />
         </Routes>
      </div>
    </Router>
  );
}

export default App;