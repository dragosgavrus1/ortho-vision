import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage/Homepage";
import SignInSignUp from "./pages/SignInSignUp/SignInSignUp";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInSignUp/>} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
