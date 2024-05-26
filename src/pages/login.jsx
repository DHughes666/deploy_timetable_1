import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, CircularProgress,
  Typography, Box, Alert } from '@mui/material';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null);
  const auth = getAuth();

  const navigation = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        navigation('/');
      } catch (err) {
        setError(err);
        return <Alert>Error logging in... {error}</Alert>
      }
  };


  return (
    <Container maxWidth="sm">
      <Box my={4}>
        
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{marginBottom: '10px'}}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{marginBottom: '10px'}}
          />
           <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={44} /> : 'Login'}
              </Button>
         </form>
       </Box>
     </Container>
  );
};



export default Login;

