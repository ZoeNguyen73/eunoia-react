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
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import axios from '../../../api/axios';
import CustomLoadingButton from '../../buttons/LoadingButton';
import CustomButton from '../../buttons/Button';
import PreviewImage from '../../images/PreviewImage';

export default function ListingsTab(props) {
  const organization = props.organizationData;
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [button, setButton] = useState('Add');
  const [formType, setFormType] = useState('');
  const [editListing, setEditListing] = useState(null);
  const [listingStatus, setListingStatus] = useState('active');
  
  const [items, setItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [listings, setListings] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);
  const [expiryDate, setExpiryDate] = useState('');
  const [collectionDate, setCollectionDate] = useState('');

  useEffect(() => {
    async function getData() {
      const itemsResp = await axiosPrivate.get(`organizations/${organization.slug}/items`);
      const listingsResp = await axiosPrivate.get(`organizations/${organization.slug}/listings`);
      const addressesResp = await axios.get(`organizations/${organization.slug}/addresses`);

      const itemsArr = itemsResp.data.map(item => { return {label: item.name}})
      const addressesArr = addressesResp.data.map(a=> { return {label: a.name}})

      setItems(itemsResp.data);
      setItemOptions(itemsArr);
      setListings(listingsResp.data);
      setAddresses(addressesResp.data);
      setAddressOptions(addressesArr);
      return
    }

    getData();

  }, [])

  const timeslotOptions = [
    {label: '12am - 2am'},
    {label: '2am - 4am'},
    {label: '4am - 6am'},
    {label: '6am - 8am'},
    {label: '8am - 10am'},
    {label: '10am - 12pm'},
    {label: '12pm - 2pm'},
    {label: '2pm - 4pm'},
    {label: '4pm - 6pm'},
    {label: '6pm - 8pm'},
    {label: '8pm - 10pm'},
    {label: '10pm - 12am'},
  ]

  const formObj = {
    itemRef: useRef(),
    collectionAddressRef: useRef(),
    amountRef: useRef(),
    expiryDateRef: useRef(),
    timeslotRef: useRef(),
  }

  const handleCancel = () => {
    setFormType('');
    setButton('Add');
    setExpiryDate('')
    setCollectionDate('');
    return
  }

  const handleAddClick = () => {
    setButton('Save');
    setFormType('add');
    return
  }

  const handleStatusChange = (evnt) => {
    setListingStatus(evnt.target.value);
  }

  const handleExpiryDateChange = (newDate) => {
    const date = new Date(newDate.toString()).toLocaleString('en-CA', {timeZone: 'Asia/Singapore'})
    setExpiryDate(date.slice(0,10));
  }

  const handleCollectionDateChange = (newDate) => {
    const date = new Date(newDate.toString()).toLocaleString('en-CA', {timeZone: 'Asia/Singapore'})
    setCollectionDate(date.slice(0,10));
  }

  const handleEditClick = (listingId) => {
    setButton('Save');
    setFormType('edit');
    const listing = listings.filter(a => a.id === listingId)[0];
    setEditListing(listing);
    setExpiryDate(listing.expiry_date);
    return
  }

  const handleDelete = async (listingId) => {
    setLoading(true);
    setDisabled(true);
    try {
      await axiosPrivate.delete(
        `listings/${listingId}`
      )
      setOpen(true);
      setMessage('Listing successfully deleted');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);

      const response = await axiosPrivate.get(`organizations/${organization.slug}/listings`);
      setListings(response.data);

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

  const handleAddSubmit = async (evnt) => {
    evnt.preventDefault();
    const item = formObj.itemRef.current.value;
    const collectionAddress = formObj.collectionAddressRef.current.value;
    const amount = formObj.amountRef.current.value;
    const timeslot = formObj.timeslotRef.current.value;

    if (item === '' || collectionAddress === '' || amount === '' || collectionDate === '' || timeslot === '') {
      setOpen(true);
      setMessage('Please fill in all the required fields.');
      setSeverity('error');
      return
    };

    setLoading(true);
    setDisabled(true);

    const addressID = addresses.filter(a => a.name === collectionAddress)[0].id;
    const itemID = items.filter(i => i.name === item)[0].id;

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      await axiosPrivate.post(
        `listings/`, 
        { 
          item: itemID, 
          collection_address: addressID, 
          status: listingStatus,
          expiry_date: expiryDate,
          collection_date: collectionDate,
          timeslot,
          amount, 
        },
        config,
      );

      setOpen(true);
      setMessage('Listing successfully created');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setFormType('');
      setButton('Add');
      setExpiryDate('');
      setCollectionDate('');

      const response = await axiosPrivate.get(`organizations/${organization.slug}/listings`);
      setListings(response.data);

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

  const handleEditSubmit = async (evnt) => {
    evnt.preventDefault();
    const item = formObj.itemRef.current.value;
    const collectionAddress = formObj.collectionAddressRef.current.value;
    const amount = formObj.amountRef.current.value;

    if (item === '' || collectionAddress === '' || amount === '') {
      setOpen(true);
      setMessage('Please fill in all the required fields.');
      setSeverity('error');
      return
    };

    const addressID = addresses.filter(a => a.name === collectionAddress)[0].id;
    const itemID = items.filter(i => i.name === item)[0].id;

    setLoading(true);
    setDisabled(true);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      await axiosPrivate.patch(
        `listings/${editListing.id}`, 
        { 
          item: itemID, 
          collection_address: addressID, 
          status: listingStatus,
          expiry_date: expiryDate,
          amount, 
        },
        config,
      );

      setOpen(true);
      setMessage('Item successfully edited');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setFormType('');
      setButton('Add');
      setExpiryDate('');
      setCollectionDate('');

      const response = await axiosPrivate.get(`organizations/${organization.slug}/listings`);
      setListings(response.data);

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
          Listings
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
      
      { formType === 'edit' && (
        <form>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Item:
            </Typography>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={itemOptions}
              defaultValue={editListing.item.name}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              sx={{ width: 500 }}
              renderInput={(params) => <TextField 
                {...params} 
                inputRef={formObj.itemRef}
              />}
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Collection Address:
            </Typography>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={addressOptions}
              defaultValue={editListing.collection_address.name}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              sx={{ width: 500 }}
              renderInput={(params) => <TextField 
                {...params} 
                inputRef={formObj.collectionAddressRef}
              />}
            />
          </Box>
          <Box display='flex' flexDirection='row' gap='2em' alignItems='center' marginBottom='1em'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Status
            </Typography>
            <RadioGroup
              row
              aria-labelledby='listing-status-buttons-group'
              name='listing-status-buttons-group'
              value={listingStatus}
              defaultValue={editListing.status}
              onChange={handleStatusChange}
            >
              <FormControlLabel value='active' control={<Radio />} label='Active' />
              <FormControlLabel value='inactive' control={<Radio />} label='Inactive' />
            </RadioGroup>
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Expiry Date:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={expiryDate}
                onChange={(newValue) => handleExpiryDateChange(newValue)}
                renderInput={(params) => <TextField {...params}/>}
                inputFormat='YYYY-MM-DD'
              />
            </LocalizationProvider>
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Amount:
            </Typography>
            <TextField 
              fullWidth
              required 
              multiline 
              maxRows={4} 
              id='outlined-basic' 
              variant='outlined' 
              defaultValue={editListing.amount}
              inputRef={formObj.amountRef}
            />
          </Box>
        </form>
      )}

      { formType === 'add' && (
        <form>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Item:
            </Typography>
            <Autocomplete
              disablePortal
              isOptionEqualToValue={(option, value) => option.value === value.value}
              options={itemOptions}
              sx={{ width: 500 }}
              renderInput={(params) => <TextField 
                {...params} 
                inputRef={formObj.itemRef}
              />}
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Collection Address:
            </Typography>
            <Autocomplete
              disablePortal
              isOptionEqualToValue={(option, value) => option.value === value.value}
              options={addressOptions}
              sx={{ width: 500 }}
              renderInput={(params) => <TextField 
                {...params} 
                inputRef={formObj.collectionAddressRef}
              />}
            />
          </Box>
          <Box display='flex' flexDirection='row' gap='2em' alignItems='center' marginBottom='1em'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Status
            </Typography>
            <RadioGroup
              row
              aria-labelledby='listing-status-buttons-group'
              name='listing-status-buttons-group'
              value={listingStatus}
              onChange={handleStatusChange}
            >
              <FormControlLabel value='active' control={<Radio />} label='Active' />
              <FormControlLabel value='inactive' control={<Radio />} label='Inactive' />
            </RadioGroup>
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Expiry Date:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={expiryDate}
                onChange={(newValue) => handleExpiryDateChange(newValue)}
                renderInput={(params) => <TextField {...params} />}
                inputFormat='YYYY-MM-DD'
              />
            </LocalizationProvider>
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Amount:
            </Typography>
            <TextField 
              fullWidth
              required 
              multiline 
              maxRows={4} 
              id='outlined-basic' 
              variant='outlined' 
              inputRef={formObj.amountRef}
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Collection Date:
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={collectionDate}
                onChange={(newValue) => handleCollectionDateChange(newValue)}
                renderInput={(params) => <TextField {...params} />}
                inputFormat='YYYY-MM-DD'
              />
            </LocalizationProvider>
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Collection Timeslot:
            </Typography>
            <Autocomplete
              disablePortal
              options={timeslotOptions}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              sx={{ width: 500 }}
              renderInput={(params) => <TextField 
                {...params} 
                inputRef={formObj.timeslotRef}
              />}
            />
          </Box>
        </form>
      )}


      { formType === '' && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{backgroundColor:'var(--color2)'}}>
              <TableRow>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>ID</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Item</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Expiry Date</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Collection Address</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Collection Time</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Amount</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Status</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listings.map((listing, idx) => (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{color: 'var(--color2)', fontWeight: '700'}}>
                      {listing.id}
                  </TableCell>
                  <TableCell>
                    {listing.item.name}
                  </TableCell>
                  <TableCell>{listing.expiry_date}</TableCell>
                  <TableCell>{listing.collection_address.name}</TableCell>
                  <TableCell>
                    {listing.collection_date} <br/>
                    {listing.timeslot}
                  </TableCell>
                  <TableCell>{listing.amount}</TableCell>
                  <TableCell>{listing.status}</TableCell>
                  <TableCell>
                    <Box display='flex' flexDirection='column' gap='0.2em'>
                      { listing.status !== 'confirmed' && (
                        <CustomButton 
                          title='Edit'
                          category='action'
                          variant='outlined'
                          size='small'
                          onClick={() => handleEditClick(listing.id)}
                        />
                      )}
                      
                      <CustomLoadingButton 
                        title='Remove'
                        category='action'
                        variant='outlined'
                        size='small'
                        loading={loading}
                        disabled={disabled}
                        onClick={() => handleDelete(listing.id)}
                      />
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
