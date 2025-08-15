import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ 
        response: "Hi! I'm Rehan AI. To enable full AI capabilities, please configure your OpenRouter API key in the environment variables. For now, I'm running in demo mode. You can ask me anything and I'll provide helpful responses!" 
      })
    }

    // OpenRouter API integration
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'rehan.ai'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Using GPT-4o-mini for cost efficiency
        messages: [
          {
            role: 'system',
            content: 'You are Rehan AI, a highly intelligent and helpful assistant created for rehan.ai. Provide accurate, detailed, and engaging responses. Be conversational yet professional. Always be helpful and informative.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ 
      response: aiResponse,
      model: 'gpt-4o-mini',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    // Fallback response for demo purposes
    const demoResponses = [
      "Thanks for trying rehan.ai! I'm designed to be your intelligent assistant. To unlock my full potential with GPT-5, please add your OpenRouter API key to the environment variables.",
      "Hello! I'm Rehan AI. While I'm currently in demo mode, I'm built to provide high-quality responses using advanced AI models. Configure your API key to experience the full capabilities!",
      "Great question! I'm rehan.ai - an AI platform designed with a superior user interface. Once you set up the OpenRouter API key, I'll be powered by the latest GPT models to help you with anything you need.",
      "I appreciate your interest in rehan.ai! This platform is designed to provide an exceptional AI experience. Add your OpenRouter API key to enable full AI-powered conversations."
    ]
    
    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]
    
    return NextResponse.json({ 
      response: randomResponse,
      model: 'demo-mode',
      timestamp: new Date().toISOString()
    })
  }
}