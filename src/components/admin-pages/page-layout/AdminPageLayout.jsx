import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';

import Sidebar from '../sidebar/Sidebar';
import AuthContext from '../../../context/AuthProvider';
import InfoTab from '../tabs/InfoTab';
import AddressesTab from '../tabs/AddressesTab';
import UsersTab from '../tabs/UsersTab';
import OrdersTab from '../tabs/OrdersTab';
import ItemsTab from '../tabs/ItemsTab';
import ListingsTab from '../tabs/ListingsTab';

export default function PageLayout() {
  const { auth } = useContext(AuthContext);
  const [tab, setTab] = useState(null);
  const [tabValue, setTabValue] = useState(null);

  useEffect(() => {
    if (auth?.organization) {
      setTabValue('1');
      setTab(<InfoTab />);
      return;
    }
  }, []);

  const handleTabChange = (newTabValue) => {
    setTab(newTabValue);
    switch(newTabValue) {
      case '1':
        setTab(<InfoTab />);
        break;
      case '2':
        setTab(<AddressesTab />);
        break;
      case '3':
        setTab(<UsersTab />);
        break;
      case '4':
        setTab(<OrdersTab />);
        break;
      case '5':
        setTab(<ItemsTab />);
        break;
      case '6':
      setTab(<ListingsTab />);
      break;
      default:
        setTab(<InfoTab />);
    };
  }

  return (
    <Box>
      <Sidebar handleTabChange={handleTabChange}/>
      {tab}
    </Box>
  )
}
