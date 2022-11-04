import { useState, useContext, useEffect } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';

import AuthContext from '../../../context/AuthProvider';
import CustomAvatar from '../../images/Avatar';
import axios from '../../../api/axios';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import styles from './Sidebar.module.scss';

const sidebarWidth = 240;

export default function Sidebar(props) {
  const { auth } = useContext(AuthContext);
  const [organization, setOrganization] = useState(null);
  const [actions, setActions] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const handleTabChange = props.handleTabChange;

  const actionListsDonor = [
    { text: 'Info', icon: <InfoIcon color='primary'/>, tabValue: '1',},
    { text: 'Addresses', icon: <HomeIcon color='primary'/>, tabValue: '2',},
    { text: 'Users', icon: <GroupIcon color='primary'/>, tabValue: '3',},
    { text: 'Items', icon: <CategoryIcon color='primary'/>, tabValue: '5',},
    { text: 'Listings', icon: <LoyaltyIcon color='primary'/>, tabValue: '6',},
    { text: 'Orders', icon: <LocalShippingIcon color='primary'/>, tabValue: '4',},
  ]

  const actionListsCharity = [
    { text: 'Info', icon: <InfoIcon color='primary'/>, tabValue: '1',},
    { text: 'Addresses', icon: <HomeIcon color='primary'/>, tabValue: '2',},
    { text: 'Users', icon: <GroupIcon color='primary'/>, tabValue: '3',},
    { text: 'Orders', icon: <LocalShippingIcon color='primary'/>, tabValue: '4',},
  ]

  useEffect(() => {
    async function getOrgData() {
      
      try {
        if (auth?.organization && auth?.organization !== 'null') {
          const response = await axios.get(`organizations/${auth?.organizationSlug}/`);
          if (response.data.organization_type === 'Donor') {
            setActions(actionListsDonor);
          };
          if (response.data.organization_type === 'Charity') {
            setActions(actionListsCharity);
          };
          setOrganization(response.data);
        };
      } catch (err) {
        console.log(`err getting org data: ${err}`);
      };
    }

    getOrgData();
  },[]);

  if (!auth?.organization || auth?.organization === 'null') {
    return (
      <Typography>No org found</Typography>
    )
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box' },
        }}
        className={styles['sidebar']}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Box display='flex' flexDirection='row' alignItems='center' >
          <CustomAvatar 
            imgUrl={organization?.logo_url}
            imgAlt={organization?.name}
            sx={{
              width: 40,
              height: 40,
              margin: 2,
            }}
          />
          <Typography variant='h6' component='h1' sx={{fontWeight: 'bold', color: 'var(--color4)'}}>
            {organization?.name}
            </Typography>
          </Box>
          
          <List>
            {actions.map((action, idx) => (
              <ListItem key={idx} disablePadding onClick={() => handleTabChange(action.tabValue)}>
                <ListItemButton>
                  <ListItemIcon>
                    {action.icon}
                  </ListItemIcon>
                  <ListItemText color='primary' primary={action.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
    </Box>
  )
}
