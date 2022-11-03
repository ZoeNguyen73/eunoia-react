import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { useTheme } from '@mui/material';
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import useMediaQuery from "@mui/material/useMediaQuery";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import SearchBar from './SearchBar'
import DrawerComponent from './DrawerComponent';
import './SiteHeader.scss'

export default function SiteHeader() {
  const { auth } = useContext(AuthContext);
  const isAuth = !!auth?.username
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function getProfileData() {
      if (auth?.username) {
        try {
          const response = await axios.get(`/users/${auth?.username}`)
          setProfile(response.data)
        } catch (err) {
          console.log(`err getting profile data: ${err}`)
        }
      }
    }

    getProfileData()
    
  }, [])

  const navigationLinks = {
    listings: { pageName: 'Listings', pageLink: '/listings'},
    charities: { pageName: 'Charities', pageLink: '/charities' },
    donors: { pageName: 'Donors', pageLink: '/donors' },
    about: { pageName: 'About', pageLink: '/about' },
    login: { pageName: 'Login', pageLink: '/login' },
    register: { pageName: 'Register', pageLink: '/register' },
    logout: { pageName: 'Logout', pageLink: '/logout' },
    createNewOrganization: { pageName: 'Create New Organization', pageLink: '/organizations/create' },
  }

  const { listings, charities, donors, about, login, register } = navigationLinks

  const navigationTabs = isAuth
    ? [ listings, charities, donors, about ]
    : [ listings, charities, donors, about, login, register ];
  
  const theme = useTheme();
  const isBreakPoint = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position='relative' className='site-header'>
      <Toolbar sx={{ backgroundColor: 'var(--color3a)' }}>
        {isBreakPoint ? (
          <Grid container sx={{ placeItems: 'center' }}>
            <Link to='/'>
              <Typography variant='h5' sx={{color: 'var(--color2)', fontWeight: '900',}}>
                Eunoia
              </Typography>
            </Link>
            <Box
              sx={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <SearchBar />
              <DrawerComponent isAuth={isAuth} navigationLinks={navigationLinks} />
            </Box>
          </Grid>
        ) : (
          <Grid container sx={{ placeItems: 'center' }}>
            <Link to='/'>
              <Typography variant='h5' sx={{color: 'var(--color2)', fontWeight: '900',}}>
                Eunoia
              </Typography>
            </Link>
            <Box
              sx={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SearchBar />
              <List sx={{display: 'flex', marginLeft: 'auto'}}>
                {navigationTabs.map((nav, index) => (
                  <ListItemButton 
                    key={index} 
                    to={`${nav.pageLink}`}
                    component={Link}
                    sx={{ 
                      borderBottom: '0', 
                      backgroundColor: nav.pageName === 'Login' ? 'var(--color2)' : '',
                      borderRadius: nav.pageName === 'Login' ? '0.5em' : '',
                      '&:hover': { backgroundColor: nav.pageName === 'Login' ? 'var(--color2)' : 'var(--color3a)', }
                    }}
                    divider
                  >
                    <ListItemIcon>
                      <ListItemText
                        sx={{
                          color: nav.pageName === 'Login' ? 'var(--color1)' : 'var(--color2)',
                          '&:hover': { textDecoration: 'underline'}
                        }}
                      >
                        <Typography>{nav.pageName}</Typography>
                      </ListItemText>
                    </ListItemIcon>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  )
}
