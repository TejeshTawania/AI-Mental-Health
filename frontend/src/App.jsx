import { useState } from "react";
import AuthForm from "./components/AuthForm";
import CrisisBanner from "./components/CrisisBanner";

const App = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [messages, setMessages] = useState([]); // {role: 'user'|'bot', text: string}[]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);
    const updatedMessages = [...messages, userMessage];
    try {
      const historyToSend = updatedMessages.slice(-10);
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          messages: historyToSend,
        }),
      });

      if (res.status === 401) {
        setUserEmail(null);
        throw new Error("Session expired. Please log in again.");
      }

      if (!res.ok) throw new Error("Server returned an error");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.message }]);
    } catch (err) {
      console.error("Error connecting to backend", err);
      setError("Something went wrong. Try again.");
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
      <>
        <CrisisBanner />
        <AuthForm onAuthSuccess={setUserEmail} />
      </>
    );
  }

  return (
    <>
      <CrisisBanner />
      <div className="text-center mt-0.5">
        <div>
          Logged in as {userEmail}
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div>
          {messages.map((msg, i) => (
            <div key={i}>
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.text}
            </div>
          ))}
        </div>

        {loading && <div>Thinking...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
};

export default App;
