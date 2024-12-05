import { Button } from "@/components/ui/button";
import { Lock, UserIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInSignUp = () => {
  const navigate = useNavigate();
  
  // States for handling user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState(""); // For SignUp only
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between SignIn and SignUp forms

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullname,
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
      const response = await fetch("http://localhost:3000/signin", {
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
        // Redirect to the dashboard after successful sign-in
        navigate("/");
      } else {
        console.log("Signin failed", data.error);
        setError(data.error || "An error occurred during signin");
      }
    } catch (err) {
      console.error("Error during signin", err);
      setError("An error occurred during signin");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={isSignUp ? handleSignUp : handleSignIn}
        className="w-full max-w-sm bg-white p-8 shadow-md rounded-lg dark:bg-gray-800"
      >
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          {isSignUp ? "Sign Up to Ortho Vision" : "Sign In to Ortho Vision"}
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {isSignUp && (
          <div className="mb-4">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative mt-1">
            <UserIcon className="absolute left-3 top-2 text-gray-500" />
            <input
              type="email"
              id="email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-2 text-gray-500" />
            <input
              type="password"
              id="password"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" type="submit">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <a
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign in
              </a>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <a
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
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
