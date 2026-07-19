import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";

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
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      onAuthSuccess(data.email);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-medium text-center mb-1">
          {isLogin ? "Welcome back" : "Create your space"}
        </h2>
        <p className="text-[#8A9691] text-sm text-center mb-8">
          {isLogin
            ? "Sign in to continue your check-in"
            : "A quiet place to reflect, just for you"}
        </p>

        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9B8E]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full chat-input-field rounded-lg py-2.5 pl-10 pr-3 text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9B8E]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full chat-input-field rounded-lg py-2.5 pl-10 pr-3 text-sm"
            />
          </div>
        </div>

        {error && (
          <p className="text-[#E8A855] text-sm mt-3 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 bg-[#7A9B8E] text-[#152019] font-medium text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-[#8CADA0] transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Please wait" : isLogin ? "Sign in" : "Sign up"}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-[#7A9B8E] text-sm hover:text-[#F2F0E9] transition-colors"
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
