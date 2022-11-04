import { useState, useEffect, useContext } from "react";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import axios from '../../api/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AuthContext from '../../context/AuthProvider';
import CustomButton from "../buttons/Button";
import CustomLoadingButton from "../buttons/LoadingButton";
import styles from './Listings.module.scss';

export default function ListingCard(props) {
  const { listing, orgType, cartListings, handleAddToCart, handleRemoveFromCart } = props;
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [buttonTitle, setButtonTitle] = useState('Added to Cart');

  const handleMouseOver = function () {
    setButtonTitle('Remove');
  };

  const handleMouseLeave = function () {
    setButtonTitle('Added to Cart');
  };

  const handleAddToCartClick = async (listingId) => {
    setLoading(true);
    setDisabled(true);

    try {
      await axiosPrivate.post(`carts/listings/${listingId}`);
      handleAddToCart(listingId);
      setLoading(false);
      setDisabled(false);
      return
    } catch(err) {
      setLoading(false);
      setDisabled(false);
      return
    }
  }
  const handleRemoveFromCartClick = async (listingId) => {
    setLoading(true);
    setDisabled(true);

    try {
      await axiosPrivate.delete(`carts/listings/${listingId}`);
      handleRemoveFromCart(listingId);
      setLoading(false);
      setDisabled(false);
      return
    } catch(err) {
      setLoading(false);
      setDisabled(false);
      return
    }
  }

  return (
    <Card className={styles['listing-card']}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia className={styles['listing-card-image']}
          component="img"
          height={150}
          image={listing.item.image_url}
          alt={listing.item.name}
        />
      </Box>
      
      <CardContent className={styles['listing-card-content']}>
        <Typography
          variant="h5"
          className={styles['listing-card-title']}
        >
          {listing.item.name}
        </Typography>
        <Typography
          variant="body1"
          className={styles['listing-card-brand']}
        >
          {listing.organization.name}
        </Typography>
        <Box className={styles['listing-card-category']}>
          <CustomButton 
            title={listing.item.item_type}
            size='small'
            variant='contained'
            category='badge'
          />
        </Box>
        <Typography variant="body2" className={styles['listing-card-description']}>
          {listing.item.description?.length > 85 ? listing.item.description.slice(0, 83) + '...' : listing.item.description}
        </Typography>
        <Typography variant="caption" className={styles['listing-card-caption']}>
          <span className={styles['title']}>Collection time:</span> {listing.collection_date} {listing.timeslot}
        </Typography>
        <Typography variant="caption" className={styles['listing-card-caption']}>
          <span className={styles['title']}>Location:</span> {listing.collection_address.details}
        </Typography>
        
      </CardContent>
      
      <CardActions className={styles['listing-card-actions']}>
      { !auth.username && (
          <CustomButton
            category={"action"}
            title={'Log in to continue'}
            variant={"outlined"}
            // route={`/projects/${slug}`}
          />
        )}
        { (orgType === 'Charity' && !cartListings.includes(listing.id)) && (
          <CustomLoadingButton
            category='action'
            title={'Add to Cart'}
            variant='contained'
            loading={loading}
            disabled={disabled}
            onClick={() => handleAddToCartClick(listing.id)}
          />
        )}
        { (orgType === 'Charity' && cartListings.includes(listing.id)) && (
          <CustomLoadingButton
            category='action'
            title={buttonTitle}
            variant='outlined'
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseLeave}
            loading={loading}
            disabled={disabled}
            onClick={() => handleRemoveFromCartClick(listing.id)}
          />
        )}
      </CardActions>
      
    </Card>
  )
}
