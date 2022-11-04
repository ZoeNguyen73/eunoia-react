import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import axios from '../../../api/axios';
import CustomLoadingButton from '../../buttons/LoadingButton';
import CustomButton from '../../buttons/Button';

export default function AddressesTab(props) {
  const organization = props.organizationData;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [button, setButton] = useState('Add');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [formType, setFormType] = useState('');
  const [editAddress, setEditAddress] = useState(null);

  useEffect(() => {
    async function getAddressesData() {
      const response = await axios.get(`organizations/${organization.slug}/addresses`);
      setAddresses(response.data);
      return
    }

    getAddressesData();
  }, [])

  const handleAddClick = () => {
    setButton('Save');
    setFormType('add');
    return
  }

  const handleEditClick = (addressId) => {
    setButton('Save');
    setFormType('edit');
    const address = addresses.filter(a => a.id === addressId)[0];
    setEditAddress(address);
    return
  }

  const formObj = {
    nameRef: useRef(),
    contactNameRef: useRef(),
    contactNumberRef: useRef(),
    detailsRef: useRef(),
    postalCodeRef: useRef(),
  }

  const handleAddSubmit = async (evnt) => {
    evnt.preventDefault();
    const name = formObj.nameRef.current.value;
    const contactNumber = formObj.contactNumberRef.current.value;
    const details = formObj.detailsRef.current.value;
    const contactName = formObj.contactNameRef.current.value;
    const postalCode = formObj.postalCodeRef.current.value;

    if (
      name === '' || contactName === '' || contactNumber === '' || details === '' || postalCode === ''
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
        `organizations/${organization.slug}/addresses/`,
        {name, contact_name: contactName, contact_number: contactNumber, details, postal_code: postalCode},
        config
      )
      setOpen(true);
      setMessage('Successfully created new address');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setFormType('');
      setButton('Add');

      const response = await axios.get(`organizations/${organization.slug}/addresses`);
      setAddresses(response.data);
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

  const handleEditSubmit = async (evnt) => {
    evnt.preventDefault();
    const name = formObj.nameRef.current.value;
    const contactNumber = formObj.contactNumberRef.current.value;
    const details = formObj.detailsRef.current.value;
    const contactName = formObj.contactNameRef.current.value;
    const postalCode = formObj.postalCodeRef.current.value;

    if (
      name === '' || contactName === '' || contactNumber === '' || details === '' || postalCode === ''
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
      await axiosPrivate.patch(
        `organizations/${organization.slug}/addresses/${editAddress.id}`,
        {name, contact_name: contactName, contact_number: contactNumber, details, postal_code: postalCode},
        config
      )
      setOpen(true);
      setMessage('Successfully edited address');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setFormType('');
      setButton('Add');

      const response = await axios.get(`organizations/${organization.slug}/addresses`);
      setAddresses(response.data);
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

  const handleSetDefault = async (addressId) => {
    setLoading(true);
    setDisabled(true);
    try {
      await axiosPrivate.patch(
        `organizations/${organization.slug}/addresses/${addressId}/default/`
      )
      async function getAddressesData() {
        const response = await axios.get(`organizations/${organization.slug}/addresses`);
        setAddresses(response.data);
        return
      }
  
      getAddressesData();
      setSeverity('success');
      setOpen(true);
      setMessage('Successfully changed default address');
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

  const handleCancel = () => {
    setFormType('');
    setButton('Add');
    return
  }

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Box>
        <Box>
          <Box display='flex' flexDirection='row' justifyContent='space-between'>
            <Typography variant='h4' component='h1' color='var(--color4)' fontWeight='800'>
              Addresses
            </Typography>
            <Box display='flex' gap='0.5em'>
              { formType !== '' && (
                <CustomButton 
                  title='Cancel'
                  category='action'
                  variant='outlined'
                  onClick={handleCancel}
                />
              )}
              <CustomLoadingButton
                loading={loading}
                disabled={disabled}
                title={button}
                category='action'
                variant='contained'
                onClick={button === 'Add' ? handleAddClick : 
                  (formType === 'add' ? handleAddSubmit : handleEditSubmit)
                }
              />
            </Box>
            
          </Box>
          <Divider variant='middle' sx={{marginTop: '1em', marginBottom: '1em', marginLeft: '0', marginRight: '0'}}/>
        </Box>

        { formType === 'add' && (
          <form>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Name:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                placeholder='eg. Main Outlet at Orchard' 
                inputRef={formObj.nameRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Contact Name:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                inputRef={formObj.contactNameRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Contact Number:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                placeholder='88889999'
                inputRef={formObj.contactNumberRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Details:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                placeholder='eg. 123 Main Street #02-222' 
                inputRef={formObj.detailsRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Postal Code:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                placeholder='eg. 123456' 
                inputRef={formObj.postalCodeRef}
              />
            </Box>
          </form>
        )}

        { formType === 'edit' && (
          <form>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Name:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                defaultValue={editAddress.name}
                inputRef={formObj.nameRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Contact Name:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                defaultValue={editAddress.contact_name}
                inputRef={formObj.contactNameRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Contact Number:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                defaultValue={editAddress.contact_number}
                inputRef={formObj.contactNumberRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Details:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                defaultValue={editAddress.details}
                inputRef={formObj.detailsRef}
              />
            </Box>
            <Box marginBottom='1em' textAlign='left'>
              <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
                Postal Code:
              </Typography>
              <TextField 
                fullWidth
                required 
                id='outlined-basic' 
                variant='outlined'
                defaultValue={editAddress.postal_code}
                inputRef={formObj.postalCodeRef}
              />
            </Box>
          </form>
        )}
        
        { formType === '' && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{backgroundColor:'var(--color2)'}}>
                <TableRow>
                  <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Name</TableCell>
                  <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Contact Name</TableCell>
                  <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Contact Number</TableCell>
                  <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Details</TableCell>
                  <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Postal Code</TableCell>
                  <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.map((address, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{color: 'var(--color2)', fontWeight: '700'}}>
                      {address.name}
                    </TableCell>
                    <TableCell>{address.contact_name}</TableCell>
                    <TableCell>{address.contact_number}</TableCell>
                    <TableCell>{address.details}</TableCell>
                    <TableCell>{address.postal_code}</TableCell>
                    <TableCell>
                      <Box display='flex' flexDirection='column' gap='0.2em'>
                        <CustomButton 
                          title='Edit'
                          category='action'
                          variant='outlined'
                          size='small'
                          onClick={() => handleEditClick(address.id)}
                        />
                        {address.is_default && (
                          <CustomButton 
                            title='Default'
                            category='action'
                            variant='outlined'
                            size='small'
                            disabled
                          />
                        )}
                        {!address.is_default && (
                          <CustomLoadingButton 
                            title='Set as default'
                            category='action'
                            variant='outlined'
                            size='small'
                            onClick={() => handleSetDefault(address.id)}
                            loading={loading}
                            disabled={disabled}
                          />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
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
