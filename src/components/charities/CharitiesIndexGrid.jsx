import React from 'react';
import { useEffect, useState, useContext } from 'react';

import axios from '../../api/axios';

export default function CharitiesIndexGrid() {
  const [ charities, setCharities ] = useState([]);
  const apiUrl = 'organizations/types/charities/';

  useEffect(()=> {
    async function getData() {
      try {
        const charitiesResp = await axios.get(apiUrl)
        setCharities(charitiesResp.data);
      } catch (err) {}
    }

    getData()
    
  }, [])

  const charitiesList = charities.map((c, idx) => {
    return (
      <div key={idx}> c.name</div>
    )
  })

  return (
    <div>
      {charitiesList}
    </div>
  )
}
