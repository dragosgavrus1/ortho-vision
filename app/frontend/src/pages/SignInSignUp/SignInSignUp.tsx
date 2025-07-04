// src/pages/SignInSignUp.tsx

import { Button } from "@/components/Button/Button";
import { useRepo } from "@/data/repo/Context";
import { Lock, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInSignUp.css";

const SignInSignUp = () => {
  const navigate = useNavigate();
  const { fetchPatients } = useRepo();
  // States for handling user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState(""); // For SignUp only
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between SignIn and SignUp forms
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem("role");

    if (token) {
      if (userRole === "patient") {
        navigate("/overview");
      } else if (userRole === "doctor") {
        navigate("/patients");
      }
    }
  }, []);

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://ortho-vision-backend.fly.dev//signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullname,
          role: isPatient ? "patient" : "doctor", // <-- NEW: decide role based on checkbox
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User signed up successfully", data);
        // Redirect to Sign In page after successful signup
        setIsSignUp(false);
      } else {
        console.log("Signup failed", data.error);
        setError(data.error || "An error occurred during signup");
      }
    } catch (err) {
      console.error("Error during signup", err);
      setError("An error occurred during signup");
    }
  };

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("https://ortho-vision-backend.fly.dev//signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User signed in successfully", data);
        console.log("User ID:", data.user_id);
        // Store the JWT token in localStorage
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);
        localStorage.setItem("chatMessages", JSON.stringify([])); // Initialize chat messages
        if (data.patient_id) {
          localStorage.setItem("patient_id", data.patient_id);
        }
        
        // Redirect based on user role
        if (data.role === "patient") {
          navigate("/overview");
        } else {
          fetchPatients();
          navigate("/patients");
        }
      }
      else {
        console.log("Signin failed", data.error);
        setError(data.error || "An error occurred during signin");
      }
    } catch (err) {
      console.error("Error during signin", err);
      setError("An error occurred during signin");
    }
  };

  return (
    <div className="auth-container">
      <form
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
        className="auth-form"
      >
        <h1 className="auth-form-title">
          {isSignUp ? "Sign Up to Ortho Vision" : "Sign In to Ortho Vision"}
        </h1>

        {error && <p className="auth-error">{error}</p>}

        {isSignUp && (
          <div className="auth-input-group">
            <label htmlFor="fullname" className="auth-input-label">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              className="auth-input"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
        )}

        <div className="auth-input-group">
          <label htmlFor="email" className="auth-input-label">
            Email
          </label>
          <div className="auth-input-icon-wrapper">
            <UserIcon className="auth-input-icon" />
            <input
              type="email"
              id="email"
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="auth-input-group">
          <label htmlFor="password" className="auth-input-label">
            Password
          </label>
          <div className="auth-input-icon-wrapper">
            <Lock className="auth-input-icon" />
            <input
              type="password"
              id="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {isSignUp && (
          <div className="auth-input-group">
            <label htmlFor="isPatient" className="auth-input-label">
              <input
                type="checkbox"
                id="isPatient"
                checked={isPatient}
                onChange={(e) => setIsPatient(e.target.checked)}
                className="mr-2"
              />
              Creating a Patient Account
            </label>
          </div>
        )}

        <Button className="auth-submit-btn" type="submit">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <div className="auth-toggle-form">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <a
                onClick={() => setIsSignUp(false)}
                className="auth-toggle-link"
              >
                Sign in
              </a>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <a onClick={() => setIsSignUp(true)} className="auth-toggle-link">
                Sign up
              </a>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignInSignUp;
