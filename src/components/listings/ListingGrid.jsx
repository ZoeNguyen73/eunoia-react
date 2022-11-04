import { useState, useEffect, useContext } from "react";

import Grid from "@mui/material/Unstable_Grid2";

import ListingCard from "./ListingCard";
import axios from '../../api/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import AuthContext from '../../context/AuthProvider';

export default function ListingGrid(props) {
  const [listings, setListings] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useContext(AuthContext);
  const { filters, limit } = props;

  let filterParams = '?';
  let apiUrl = 'listings/';

  if (filters) {
    Object.keys(filters).forEach((key, idx) => {
      const values = filters[key];
      if (values.length > 0) {
        filterParams += `${key}=${values.join(',').replaceAll(' ', '+')}`;
        if (idx < Object.keys(filters).length - 1 ) {
          filterParams += '&';
        };
      };
    });
  }

  if (limit) {
    if (filters) {
      filterParams += `&limit=${limit}`
    } else {
      filterParams += `limit=${limit}`
    }
  }

  if (filterParams.length > 1) {
    apiUrl += filterParams;
  }

  useEffect(() => {
    async function getData() {
      console.log(`apiurl: ${apiUrl}`)
      try {
        const response = await axios.get(apiUrl);
        setListings(response.data);
        return
      } catch(err) {
        console.log(err);
        return
      }
    }

    getData();
  }, [apiUrl, props])

  const listingCards = listings.map((listing, idx) => {
    return (
      <Grid key={idx} xs={true} md={4} item>
        <ListingCard 
          listing={listing}
        />
      </Grid>
    )
  })

  return (
    <>
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, md: 12 }}
        justifyContent="center"
      >
        {listingCards}
      </Grid>
    </>
  )
}
