import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import axios from '../../api/axios';

export default function Activation() {
  const params = useParams();
  const activationToken = params.activationToken;
  const [ message, setMessage ] = useState('Verification in process...');
  const navigate = useNavigate();

  useEffect(() => {
    async function activate() {
      try {
        await axios.patch(`users/activate/${activationToken}`);
        setMessage('Email successfully verified. You will be directed to login page shortly...')
        setTimeout(navigate, 1500, '/login');
      } catch(err) {
        setMessage(err?.response?.data?.detail)
        return
      }
    }
    activate();
  }, [])

  return (
    <Box>
      <Typography variant='h4' component='h1' color='var(--color2)'>
        Email verification
      </Typography>

      <Typography variant='body1' component='p' color='var(--color2)'>
        {message}
      </Typography>

    </Box>
  )
}