import { useNavigate } from 'react-router-dom';
import { encryptParam } from '../utils/cryptoUrl';

export function useEncryptedNavigate() {
  const navigate = useNavigate();

  const navigateEncrypted = (pathname, queryParams = {}) => {
    if (Object.keys(queryParams).length === 0) {
      navigate(pathname);
      return;
    }

    const encryptedToken = encryptParam(queryParams);
    navigate(`${pathname}?q=${encryptedToken}`);
  };

  return navigateEncrypted;
}