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

import axios from '../../../api/axios';

export default function PageLayout() {
  const { auth } = useContext(AuthContext);
  const [tab, setTab] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [tabValue, setTabValue] = useState(null);

  useEffect(() => {
    async function getOrgData() {
      try {
        if (auth?.organization && auth?.organization !== 'null') {
          const response = await axios.get(`organizations/${auth?.organizationSlug}/`);
          setOrganization(response.data);
          setTabValue('1');
          setTab(<InfoTab organizationData={response.data} handleOrganizationUpdate={handleOrganizationUpdate}/>);
          return;
        };
      } catch (err) {
        console.log(`err getting org data: ${err}`);
      };
    }

    getOrgData();
  }, []);

  const handleTabChange = (newTabValue) => {
    setTab(newTabValue);
    switch(newTabValue) {
      case '1':
        setTab(<InfoTab organizationData={organization} handleOrganizationUpdate={handleOrganizationUpdate} />);
        break;
      case '2':
        setTab(<AddressesTab organizationData={organization}/>);
        break;
      case '3':
        setTab(<UsersTab organizationData={organization}/>);
        break;
      case '4':
        setTab(<OrdersTab organizationData={organization}/>);
        break;
      case '5':
        setTab(<ItemsTab organizationData={organization}/>);
        break;
      case '6':
      setTab(<ListingsTab organizationData={organization}/>);
      break;
      default:
        setTab(<InfoTab organizationData={organization} handleOrganizationUpdate={handleOrganizationUpdate} />);
    };
  }

  const handleOrganizationUpdate = async () => {
    async function getOrgData() {
      try {
        if (auth?.organization && auth?.organization !== 'null') {
          const response = await axios.get(`organizations/${auth?.organizationSlug}/`);
          setOrganization(response.data);
          setTabValue('1');
          setTab(<InfoTab organizationData={response.data} />);
          return;
        };
      } catch (err) {
        console.log(`err getting org data: ${err}`);
      };
    }

    getOrgData();
  }

  return (
    <Box display='flex'>
      <Sidebar handleTabChange={handleTabChange} organizationData={organization}/>
      {tab}
    </Box>
  )
}
