import { Button } from "@/components/Button/Button";
import { jwtDecode } from "jwt-decode";
import { StethoscopeIcon, UserIcon } from "lucide-react";
import "./Navbar.css"; // Import the CSS file for the navbar styles

interface NavbarProps {
  handleSignInClick: () => void;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleSignInClick, handleLogout }) => {
  // Function to check if JWT token is valid
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

  // Check if the user is logged in by verifying the JWT token
  const isLoggedIn = isTokenValid(localStorage.getItem("jwtToken"));

  return (
    <header className="navbar">
      <a className="navbar-brand" href="#">
        <StethoscopeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="text-xl font-semibold text-gray-800 dark:text-white">
          Ortho Vision
        </span>
      </a>
      <nav className="navbar-links">
        <a
          className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          href="#features"
        >
          Features
        </a>
        <a
          className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          href="#how-it-works"
        >
          How It Works
        </a>
        <a
          className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          href="#benefits"
        >
          Benefits
        </a>
        <a
          className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          href="#contact"
        >
          Contact
        </a>
      </nav>

      {/* Conditionally render the Sign In or Log Out button */}
      {isLoggedIn ? (
        <Button variant="outline" className="navbar-button" onClick={handleLogout}>
          <UserIcon className="h-5 w-5" />
          Log Out
        </Button>
      ) : (
        <Button variant="outline" className="navbar-button" onClick={handleSignInClick}>
          <UserIcon className="h-5 w-5" />
          Sign In
        </Button>
      )}
    </header>
  );
};

export default Navbar;
