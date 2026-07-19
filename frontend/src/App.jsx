import { useState } from "react";
import { Send, LogOut } from "lucide-react";
import AuthForm from "./components/AuthForm";
import CrisisBanner from "./components/CrisisBanner";

const App = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const historyToSend = updatedMessages.slice(-10);
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: historyToSend }),
      });

      if (res.status === 401) {
        setUserEmail(null);
        throw new Error("Session expired. Please log in again.");
      }
      if (!res.ok) throw new Error("Server returned an error");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.message }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUserEmail(null);
    setMessages([]);
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#1C2321]">
        <CrisisBanner />
        <AuthForm onAuthSuccess={(email) => setUserEmail(email)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C2321] flex flex-col">
      <CrisisBanner />

      <div className="flex justify-between items-center px-6 py-4 border-b border-[#2E3733]">
        <span className="text-sm text-[#8A9691]">{userEmail}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-[#8A9691] hover:text-[#F2F0E9] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 space-y-6 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-[#5E6862] text-sm text-center mt-12">
            How have you been feeling lately?
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "text-right" : "text-left"}
          >
            <p
              className={
                "inline-block max-w-[80%] text-sm leading-relaxed " +
                (msg.role === "user" ? "text-[#F2F0E9]" : "text-[#B8C4BE]")
              }
            >
              {msg.text}
            </p>
          </div>
        ))}
        {loading && <p className="text-[#5E6862] text-sm">Thinking...</p>}
        {error && <p className="text-[#E8A855] text-sm">{error}</p>}
      </div>

      <div className="border-t border-[#2E3733] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Share what's on your mind..."
            className="flex-1 chat-input-field rounded-lg py-2.5 px-4 text-sm"
          />
          <button
            onClick={sendMessage}
            className="bg-[#7A9B8E] text-[#152019] rounded-lg p-2.5 hover:bg-[#8CADA0] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
