import { jwtDecode } from 'jwt-decode';

export const getUserRoleFromToken = () => {
  const token = sessionStorage.getItem('access_token');
  console.log('Token found:', token ? 'Yes' : 'No');

  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    
    // Check for role in token
    const roleValue = decoded.sub || decoded.type;
    console.log('Role value from token:', roleValue);

    // Determine role based on token values
    const role = roleValue === '1' || roleValue === 'access' ? 'admin' : 'testlead';
    console.log('Determined role:', role);
    
    return role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
