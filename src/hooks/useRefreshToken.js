import axios from '../api/axios';
import useAuth from './useAuth';
import { useCookies } from 'react-cookie';

export default function useRefreshToken() {
  const { setAuth } = useAuth();
  const [cookies, setCookie, removeCookie] = useCookies(); 
  const refresh = async () => {
    const response = await axios.post(
      'auth/token/refresh/',
      { refresh: cookies.refreshToken}
    );

    const newAccessToken = response.data.access;

    setAuth(prev => {
      return {...prev, accessToken: newAccessToken};
    })
    removeCookie('accessToken');
    setCookie('accessToken', newAccessToken);

    return newAccessToken;
  }

  return refresh;
}
