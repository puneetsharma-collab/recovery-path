import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ API KEY MISSING');
      return NextResponse.json({
        reply: 'Server misconfiguration: API key missing.'
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 sec timeout

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a calm, empathetic, non-judgmental recovery coach helping people overcome porn and masturbation addiction. Provide emotional support, coping strategies, breathing exercises, and gentle motivation.'
            },
            { role: 'user', content: message }
          ],
          temperature: 0.7
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    const data = await response.json();

    console.log('🧠 AI RESPONSE:', data);

    if (!data?.choices?.[0]?.message?.content) {
      console.error('❌ AI BAD RESPONSE', data);
      return NextResponse.json({
        reply: 'AI response invalid. Please try again.'
      });
    }

    return NextResponse.json({
      reply: data.choices[0].message.content
    });
  } catch (err: any) {
    console.error('🔥 AI ERROR:', err.message || err);

    return NextResponse.json({
      reply: 'AI service temporarily unavailable. Please try again in a moment.'
    });
  }
}
