import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import AuthContext from '../../context/AuthProvider';

export default function LogOut() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    removeCookie('refreshToken');
    removeCookie('accessToken');
    removeCookie('username');
    removeCookie('organization');
    setAuth({ accessToken: '', username: '', organization:'' });
    navigate('/', { replace: true })
  }, [])

  return (
    <></>
  )
}
