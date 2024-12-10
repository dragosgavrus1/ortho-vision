import isTokenValid from "@/hooks/tokenValid";
import { StethoscopeIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button/Button";
import "./HomePageNavBar.css"; // Import the CSS file for the navbar styles

interface NavbarProps {
  handleSignInClick: () => void;
  handleLogout: () => void;
}

const HomePageNavbar: React.FC<NavbarProps> = ({
  handleSignInClick,
  handleLogout,
}) => {
  const isLoggedIn = isTokenValid(localStorage.getItem("jwtToken"));
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
        <Button
          variant="outline"
          className="navbar-button"
          onClick={() => setShowConfirmDialog(true)} // Show confirmation dialog
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

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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

export default HomePageNavbar;
