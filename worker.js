export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
    };

    // Handle Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow POST for the actual chat
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { 
        status: 405, 
        headers: corsHeaders 
      });
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
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${env.API_KEY_hair}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{
              text: `You are a friendly human assistant for Floractive Training Academy in Birmingham. 
              Keep your responses simple, helpful, and very human-like. 
              Answer questions about Nanoplastia courses, Hair Botox treatments, location (The Cube, Birmingham), and prices.
              
              User question: ${message || 'Hello'}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return new Response(JSON.stringify({ error: "Gemini API error", details: data }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having a little trouble thinking of the right words. Could you ask me something else?";

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
