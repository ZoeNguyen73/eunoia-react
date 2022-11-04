import { useEffect, useState, useRef } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import axios from '../../../api/axios';
import CustomLoadingButton from '../../buttons/LoadingButton';
import CustomButton from '../../buttons/Button';
import CustomAvatar from '../../images/Avatar';

export default function UsersTab(props) {
  const organization = props.organizationData;
  const axiosPrivate = useAxiosPrivate();
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const usernameRef = useRef();

  useEffect(() => {
    async function getAdminsData() {
      const response = await axiosPrivate.get(`organizations/${organization.slug}/admins`);
      setAdmins(response.data);
      return
    }

    async function getUsersData() {
      const response = await axios.get('users');
      const arr = response.data
        .filter(user => user.organization === null)
        .map(user => {return {label: user.username}});
      setUsers(arr);
      return
    }

    getAdminsData();
    getUsersData();
  }, [])

  const handleRemove = async (username) => {
    setLoading(true);
    setDisabled(true);
    try {
      await axiosPrivate.patch(
        `organizations/${organization.slug}/admins/${username}/remove/`
      )
      setOpen(true);
      setMessage('Successfully removed user as admin');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);

      const response = await axiosPrivate.get(`organizations/${organization.slug}/admins`);
      setAdmins(response.data);
      return

    } catch(err) {
      setOpen(true);
      setMessage(err?.response?.data.detail);
      setSeverity('error');
      setLoading(false);
      setDisabled(false);
      return
    }
  }

  const handleAddAdmin = async () => {
    setLoading(true);
    setDisabled(true);
    try {
      const username = usernameRef.current.value;
      await axiosPrivate.patch(
        `organizations/${organization.slug}/admins/${username}/add/`
      )
      setOpen(true);
      setMessage('Successfully added user as admin');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);

      const response = await axiosPrivate.get(`organizations/${organization.slug}/admins`);
      setAdmins(response.data);
      return

    } catch(err) {
      setOpen(true);
      setMessage(err?.response?.data.detail);
      setSeverity('error');
      setLoading(false);
      setDisabled(false);
      return
    }
  }

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Typography variant='h4' component='h1' color='var(--color4)' fontWeight='800'>
          Admins
        </Typography>
      </Box>
      
      <Divider variant='middle' sx={{marginTop: '1em', marginBottom: '1em', marginLeft: '0', marginRight: '0'}}/>
      
      <Box display='flex' flexDirection='row' gap='1em' alignItems='center' marginBottom='1em'>
        <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
          Add new admin:
        </Typography>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={users}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} inputRef={usernameRef}/>}
        />
        <CustomLoadingButton 
          title='Add'
          category='action'
          variant='contained'
          loading={loading}
          disabled={disabled}
          onClick={handleAddAdmin}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{backgroundColor:'var(--color2)'}}>
            <TableRow>
              <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Username</TableCell>
              <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Email</TableCell>
              <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Contact Number</TableCell>
              <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin, idx) => (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{color: 'var(--color2)', fontWeight: '700'}}>
                  <Box display='flex' gap='0.5em' alignItems='center'>
                    <CustomAvatar 
                      imgUrl={admin.profile_image}
                      imgAlt={admin.username}
                    
                    />
                    {admin.username}
                  </Box>
                  
                </TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.contact_number}</TableCell>
                <TableCell>
                  <CustomLoadingButton 
                    title='Remove'
                    category='action'
                    variant='outlined'
                    size='small'
                    loading={loading}
                    disabled={disabled}
                    onClick={() => handleRemove(admin.username)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
