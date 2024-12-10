import { Button } from "@/components/Button/Button";
import isTokenValid from "@/hooks/tokenValid";
import { UserIcon } from "lucide-react";
import { useState } from "react";
import "./Navbar.css";

interface NavbarProps {
  handleSignInClick: () => void;
  handleLogout: () => void;
  links: Array<{ href: string; label: string }>; // Array of link objects
}

const Navbar: React.FC<NavbarProps> = ({
  handleSignInClick,
  handleLogout,
  links,
}) => {
  // Check if the user is logged in by verifying the JWT token
  const isLoggedIn = isTokenValid(localStorage.getItem("jwtToken"));
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <header className="navbar">
      <nav className="navbar-links">
        {links.map((link, index) => (
          <a
            key={index}
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            href={link.href}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Conditionally render the Sign In or Log Out button */}
      {isLoggedIn ? (
        <Button
          variant="outline"
          className="navbar-button"
          onClick={handleLogout}
        >
          <UserIcon className="h-5 w-5" />
          Log Out
        </Button>
      ) : (
        <Button
          variant="outline"
          className="navbar-button"
          onClick={handleSignInClick}
        >
          <UserIcon className="h-5 w-5" />
          Sign In
        </Button>
      )}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1100">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold">Confirm Logout</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)} // Close dialog
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleLogout();
                  setShowConfirmDialog(false); // Close dialog after logout
                }}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
