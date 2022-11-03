import { useRef, useContext, useState } from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import axios from '../../api/axios';
import styles from '../forms/Form.module.scss';
import CustomLoadingButton from '../buttons/LoadingButton';
import AuthContext from '../../context/AuthProvider';

export default function RequestActivationEmail() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { auth } = useContext(AuthContext);

  const emailRef = useRef();

  const handleClick = async (evnt) => {
    evnt.preventDefault();
    const email = emailRef.current.value;

    if (email === '') {
      setOpen(true);
      setMessage('Please fill in all the required fields.');
      setSeverity('error');
      return
    };

    setLoading(true);
    setDisabled(true);

    try {
      await axios.patch('users/request-activate/', { email });
      setOpen(true);
      setMessage('Please check your emails for the activation link');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
    } catch(err) {
      setOpen(true);
      setMessage(err?.response?.data?.detail);
      setSeverity('error');
      setLoading(false);
      setDisabled(false);
      return
    }
  }

  if (auth?.username) { return (
    <Box className={styles['form']}>
      <Typography
        variant='h4'
        component="h1"
        textAlign={'center'}
        className={styles['title']}
        gutterBottom
      >
        You have logged in as&nbsp;
        <span className='highlight-text'>
          {auth.username}
        </span>
      </Typography>
      <Box textAlign={"center"}>
        <Button
          variant="contained"
          title="Back to homepage" 
          category="action"
          route='/'
        />
        <Button
          variant="outlined"
          title="Open profile" 
          category="action"
          route={`/users/${auth.username}`}
        />
      </Box>
    </Box>
  )}

  return (
    <Box className={styles['form']}>
      
      <Box
        sx={{
          padding: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color3a)',
        }}
      >
        <Typography 
          variant='h4' 
          component='h1' 
          textAlign={'center'} 
          className={styles['title']}
          gutterBottom
        >
          Resend activation email
        </Typography>
        <Typography variant="subtitle1" className={styles['divider']} gutterBottom></Typography>
        <form autoComplete='off'>
          <TextField
            label='Email'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='signup-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={emailRef}
          />
          
          <Box textAlign={'center'} marginTop='1em'>
            <CustomLoadingButton 
              title='Send'
              category='action'
              variant='contained'
              isFullWidth={true}
              onClick={handleClick}
              disabled={disabled}
              loading={loading}
            />
          </Box>
        </form>
      </Box>
      <Snackbar 
        open={open}
        autoHideDuration={3000}
        onClose={((evnt, reason) => {
          if (reason === 'timeout') {
            setOpen(false);
          }
        })}
      >
        <Alert variant='filled' severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
