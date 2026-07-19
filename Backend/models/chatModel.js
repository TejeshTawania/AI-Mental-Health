async function getReply(userMessage) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in your .env file.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: userMessage }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      let errMessage = `HTTP ${response.status}`;
      try {
        const errData = await response.json();
        errMessage = errData.error?.message || errMessage;
      } catch {
        // body wasn't valid JSON, stick with the HTTP status
      }
      throw new Error(`Groq request failed: ${errMessage}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Groq request timed out (15 seconds)");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = { getReply };