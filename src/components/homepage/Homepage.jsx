import { useContext } from 'react';
import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import styles from './Homepage.module.scss';
import CustomButton from '../buttons/Button';
import AuthContext from '../../context/AuthProvider';

export default function Homepage() {
  const { auth } = useContext(AuthContext);
  return (
    <>
      <Box sx={{marginBottom: '1em'}}>
        <Typography variant='h2' component='h1' color='var(--color2)' fontWeight='bold'>
          Share & Reduce
        </Typography>
        <Typography variant='h5' component='h2' color='var(--color2)' fontWeight='bold'>
          Direct excess food to those who need them, and help to reduce food waste!
        </Typography>
      </Box>

      {!auth.username && (
        <Link to='/register'>
          <CustomButton 
            title='Sign Up to get started'
            variant='contained'
            category='action'
          />
        </Link>
      )}

      {(auth.username && (auth.organization === 'null' || !auth.organization)) && (
        <Link to='/organizations/register'>
          <CustomButton 
            title='Register your organization today'
            variant='contained'
            category='action'
          />
        </Link>
      )}
      
      <div>
        <img 
          className={styles['main-banner']}
          src='https://ik.imagekit.io/ipy2x824p/blog-35-6-surprising-food-waste-facts_npyWRccRE.jpg'
          alt='homepage banner'
        />
      </div>
    </>
    
  )
}
