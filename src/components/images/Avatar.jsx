import React from 'react';
import Avatar from "@mui/material/Avatar";

export default function CustomAvatar(props) {
  return (
    <Avatar 
      alt={props.imgAlt} 
      src={props.imgUrl} 
      sx={props.sx} 
    />
  )
}
