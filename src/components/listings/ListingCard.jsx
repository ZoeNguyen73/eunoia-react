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

export default function ListingCard(props) {
  const { listing } = props;

  return (
    <Card raised={true}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height={150}
          image={listing.item.image_url}
          alt={listing.item.name}
        />
      </Box>
      
      <CardContent>
        <Box display={"flex"} alignItems={"center"} marginY={2}>
          <Typography
            className="card-title"
            variant="h6"
            sx={{ marginLeft: 1 }}
          >
            {listing.item.name}
          </Typography>
        </Box>
        <Typography variant="body2" className="card-tagline" sx={{height: '3em'}}>
          {listing.item.description?.length > 85 ? listing.item.description.slice(0, 83) + '...' : listing.item.description}
        </Typography>
        <Box className='card-categories' sx={{maxHeight: '5em'}}>
          {listing.item.item_type}
        </Box>
      </CardContent>
      
      <CardActions>
        <CustomButton
          category={"action"}
          title={"View"}
          variant={"outlined"}
          // route={`/projects/${slug}`}
        />
        {/* { username !== projectOwner && 
          (
            <Button
              category={"action"}
              title={followStatus ? `${buttonTitle}` : "Follow"}
              variant={followStatus ? "outlined" : "contained"}
              onMouseOver={handleMouseOver}
              onMouseLeave={handleMouseLeave}
              onClick={handleFollowAction}
            />
          )
        }
        { username === projectOwner &&
          (<>
            <Button
              category={"action"}
              title={"Delete"}
              variant={"outlined"}
              onClick={triggerDeleteModal}
            />
          </>) 
        } */}
      </CardActions>
      
    </Card>
  )
}
