import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message, feature, language } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        reply: language === "en" 
          ? "Please set OPENAI_API_KEY in your .env.local file to test the AI." 
          : "AI പരീക്ഷിക്കുന്നതിന് ദയവായി നിങ്ങളുടെ .env.local ഫയലിൽ OPENAI_API_KEY സജ്ജമാക്കുക." 
      })
    }

    const systemPrompt = language === "en"
      ? `You are an expert architect assistant specializing in Kerala home design. The user is adding a "${feature}" to their home requirements. Acknowledge their message, provide a very brief insight, and ask one specific follow-up question about materials, dimensions, or placement. Keep the response under 3 sentences.`
      : `നിങ്ങൾ കേരള ഹോം ഡിസൈനിൽ വിദഗ്ദ്ധനായ ഒരു ആർക്കിടെക്റ്റ് അസിസ്റ്റൻ്റാണ്. ഉപയോക്താവ് അവരുടെ വീട്ടിലെ ആവശ്യങ്ങളിലേക്ക് ഒരു "${feature}" ചേർക്കുന്നു. അവരുടെ സന്ദേശം അംഗീകരിക്കുക, ഒരു ചെറിയ ഉൾക്കാഴ്ച നൽകുക, കൂടാതെ നിർമ്മാണ സാമഗ്രികൾ, അളവുകൾ, അല്ലെങ്കിൽ സ്ഥാനം എന്നിവയെക്കുറിച്ച് ഒരു പ്രത്യേക ചോദ്യം ചോദിക്കുക. മറുപടി മലയാളത്തിൽ 3 വാക്യങ്ങളിൽ താഴെയായിരിക്കണം.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const reply = data.choices[0].message.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json({ error: "Error processing chat" }, { status: 500 })
  }
}