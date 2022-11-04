import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import ListingGrid from './ListingGrid';
import Filters from '../filters/Filters';

export default function ListingPage() {
  const [ categoriesFilter, setCategoriesFilter ] = useState([]);

  const categories = [
    'Cooked vegetables',
    'Cooked meat',
    'Canned food',
    'Cooked fish',
    'Refridgerated food',
    'Diary',
    'Vegetables',
    'Meat',
    'Fish and Seafoods',
    'Eggs',
    'Condiments',
    'Snacks',
    'Oil',
    'Jams and Spreads',
    'Fruits',
    'Baked goods',
    'Beverages',
    'Rice',
    'Noodles',
    'Seasonings',
    'Pastes and Sauces',
    'Cutlery',
    'Dried food',
    'Vitamins and Supplements',
    'Miscellaneous',
  ]

  const updateCategoriesFilter = (selections) => {
    setCategoriesFilter(selections);
  }

  const clearFilters = () => {
    setCategoriesFilter([]);
  }

  return (
    <>
      <Grid 
        container
        spacing={4}
        columns={{ xs: 1, md: 12 }}
        justifyContent="space-between"
        marginTop={4}
      >
        <Grid md={2} item>
          <Typography variant='h6' component='h2' color='var(-color2)'>
            Filters
          </Typography>
          <Typography
            variant='caption' 
            onClick={clearFilters}
          >
            Clear filters
          </Typography>

          <Filters options={categories} currentSelections={categoriesFilter} updateSelections={updateCategoriesFilter} />
        </Grid>

        <Grid md={10} sx={{ height: "100%" }} paddingTop={0}>
          <Typography
            variant="h4"
            component='h1'
            textAlign={"center"}
            marginY={4}
            sx={{ color: "var(--color4)", fontWeight: "bold" }}
          >
            Listings
          </Typography>
          <ListingGrid filters={{categories: categoriesFilter}} />
        </Grid>
      </Grid> 
    </>
  )
}
