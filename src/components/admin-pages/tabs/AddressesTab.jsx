import { useEffect, useState } from 'react';

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

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import axios from '../../../api/axios';
import CustomLoadingButton from '../../buttons/LoadingButton';
import CustomButton from '../../buttons/Button';

export default function AddressesTab(props) {
  const organization = props.organizationData;
  const axiosPrivate = useAxiosPrivate();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    async function getAddressesData() {
      const response = await axios.get(`organizations/${organization.slug}/addresses`);
      setAddresses(response.data);
      return
    }

    getAddressesData();
  }, [])

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Box>
        <Box>
          <Typography variant='h4' component='h1' color='var(--color4)' fontWeight='800'>
            Addresses
          </Typography>
          <Divider variant='middle' sx={{marginTop: '1em', marginBottom: '1em', marginLeft: '0', marginRight: '0'}}/>
        </Box>
        
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
                        <CustomButton 
                          title='Set as default'
                          category='action'
                          variant='outlined'
                          size='small'
                        />
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
