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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import SearchBar from './SearchBar'
import DrawerComponent from './DrawerComponent';
import MenuBar from './MenuBar';
import styles from './SiteHeader.module.scss';
import CartContext from '../../context/CartProvider';

export default function SiteHeader() {
  const { auth } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const isAuth = !!auth?.username
  const [profile, setProfile] = useState(null);
  const [orgType, setOrgType] = useState('');

  useEffect(() => {
    async function getProfileData() {
      if (auth?.username) {
        try {
          const response = await axios.get(`/users/${auth?.username}`);
          const orgResp = await axios.get(`organizations/${auth.organizationSlug}/`)
          setProfile(response.data);
          setOrgType(orgResp.data.organization_type);
        } catch (err) {
          console.log(`err getting profile data: ${err}`);
        }
      }
    }

    getProfileData()
    
  }, [auth])

  const navigationLinks = {
    listings: { pageName: 'Listings', pageLink: '/listings'},
    // charities: { pageName: 'Charities', pageLink: '/charities' },
    // donors: { pageName: 'Donors', pageLink: '/donors' },
    login: { pageName: 'Login', pageLink: '/login' },
    register: { pageName: 'Register', pageLink: '/register' },
    profile: { pageName: 'Profile', pageLink: `/users/${auth?.username}` },
    logout: { pageName: 'Log Out', pageLink: '/logout' },
  }

  const { listings, login, register } = navigationLinks

  const navigationTabs = isAuth
    ? [ listings, ]
    : [ listings, login, register ];
  
  const theme = useTheme();
  const isBreakPoint = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position='relative' className={styles['site-header']}>
      <Toolbar>
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
              {/* <SearchBar /> */}
              <DrawerComponent isAuth={isAuth} navigationLinks={navigationLinks} />
            </Box>
          </Grid>
        ) : (
          <>
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
                {/* <SearchBar /> */}
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
                          }}
                        >
                          <Typography className={styles['nav-name']}>{nav.pageName}</Typography>
                        </ListItemText>
                      </ListItemIcon>
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Grid>

            {(isAuth && orgType === 'Charity') && (
              <Box marginRight='2em'>
                <Badge badgeContent={cart} color='secondary'>
                  <Link to='/cart'>
                    <ShoppingCartIcon color='action' />
                  </Link>
                </Badge>
              </Box>
            )}

            {isAuth && (
              <Box
                sx={{
                  flexGrow: 1,
                  marginLeft: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <MenuBar
                  navigationLinks={navigationLinks}
                  profileAvatarUrl={profile?.profile_image}
                />
              </Box>
            )}
          </>
          
        )}
      </Toolbar>
    </AppBar>
  )
}
