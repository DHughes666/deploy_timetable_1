import {Link} from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import { roles } from '../utils/roles';
import Loading from '../pages/loading';

const ApprovalProtectedRoute = ({ children }) => {
    const { user, role, loading } = useAuth();
    if (loading) {
      return <Loading />;
    }
    if (!user || !(role === roles[0] || role === roles[1])) {
      console.log('User does not have permission:', role);
      return (
        <div className='section section-center text-center'>
          <h2>You are not authorised to access this page</h2>
          <h3><Link to='/'>Back to homepage</Link></h3>
        </div>
      )
    }
    return children;
  };

 
export default ApprovalProtectedRoute;