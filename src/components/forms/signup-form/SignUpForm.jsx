import { useRef, useState, useContext} from 'react';
import { Link } from 'react-router-dom';

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
import CustomButton from '../../buttons/Button';
import CustomAvatar from '../../images/Avatar';

export default function SignUpForm() {
  const { auth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState('');

  const formObj = {
    emailRef: useRef(),
    usernameRef: useRef(),
    passwordRef: useRef(),
    contactNumberRef: useRef(),
  }

  const handleFileInput = (evnt) => {
    setFile(evnt.target.files[0]);
    setFileUrl(URL.createObjectURL(evnt.target.files[0]));
  };

  const handleFileRemove = (evnt) => {
    setFile('');
    setFileUrl('');
  };

  const signUpSubmit = async (evnt) => {
    evnt.preventDefault();

    const email = formObj.emailRef.current.value;
    const password = formObj.passwordRef.current.value;
    const username = formObj.usernameRef.current.value;
    const contact_number = formObj.contactNumberRef.current.value;

    if (email === '' || password === '' || username === '' || contact_number === '') {
      setOpen(true);
      setMessage('Please fill in all the required fields.');
      setSeverity('error');
      return
    };

    setLoading(true);
    setDisabled(true);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      await axios.post(
        'users/', 
        { email, password, username, contact_number, profile_image: file, },
        config,
      );
      setOpen(true);
      setMessage('Please check your email inbox for activation code');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      return

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
        <Button variant='contained' href='/'>Go back to homepage</Button>
        <Button>Go to dashboard</Button>
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
          Sign up
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
            inputRef={formObj.emailRef}
          />
          <TextField
            label='Username'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='signup-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.usernameRef}
          />
          <TextField
            required
            color='secondary'
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
          <TextField
            label='Contact number'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='signup-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.contactNumberRef}
          />
          <Box display='flex' flexDirection='row' alignItems='center' gap='2em'>
            <Box display='flex' flexDirection='column'>
              <CustomButton 
                variant='outlined'
                title='Upload profile pic'
                category='action'
                upload={true}
                onChange={handleFileInput}
              />
              {fileUrl && (
                <Typography 
                  variant='subtitle1' 
                  onClick={handleFileRemove}
                  sx={{ '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
                >
                  Remove file
                </Typography>
              )}
            </Box>
            
            { fileUrl && (
              <CustomAvatar
                imgUrl={fileUrl}
                sx={{
                  width: 128,
                  height: 128,
                  marginBottom: 2,
                }}
              />
            )}
          </Box>
          <Box textAlign={'center'} marginTop='1em'>
            <CustomLoadingButton 
              title='Sign Up'
              category='action'
              variant='contained'
              isFullWidth={true}
              onClick={signUpSubmit}
              disabled={disabled}
              loading={loading}
            />
          </Box>
        </form>
        <Box textAlign={"center"} mt={2} mb={2}>
          <Typography
            variant='subtitle1'
            align='center'
            display='inline'
            paddingX={1}
            gutterBottom
          >
            Already have an account?
          </Typography>
          
          <Link className={styles['link']} to='/login'>
            <Typography>Log in</Typography>
          </Link>
          
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
