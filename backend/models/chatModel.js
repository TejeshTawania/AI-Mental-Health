const { SYSTEM_PROMPT } = require("./Prompts/systemprompt");

async function getReply(chatMessages) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in your .env file.");
  }

  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatMessages.map((msg) => ({
      role: msg.role === "bot" ? "assistant" : "user",
      content: msg.text,
    })),
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: formattedMessages,
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      let errMessage = `HTTP ${response.status}`;
      try {
        const errData = await response.json();
        errMessage = errData.error?.message || errMessage;
      } catch {}
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

async function generateRoutine(concern) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in your .env file.");
  }

  const routinePrompt = `You are a wellness assistant. Generate a short daily routine to help with "${concern}".
Return ONLY a JSON array of 4-6 short, specific, actionable items — no explanations, no markdown, no extra text.
Example format: ["Take 5 deep breaths", "Step outside for 5 minutes"]`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: routinePrompt }],
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      let errMessage = `HTTP ${response.status}`;
      try {
        const errData = await response.json();
        errMessage = errData.error?.message || errMessage;
      } catch {}
      throw new Error(`Groq request failed: ${errMessage}`);
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content.trim();

    // Model sometimes wraps JSON in markdown code fences despite instructions — strip if present
    const cleaned = rawText
      .replace(/^```json\s*|\s*```$/g, "")
      .replace(/^```\s*|\s*```$/g, "");

    const items = JSON.parse(cleaned);
    if (!Array.isArray(items)) throw new Error("Unexpected format from model");
    return items;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Groq request timed out (15 seconds)");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = { getReply, generateRoutine };
