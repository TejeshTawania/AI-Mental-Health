import { useState } from "react";
import AuthForm from "./components/AuthForm";
import CrisisBanner from "./components/CrisisBanner";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [userEmail, setUserEmail] = useState(null);
  console.log("userEmail is:", userEmail);
  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUserEmail(null);
  };

  return (
    <div className="min-h-screen bg-[#1C2321] flex flex-col">
      <CrisisBanner />
      {!userEmail ? (
        <AuthForm onAuthSuccess={(email) => setUserEmail(email)} />
      ) : (
        <Dashboard userEmail={userEmail} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
