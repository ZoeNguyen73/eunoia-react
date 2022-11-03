import { useRef, useState, useContext} from 'react';
import { Link } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import AuthContext from '../../../context/AuthProvider';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import styles from '../Form.module.scss';
import CustomLoadingButton from '../../buttons/LoadingButton';
import CustomButton from '../../buttons/Button';
import PreviewImage from '../../images/preview-image/PreviewImage';

export default function OrganizationRegisterForm() {
  const { auth } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState('');
  const [orgType, setOrgType] = useState('Charity');

  const axiosPrivate = useAxiosPrivate();

  const formObj = {
    nameRef: useRef(),
    descriptionRef: useRef(),
    websiteRef: useRef(),
    emailRef: useRef(),
    organizationTypeRef: useRef(),
  }

  const handleFileInput = (evnt) => {
    setFile(evnt.target.files[0]);
    setFileUrl(URL.createObjectURL(evnt.target.files[0]));
  };

  const handleFileRemove = (evnt) => {
    setFile('');
    setFileUrl('');
  };

  const handleTypeChange = (evnt) => {
    setOrgType(evnt.target.value);
  }

  const registrationSubmit = async (evnt) => {
    evnt.preventDefault();
    const name = formObj.nameRef.current.value;
    const description = formObj.descriptionRef.current.value;
    const website = formObj.websiteRef.current.value;
    const email = formObj.emailRef.current.value;
    const organization_type = orgType;

    if (
      email === '' || name === '' || description === '' || website === '' || organization_type === ''
    ) {
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
      await axiosPrivate.post(
        'organizations/', 
        { email, name, description, website, organization_type, logo_image: file, },
        config,
      );
      setOpen(true);
      setMessage('Thank you! We will reach out to you shortly to activate your organization account.');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      return

    } catch(err) {
      const key = Object.keys(err.response.data)[0];
      setOpen(true);
      setMessage(err?.response?.data[key][0]);
      setSeverity('error');
      setLoading(false);
      setDisabled(false);
      return
    }
  }

  if (!auth?.username) { return (
    <Box>
      <Typography
        variant='h6'
        component="h1"
        textAlign={'center'}
        gutterBottom
      >
        Only active user can register a new organization. Please kindly log in to proceed.
      </Typography>
      <CustomButton 
        title='Login'
        category='action'
        route='/login'
        variant='contained'
      />
    </Box>
  )}

  if (auth?.organization !== 'null') { return (
    <Box>
      <Typography
        variant='h6'
        component="h1"
        textAlign={'center'}
        gutterBottom
      >
        You are already an admin of {auth.organization}. Existing admins of an organization cannot register a new organization account.
      </Typography>
      <CustomButton 
        title='Back to Homepage'
        category='action'
        route='/'
        variant='contained'
      />
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
            label='Organization Name'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='org-register-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.nameRef}
          />
          <TextField
            label='Description (max 200 characters)'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='org-register-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.descriptionRef}
          />
          <TextField
            label='Website'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='org-register-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.websiteRef}
          />
          <TextField
            label='Email'
            color='secondary'
            required
            fullWidth
            variant='outlined'
            form='org-register-form'
            sx={{ marginBottom: 2 }}
            className={styles['input-text']}
            inputRef={formObj.emailRef}
          />

          <Box display='flex' flexDirection='row' alignItems='center' gap='2em'>
            <FormLabel 
              id='organization-type-buttons-group'
              sx={{ textAlign: 'left'}}
            >
              Organization Type
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby='organization-type-buttons-group'
              name="organization-type-buttons-group"
              value={orgType}
              onChange={handleTypeChange}
            >
              <FormControlLabel value='Charity' control={<Radio />} label='Charity' />
              <FormControlLabel value='Donor' control={<Radio />} label='Donor' />
            </RadioGroup>
          </Box>

          <Box display='flex' flexDirection='row' alignItems='center' gap='2em'>
            <Box display='flex' flexDirection='column'>
              <CustomButton 
                variant='outlined'
                title='Upload organization logo'
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
              <PreviewImage 
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
              title='Register'
              category='action'
              variant='contained'
              isFullWidth={true}
              onClick={registrationSubmit}
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
