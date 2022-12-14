import { useRef, useState, useContext} from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import AuthContext from '../../../context/AuthProvider';
import axios from '../../../api/axios';
import styles from '../Form.module.scss';
import CustomLoadingButton from '../../buttons/LoadingButton';

export default function LoginForm() {
  const [cookies, setCookie] = useCookies();
  const { auth, setAuth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  const formObj = {
    emailRef: useRef(),
    passwordRef: useRef(),
  }

  const loginSubmit = async (evnt) => {
    evnt.preventDefault();

    const email = formObj.emailRef.current.value;
    const password = formObj.passwordRef.current.value;

    if (email === '' || password === '') {
      setOpen(true);
      setMessage('Please fill in all the required fields.');
      setSeverity('error');
      return
    };

    setLoading(true);
    setDisabled(true);

    try {
      const response = await axios.post('auth/token/', { email, password });
      const { refresh, access } = response.data;
      setCookie('refreshToken', refresh);
      setCookie('accessToken', access);
      const decoded = jwt_decode(access);
      const {username, organization, organization_slug} = decoded;
      setCookie('username', username);
      setCookie('organization', organization);
      setCookie('organization_slug', organization_slug);
      setAuth({ accessToken: access, username, organization, organizationSlug: organization_slug });

      navigate('/');

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
    <Box>
      <Typography
        variant='h4'
        component="h1"
        textAlign={'center'}
        gutterBottom
      >
        You have logged in as&nbsp;
        <span className='highlight-text'>
          {auth.username}
        </span>
      </Typography>
      <Box textAlign={"center"}>
        <Button variant='contained' href='/' sx={{marginRight:'2em'}}>Go back to homepage</Button>
        <Button variant='contained' href='/admin'>Go to dashboard</Button>
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
          Log in
        </Typography>
        <Typography variant="subtitle1" className={styles['divider']} gutterBottom></Typography>
        <form autoComplete='off'>
          <TextField
            label='Email'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='login-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.emailRef}
          />
          <TextField
            required
            label='Password'
            fullWidth
            id="password"
            type="password"
            variant='outlined'
            form='login-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.passwordRef}
          />
          <Box textAlign={"center"}>
            <CustomLoadingButton 
              title='Log in'
              category='action'
              variant='contained'
              isFullWidth={true}
              onClick={loginSubmit}
              disabled={disabled}
              loading={loading}
            />
          </Box>
        </form>
        <Box 
          textAlign='center' 
          display='flex'
          flexDirection='row'
          alignItems='center'
          mt={2}
        >
          <Typography
            variant='subtitle1'
            align='center'
            display='inline'
            paddingX={1}
          >
            Don't have an account?
          </Typography>
          
          <Link className={styles['link']} to='/register'>
            <Typography fontWeight='bold'>Sign up</Typography>
          </Link>
        </Box>
        <Box 
          textAlign='center' 
          display='flex'
          flexDirection='row'
          alignItems='center'
          mb={2}
        >
          <Typography
            variant='subtitle1'
            align='center'
            display='inline'
            paddingX={1}
          >
            Or click <span><a href='/request-activation-email'>here</a></span> to resend your account activation email
          </Typography>
        </Box>
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
