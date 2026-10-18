export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const update = await req.json();
    const message = update.message;

    if (!message?.chat?.id || !message?.text) {
      return new Response("OK", { status: 200 });
    }

    if (message.text.trim() === "/start") {
      const token = Netlify.env.get("TELEGRAM_BOT_TOKEN");

      if (!token) {
        return new Response("Bot token missing", { status: 500 });
      }

      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text: "🦉 Welcome to WOR Mining!\n\nYour mining journey starts soon. 🚀"
          })
        }
      );

      if (!response.ok) {
        return new Response("Telegram request failed", { status: 502 });
      }
    }

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
};
