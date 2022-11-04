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
import CustomLoadingButton from '../../buttons/LoadingButton';
import CustomButton from '../../buttons/Button';
import PreviewImage from '../../images/PreviewImage'

export default function ItemsTab(props) {
  const organization = props.organizationData;
  const axiosPrivate = useAxiosPrivate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [button, setButton] = useState('Add');
  const [formType, setFormType] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState('');

  const itemTypeOptions = [
    {label: 'Cooked vegetables'},
    {label: 'Cooked meat'},
    {label: 'Canned food'},
    {label: 'Cooked fish'},
    {label: 'Refridgerated food'},
    {label: 'Diary'},
    {label: 'Vegetables'},
    {label: 'Meat'},
    {label: 'Fish and Seafoods'},
    {label: 'Eggs'},
    {label: 'Condiments'},
    {label: 'Snacks'},
    {label: 'Oil'},
    {label: 'Jams and Spreads'},
    {label: 'Fruits'},
    {label: 'Baked goods'},
    {label: 'Beverages'},
    {label: 'Rice'},
    {label: 'Noodles'},
    {label: 'Seasonings'},
    {label: 'Pastes and Sauces'},
    {label: 'Cutlery'},
    {label: 'Dried food'},
    {label: 'Vitamins and Supplements'},
    {label: 'Miscellaneous'},
  ]

  useEffect(() => {
    async function getItemsData() {
      const response = await axiosPrivate.get(`organizations/${organization.slug}/items`);
      setItems(response.data);
      return
    }

    getItemsData();

  }, [])

  const formObj = {
    nameRef: useRef(),
    descriptionRef: useRef(),
    itemTypeRef: useRef(),
  }

  const handleFileInput = (evnt) => {
    setFile(evnt.target.files[0]);
    setFileUrl(URL.createObjectURL(evnt.target.files[0]));
  };

  const handleFileRemove = (evnt) => {
    setFile('');
    setFileUrl('');
  };

  const handleCancel = () => {
    setFormType('');
    setButton('Add');
    return
  }

  const handleAddClick = () => {
    setButton('Save');
    setFormType('add');
    return
  }

  const handleAddSubmit = async (evnt) => {
    evnt.preventDefault();
    const name = formObj.nameRef.current.value;
    const description = formObj.descriptionRef.current.value;
    const itemType = formObj.itemTypeRef.current.value;

    if (name === '' || description === '' || itemType === '') {
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
        `organizations/${organization.slug}/items/`, 
        { name, description, item_type: itemType, image: file, },
        config,
      );

      setOpen(true);
      setMessage('Item successfully created');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setFormType('');
      setButton('Add');
      setFile('');
      setFileUrl('');

      const response = await axiosPrivate.get(`organizations/${organization.slug}/items`);
      setItems(response.data);

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
    const name = formObj.nameRef.current.value;
    const description = formObj.descriptionRef.current.value;
    const itemType = formObj.itemTypeRef.current.value;

    if (name === '' || description === '' || itemType === '') {
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
        `organizations/${organization.slug}/items/${editItem.id}`, 
        { name, description, item_type: itemType, image: file, },
        config,
      );

      setOpen(true);
      setMessage('Item successfully edited');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);
      setFormType('');
      setButton('Add');
      setFile('');
      setFileUrl('');

      const response = await axiosPrivate.get(`organizations/${organization.slug}/items`);
      setItems(response.data);

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

  const handleDelete = async (itemId) => {
    setLoading(true);
    setDisabled(true);
    try {
      await axiosPrivate.delete(
        `organizations/${organization.slug}/items/${itemId}`
      )
      setOpen(true);
      setMessage('Item successfully deleted');
      setSeverity('success');
      setLoading(false);
      setDisabled(false);

      const response = await axiosPrivate.get(`organizations/${organization.slug}/items`);
      setItems(response.data);

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

  const handleEditClick = (itemId) => {
    setButton('Save');
    setFormType('edit');
    const item = items.filter(a => a.id === itemId)[0];
    setEditItem(item);
    setFileUrl(item.image_url)
    return
  }

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Typography variant='h4' component='h1' color='var(--color4)' fontWeight='800'>
          Items
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
          <Box display='flex' flexDirection='row' gap='2em' alignItems='center' marginBottom='1em'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Image:
            </Typography>
            { fileUrl && (
              <PreviewImage 
                imgUrl={fileUrl}
                imgAlt='item-image'
                sx={{
                  width: 128,
                  height: 128,
                  marginBottom: 2,
                }}
              />
            )}
            <CustomButton 
              variant='outlined'
              title='Upload an image'
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
              Name:
            </Typography>
            <TextField 
              fullWidth
              required 
              id='outlined-basic' 
              variant='outlined' 
              defaultValue={editItem.name}
              inputRef={formObj.nameRef}
            />
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
              defaultValue={editItem.description}
              inputRef={formObj.descriptionRef}
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Item Type:
            </Typography>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={itemTypeOptions}
              defaultValue={editItem.item_type}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField 
                {...params} 
                inputRef={formObj.itemTypeRef}
              />}
            />
          </Box>
        </form>
      )}

      { formType === 'add' && (
        <form>
          <Box display='flex' flexDirection='row' gap='2em' alignItems='center' marginBottom='1em'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Image:
            </Typography>
            { fileUrl && (
              <PreviewImage 
                imgUrl={fileUrl}
                imgAlt='item-image'
                sx={{
                  width: 128,
                  height: 128,
                  marginBottom: 2,
                }}
              />
            )}
            <CustomButton 
              variant='outlined'
              title='Upload an image'
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
              Name:
            </Typography>
            <TextField 
              fullWidth
              required 
              id='outlined-basic' 
              variant='outlined' 
              placeholder='eg. Wholemeal bread'
              inputRef={formObj.nameRef}
            />
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
              placeholder='eg. Produced in Singapore, Halal.'
              inputRef={formObj.descriptionRef}
            />
          </Box>
          <Box marginBottom='1em' textAlign='left'>
            <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
              Item Type:
            </Typography>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={itemTypeOptions}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} inputRef={formObj.itemTypeRef}/>}
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
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Image</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Description</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Type</TableCell>
                <TableCell sx={{color: 'var(--color6)', fontWeight: '700'}}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{color: 'var(--color2)', fontWeight: '700'}}>
                    <Box display='flex' gap='0.5em' alignItems='center'>
                      
                      {item.name}
                    </Box>
                    
                  </TableCell>
                  <TableCell>
                    <PreviewImage
                      imgUrl={item.image_url}
                      imgAlt={item.name}
                      sx={{width: 60, height: 60}}
                    />
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.item_type}</TableCell>
                  <TableCell>
                    <Box display='flex' flexDirection='column' gap='0.2em'>
                      <CustomButton 
                        title='Edit'
                        category='action'
                        variant='outlined'
                        size='small'
                        onClick={() => handleEditClick(item.id)}
                      />
                      <CustomLoadingButton 
                        title='Remove'
                        category='action'
                        variant='outlined'
                        size='small'
                        loading={loading}
                        disabled={disabled}
                        onClick={() => handleDelete(item.id)}
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
