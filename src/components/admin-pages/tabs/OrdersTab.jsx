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

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import CustomLoadingButton from '../../buttons/LoadingButton';

export default function Orders(props) {
  const organization = props.organizationData;
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [orders, setOrders] = useState([]);
  const [formType, setFormType] = useState('');

  useEffect(() => {
    async function getData() {
      const response = await axiosPrivate.get(`organizations/${organization.slug}/orders`);
      setOrders(response.data);
      return
    }
    getData()
  }, [])

  const handleComplete = async (orderId) => {
    setLoading(true);
    setDisabled(true);
    try {
      await axiosPrivate.patch(
        `orders/${orderId}/status/complete/`,
      )
      setOpen(true);
      setMessage('Order successfully updated');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);

      const response = await axiosPrivate.get(`organizations/${organization.slug}/orders`);
      setOrders(response.data);
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

  const handleCancel = async (orderId) => {
    setLoading(true);
    setDisabled(true);
    try {
      await axiosPrivate.patch(
        `orders/${orderId}/status/cancel/`,
      )
      setOpen(true);
      setMessage('Order successfully updated');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);

      const response = await axiosPrivate.get(`organizations/${organization.slug}/orders`);
      setOrders(response.data);
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

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Typography variant='h4' component='h1' color='var(--color4)' fontWeight='800'>
          Orders
        </Typography>
      </Box>
      
      <Divider variant='middle' sx={{marginTop: '1em', marginBottom: '1em', marginLeft: '0', marginRight: '0'}}/>
      
      
      { formType === '' && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{backgroundColor:'var(--color2)'}}>
              <TableRow>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>ID</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Created Date</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>From</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>To</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Collection address</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Delivery address</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Status</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{color: 'var(--color2)', fontWeight: '700'}}>
                      {order.id}
                  </TableCell>
                  <TableCell>
                    {order.date_created.slice(0,10)}
                  </TableCell>
                  <TableCell>{order.donor_org_name}</TableCell>
                  <TableCell>{order.charity_org_name}</TableCell>
                  <TableCell>{order.collection_address_details}</TableCell>
                  <TableCell>{order.delivery_address_details}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    <Box display='flex' flexDirection='column' gap='0.2em'>
                      { (order.status === 'open' && organization.name === order.charity_org_name) && (
                        <CustomLoadingButton 
                          title='Complete'
                          category='action'
                          variant='outlined'
                          size='small'
                          loading={loading}
                          disabled={disabled}
                          onClick={() => handleComplete(order.id)}
                        />
                      )}
                      { (order.status === 'open') && (
                        <CustomLoadingButton 
                          title='Cancel'
                          category='action'
                          variant='outlined'
                          size='small'
                          loading={loading}
                          disabled={disabled}
                          onClick={() => handleCancel(order.id)}
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
