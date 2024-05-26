import styled from 'styled-components';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { links } from '../utils/constants';
import logo_home from '../assets/Logo.png';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, name, role } = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <>
      <NavContainer>
        <div className='nav-center'>
          <div className='nav-header'>
            <Link to='/'>
              <img src={logo_home} alt='Home Logo' />
            </Link>
          </div>
          <ul className='nav-links'>
            {links.map((link) => {
              const { id, text, url } = link;
              return (
                <li key={id}>
                  <Link to={url}>{text}</Link>
                </li>
              );
            })}
          </ul>
          <div className='auth-section'>
            {!user ? (
              <AuthLinks>
                <StyledLink to="/login">Login</StyledLink>
                <StyledLink to="/register">Register</StyledLink>
              </AuthLinks>
            ) : (
              <>
                <UserInfo>
                  <span>{name}</span>
                  <span>({role})</span>
                </UserInfo>
                <StyledLink to="/" onClick={handleLogout}>Logout</StyledLink>
              </>
            )}
          </div>
        </div>
      </NavContainer>
      <Outlet />
    </>
  );
};

const NavContainer = styled.nav`
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .nav-center {
    width: 90vw;
    margin: 0 auto;
    max-width: var(--max-width);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .nav-header {
    display: flex;
    align-items: center;
    img {
      width: 70px;
      margin-left: -15px;
    }
  }
  .nav-links {
    display: flex;
    list-style: none;
    li {
      margin: 0 0.5rem;
    }
    a {
      color: var(--clr-grey-3);
      font-size: 1rem;
      text-transform: capitalize;
      letter-spacing: var(--spacing);
      padding: 0.5rem;
      &:hover {
        border-bottom: 2px solid var(--clr-primary-7);
      }
    }
  }
  .auth-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  @media (max-width: 768px) {
    .nav-links {
      display: none;
      font-weight: bold;
    }
  }
`;

const AuthLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: inherit;
  font-size: 1rem;
  font-weight: bold;
  text-transform: capitalize;
  letter-spacing: var(--spacing);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  span {
    font-size: 1rem;
    color: var(--clr-grey-3);
    &:first-child {
      font-weight: bold;
    }
  }
`;

export default Navbar;
