import { useEffect, useState, useContext, useRef } from 'react';

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import axios from '../../api/axios';
import AuthContext from '../../context/AuthProvider';
import CartContext from '../../context/CartProvider';
import CustomButton from "../buttons/Button";
import CustomLoadingButton from "../buttons/LoadingButton";
import PreviewImage from '../images/PreviewImage';

export default function Cart() {
  const { auth } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const axiosPrivate = useAxiosPrivate();
  const [orgType, setOrgType] = useState(false);
  const [cartListings, setCartListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [listingGroups, setListingGroups] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);
  const addressRef = useRef();

  useEffect(() => {
    async function getData() {
      const orgResponse = await axios.get(`organizations/${auth.organizationSlug}/`);
      const cartListingsResp = await axiosPrivate.get(`carts/listings/`);
      const addressResp = await axios.get(`organizations/${auth.organizationSlug}/addresses`);
    
      const data = cartListingsResp.data;
      const donorsId = [...new Set(data.map(a => a.listing.organization.id))];
      const collectionAddressesId = [...new Set(data.map(a => a.listing.collection_address.id))];
      const collectionDates = [...new Set(data.map(a => a.listing.collection_date))];
      const timeslots = [...new Set(data.map(a => a.listing.timeslot))];

      const tempListingGroups = [];

      for (let i = 0, j = donorsId.length; i < j; i++) {
        const donorId = donorsId[i];
        for (let a = 0, b = collectionAddressesId.length; a < b; a++) {
          const addressId = collectionAddressesId[a];
          for (let c = 0, d = collectionDates.length; c < d; c++) {
            const date = collectionDates[c];
            for (let e = 0, f = timeslots.length; e < f; e++) {
              const timeslot = timeslots[e];
              const listings = data.filter(a => {
                return (
                  a.listing.organization.id === donorId &&
                  a.listing.collection_address.id === addressId &&
                  a.listing.collection_date === date &&
                  a.listing.timeslot === timeslot
                )
              });
              if (listings.length > 0) {
                tempListingGroups.push(listings);
              }
            }
          }
        }
      }
      setOrgType(orgResponse.data.organization_type);
      setCartListings(cartListingsResp.data);
      setListingGroups(tempListingGroups);
      setAddresses(addressResp.data);
      setAddressOptions(addressResp.data.map(a => {return {label: a.name}}));
      return
    }
    getData();
  }, [])

  useEffect(() => {
    const tempListingGroups = [];
    const donorsId = [...new Set(cartListings.map(a => a.listing.organization.id))];
    const collectionAddressesId = [...new Set(cartListings.map(a => a.listing.collection_address.id))];
    const collectionDates = [...new Set(cartListings.map(a => a.listing.collection_date))];
    const timeslots = [...new Set(cartListings.map(a => a.listing.timeslot))];
    for (let i = 0, j = donorsId.length; i < j; i++) {
      const donorId = donorsId[i];
      for (let a = 0, b = collectionAddressesId.length; a < b; a++) {
        const addressId = collectionAddressesId[a];
        for (let c = 0, d = collectionDates.length; c < d; c++) {
          const date = collectionDates[c];
          for (let e = 0, f = timeslots.length; e < f; e++) {
            const timeslot = timeslots[e];
            const listings = cartListings.filter(a => {
              return (
                a.listing.organization.id === donorId &&
                a.listing.collection_address.id === addressId &&
                a.listing.collection_date === date &&
                a.listing.timeslot === timeslot
              )
            });
            if (listings.length > 0) {
              tempListingGroups.push(listings);
            }
          }
        }
      }
    }
    setListingGroups(tempListingGroups);
    return
  }, [cartListings])

  const handleRemoveFromCart = async (listingId) => {
    setLoading(true);
    setDisabled(true);
    try {
      await axiosPrivate.delete(`carts/listings/${listingId}`);
      setCartListings(prev => {return prev.filter(a => a.listing.id !== listingId)});
      setCart(prev => prev-1);
      setOpen(true);
      setMessage('Item successfully removed');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);

      return;
    } catch(err) {
      setOpen(true);
      setMessage(err?.response?.data?.detail);
      setSeverity('error');
      setLoading(false);
      setDisabled(false);
    }
  }

  const handleConfirmOrders = async () => {
    const delivery_address = addresses.filter(a => a.name === addressRef.current.value)[0];
    const donor_org = listingGroups[0][0].listing.organization;
    const collection_address = listingGroups[0][0].listing.collection_address;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    setLoading(true);
    setDisabled(true);
    try {
      const newOrder = await axiosPrivate.post(
        `organizations/${auth.organizationSlug}/orders/`,
        {
          donor_org_name: donor_org.name,
          donor_org_id: donor_org.id,
          collection_date: listingGroups[0][0].listing.collection_date,
          collection_timeslot: listingGroups[0][0].listing.timeslot,
          need_delivery: false,
          collection_address_contact_number: collection_address.contact_number,
          collection_address_details: collection_address.details,
          collection_address_postal_code: collection_address.postal_code,
          collection_address_contact_name: collection_address.contact_name,
          delivery_address_contact_number: delivery_address.contact_number,
          delivery_address_details: delivery_address.details,
          delivery_address_postal_code: delivery_address.postal_code,
          delivery_address_contact_name: delivery_address.contact_name,
        },
        config,
      )
      const orderID = await newOrder.id;
      // for await (const cartListing of cartListings) {
      //   await axiosPrivate.post(
      //     `/orders/${orderID}/listings/`,
      //     {listing_id: cartListing.listing.id},
      //     config
      //   )
      // }
      setOpen(true);
      setMessage('Orders successfully created');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setCartListings([]);
    } catch(err) {
      setOpen(true);
      setMessage(err?.response?.data?.detail);
      setSeverity('error');
      setLoading(false);
      setDisabled(false);
      return
    }
    
  }

  if (orgType !== 'Charity') {
    return (
      <Box>
        <Typography
          variant='h6'
          component="h1"
          textAlign={'center'}
          gutterBottom
        >
          Only Charity organizations can checkout listings.
        </Typography>
        <CustomButton 
          title='Back to homepage'
          category='action'
          route='/'
          variant='contained'
        />
    </Box>
    )
  }

  const tables = [];

  for (let i = 0, j = listingGroups.length; i < j; i++) {
    const group = listingGroups[i];
    tables.push(
      <>
        <Box display='flex' gap='0.5em' alignItems='center' sx={{marginTop:'2em', marginBottom:'1em'}}>
          <Typography variant='h6'>
            Order #{i+1}
          </Typography><br/>
          <Box display='flex' alignItems='center' gap='0.2em'>
            <Typography fontWeight='bold' variant='body2'>Collection address:</Typography> 
            <Typography variant='body2'>{group[0].listing.collection_address.details}</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='0.2em'>
            <Typography fontWeight='bold' variant='body2'>Collection time:</Typography> 
            <Typography variant='body2'>{group[0].listing.collection_date} {group[0].listing.timeslot}</Typography>
          </Box>
        </Box>
        <TableContainer component={Paper} sx={{width: '100%', }}>
          <TableRow  aria-label="simple table" sx={{width: '100%', display:'inline-table'}}>
            <TableHead sx={{backgroundColor:'var(--color2)'}}>
              <TableRow>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Name</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Description</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Amount</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.map((cartListing, idx) => (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{color: 'var(--color2)', fontWeight: '700', width: '40%'}}>
                    <Box display='flex' gap='0.5em' alignItems='center'>
                      <PreviewImage
                        imgUrl={cartListing.listing.item.image_url}
                        imgAlt={cartListing.listing.item.name}
                        sx={{width: 60, height: 60}}
                      />
                      {cartListing.listing.item.name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{width: '25%'}}>{cartListing.listing.item.description}</TableCell>
                  <TableCell sx={{width: '15%'}}>{cartListing.listing.amount}</TableCell>
                  <TableCell>
                    <CustomLoadingButton 
                      title='Remove'
                      category='action'
                      variant='outlined'
                      size='small'
                      loading={loading}
                      disabled={disabled}
                      onClick={() => handleRemoveFromCart(cartListing.listing.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRow>
        </TableContainer>
      </>
    )
  }

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant='h3' component='h1'>Cart</Typography>
      <Divider variant='middle' sx={{marginTop: '1em', marginBottom: '1em', marginLeft: '0', marginRight: '0'}}/>
      <Box display='flex' flexDirection='row' gap='1em' alignItems='center' marginBottom='1em'>
        <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
          Select delivery address
        </Typography>
        <Autocomplete
          disablePortal
          isOptionEqualToValue={(option, value) => option.value === value.value}
          options={addressOptions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} inputRef={addressRef}/>}
        />
        <CustomLoadingButton 
          title='Confirm Orders'
          category='action'
          variant='contained'
          loading={loading}
          disabled={disabled}
          onClick={handleConfirmOrders}
        />
      </Box>
      {tables}
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
