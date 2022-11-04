import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import CustomAvatar from '../../images/Avatar';
import CustomButton from '../../buttons/Button';

export default function InfoTab(props) {
  const organization = props.organizationData;
  useEffect(() => {
  },[props])

  return (
    <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
      <Box display='flex' flexDirection='row' justifyContent='space-between'>
        <Typography variant='h4' component='h1' color='var(--color4)' fontWeight='800'>
          {organization?.name}
        </Typography>
        <CustomButton 
          title='Edit'
          category='action'
          variant='contained'
          route={`organizations/${organization.slug}/edit`}
        />
      </Box>
      
      <Divider variant='middle' sx={{marginTop: '1em', marginBottom: '1em', marginLeft: '0', marginRight: '0'}}/>
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
          Website: {organization?.website}
        </Typography>
        <TextField fullWidth id='outlined-basic' variant='outlined' disabled value={organization?.website}/>
      </Box>
      <Box marginBottom='1em' textAlign='left'>
        <Typography variant='body1' component='h2' color='var(--color2)' fontWeight='800'>
          Email:
        </Typography>
        <TextField fullWidth id='outlined-basic' variant='outlined' disabled value={organization?.email}/>
      </Box>
    </Box>
  )
}
