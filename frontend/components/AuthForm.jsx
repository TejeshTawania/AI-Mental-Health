import { useState } from "react";

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    try {
      const res = await fetch("http://localhost:3000" + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something Went Wrong!");
      }
      onAuthSuccess(email);
    } catch (err) {
      setError(err.message || "An Error Occured");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
      </button>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Signup" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthForm;
