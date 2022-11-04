import { useEffect, useState } from 'react';

import Box from "@mui/material/Box";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import styles from './Filters.module.scss';

export default function Filters(props) {
  const { options, updateSelections, currentSelections } = props;
  const [ selections, setSelections ] = useState([]);

  useEffect(() => {
    setSelections(currentSelections);
  }, [props])

  const handleChange = (evnt) => {
    const option = evnt.target.name;
    const currentSelections = [...selections];
    let newSelections = [];
    if (evnt.target.checked) {
      newSelections = [...currentSelections, option];
    } else {
      newSelections = currentSelections.filter(selection => selection !== option)
    }
    setSelections([...newSelections]);
    updateSelections(newSelections);
  };

  const optionsDisplay = options.map((option, idx) => {
    return (
      <FormControlLabel className={styles['options']}
        key={idx}
        control={
          <Checkbox className={styles['checkbox']} checked={selections.includes(option)} onChange={handleChange} name={option} />
        }
        label={<Typography className={styles['label']}>{option}</Typography>}
      />
    )
  })

  return (
    <Box sx={{ display: 'flex' }} className={styles['filters']}>
      <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
        <FormGroup className={styles['options-list']}>
          {optionsDisplay}
        </FormGroup>
      </FormControl>      

    </Box>
  )
}
