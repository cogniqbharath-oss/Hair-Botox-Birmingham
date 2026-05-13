export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const bodyText = await request.text();
      let message;
      try {
        const json = JSON.parse(bodyText);
        message = json.message || bodyText;
      } catch (e) {
        message = bodyText;
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY || 'API_KEY_botox'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a friendly human assistant for Floractive Training Academy in Birmingham. 
              Keep your responses simple, helpful, and very human-like. 
              Answer questions about Nanoplastia courses, Hair Botox treatments, location (The Cube, Birmingham), and prices.
              User message: ${message}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return new Response(JSON.stringify({ error: "API error", details: data }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to answer that right now.";

      return new Response(JSON.stringify({ response: botResponse }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }
  },
};
