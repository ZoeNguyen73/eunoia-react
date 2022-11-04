import { useEffect, useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import CustomAvatar from '../../images/Avatar';
import CustomButton from '../../buttons/Button';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import CustomLoadingButton from '../../buttons/LoadingButton';

export default function InfoTab(props) {
  let organization = props.organizationData;
  const [isEditForm, setIsEditForm] = useState(false);
  const [button, setButton] = useState('Edit');
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setFileUrl(organization.logo_url);
  },[props, organization])

  const handleEditClick = (evnt) => {
    setButton('Save');
    setIsEditForm(true);
    return
  }

  const formObj = {
    descriptionRef: useRef(),
    websiteRef: useRef(),
    emailRef: useRef(),
  }

  const handleFileInput = (evnt) => {
    setFile(evnt.target.files[0]);
    setFileUrl(URL.createObjectURL(evnt.target.files[0]));
  };

  const handleFileRemove = (evnt) => {
    setFile('');
    setFileUrl('');
  };

  const handleEditSubmit = async (evnt) => {
    evnt.preventDefault();
    const description = formObj.descriptionRef.current.value;
    const website = formObj.websiteRef.current.value;
    const email = formObj.emailRef.current.value;

    if (email === '' || description === '' || website === '') {
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
      const response = await axiosPrivate.patch(
        `organizations/${organization.slug}/`, 
        { email, description, website, logo_image: file},
        config,
      );
      organization = response.data;
      setOpen(true);
      setMessage('Succesfully saved');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setButton('Edit');
      setIsEditForm(false);
      props.handleOrganizationUpdate();
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

  const handleCancel = () => {
    setIsEditForm(false);
    setButton('Edit');
    return
  }
  
  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Typography variant='h4' component='h1' color='var(--color4)' fontWeight='800'>
          {organization?.name}
        </Typography>
        <Box display='flex' gap='0.5em'>
          { isEditForm && (
            <CustomButton 
              title='Cancel'
              category='action'
              variant='outlined'
              onClick={handleCancel}
            />
          )}
          <CustomLoadingButton
            loading={loading} 
            title={button}
            category='action'
            variant='contained'
            onClick={button === 'Edit' ? handleEditClick : handleEditSubmit}
            disabled={disabled}
          />
        </Box>
      </Box>
      
      <Divider variant='middle' sx={{marginTop: '1em', marginBottom: '1em', marginLeft: '0', marginRight: '0'}}/>

      {isEditForm && (
        <form>
          <Box display='flex' flexDirection='row' gap='2em' alignItems='center' marginBottom='1em'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Logo:
            </Typography>
            { fileUrl && (
              <CustomAvatar 
                imgUrl={fileUrl}
                imgAlt='organization-logo'
                sx={{
                  width: 128,
                  height: 128,
                  marginBottom: 2,
                }}
              />
            )}
            <CustomButton 
              variant='outlined'
              title='Upload a new logo'
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
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Description (max 200 characters):
            </Typography>
            <TextField 
              fullWidth
              required 
              multiline 
              maxRows={4} 
              id='outlined-basic' 
              variant='outlined' 
              defaultValue={organization?.description}
              inputRef={formObj.descriptionRef}
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Website:
            </Typography>
            <TextField 
              fullWidth
              required 
              id='outlined-basic' 
              variant='outlined' 
              defaultValue={organization?.website}
              inputRef={formObj.websiteRef}
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Email:
            </Typography>
            <TextField 
              fullWidth
              required 
              id='outlined-basic' 
              variant='outlined' 
              defaultValue={organization?.email}
              inputRef={formObj.emailRef}
            />
          </Box>
        </form>
      )} 
      
      {!isEditForm && (
        <>
          <Box display='flex' flexDirection='row' gap='2em' alignItems='center' marginBottom='1em'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Logo:
            </Typography>
            <CustomAvatar
              imgUrl={organization?.logo_url}
              imgAlt={organization?.name}
              sx={{ width: 60, height: 60 }}        
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Description:
            </Typography>
            <TextField fullWidth multiline maxRows={4} id='outlined-basic' variant='outlined' disabled value={organization?.description}/>
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Website:
            </Typography>
            <TextField fullWidth id='outlined-basic' variant='outlined' disabled value={organization?.website}/>
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Email:
            </Typography>
            <TextField fullWidth id='outlined-basic' variant='outlined' disabled value={organization?.email}/>
          </Box>
        </>
      )}
        
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
