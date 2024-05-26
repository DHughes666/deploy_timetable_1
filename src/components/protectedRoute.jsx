import {Navigate} from 'react-router-dom'
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      console.log('Not authenticated, redirecting to login');
      return <Navigate to="/login" />;
    }
    return children;
  };

export default ProtectedRoute;