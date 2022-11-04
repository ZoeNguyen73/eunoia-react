import React from 'react';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AuthContext from '../../context/AuthProvider';

export default function MenuBar(props) {
  const { profile, logout } = props.navigationLinks;
  const pages = [profile, logout];
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { auth } = useContext(AuthContext);

  const handleOpenUserMenu = (evnt) => {
    setAnchorElUser(evnt.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 , marginTop:0.7}}>
        <Avatar alt='user-profile-pic' src={props.profileAvatarUrl} />
      </IconButton>
      <Menu
        sx={{ mt: '45px' }}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {pages.map((page, idx) => (
          <MenuItem
            key={idx}
            onClick={handleCloseUserMenu}
            to={`${page.pageLink}`}
            component={Link}
          >
            <Typography textAlign='center'>{page.pageName}</Typography>
          </MenuItem>
        ))}
        {(auth?.organization === 'null' || !auth?.organization) && (
          <MenuItem
            onClick={handleCloseUserMenu}
            to='organizations/register'
            component={Link}
          >
            <Typography textAlign='center'>Register Organization</Typography>
          </MenuItem>
        )}
        {(auth?.organization && auth?.organization !== 'null') && (
          <MenuItem
            onClick={handleCloseUserMenu}
            to='admin'
            component={Link}
          >
            <Typography textAlign='center'>Dashboard</Typography>
          </MenuItem>
        )}
      </Menu>
    </div>
  )
}
