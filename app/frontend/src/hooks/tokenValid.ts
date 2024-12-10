import { jwtDecode } from "jwt-decode";

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token); // Decode the JWT token
    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decoded.exp && decoded.exp < currentTime) {
      return false; // Token is expired
    }
    return true; // Token is valid
  } catch (e) {
    console.error("Invalid token", e);
    return false;
  }
};
export default isTokenValid;
