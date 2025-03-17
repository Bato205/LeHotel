import { NextResponse } from "next/server"

const ELEVENLABS_LABS_API_KEY = process.env.ELEVENLABS_LABS_API_KEY
const VOICE_ID = "sa2z6gEuOalzawBHvrCV" // Voice ID for Antoine

// Antoine - English with French accent, using Eleven Multilingual v2 model
export async function POST(req: Request) {
  try {
    console.log("=== Starting text-to-speech request ===")
    console.log("API Key present:", !!ELEVENLABS_LABS_API_KEY)
    console.log("API Key length:", ELEVENLABS_LABS_API_KEY?.length)
    
    if (!ELEVENLABS_LABS_API_KEY) {
      console.error("Missing API key")
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 })
    }

    const body = await req.json()
    console.log("Request body:", body)
    const { text } = body
    console.log("Text to convert:", text)

    if (!text) {
      console.error("No text provided in request")
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const requestBody = {
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }
    console.log("Sending request to ElevenLabs with body:", JSON.stringify(requestBody))

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_LABS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("ElevenLabs response status:", response.status)
    console.log("ElevenLabs response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("ElevenLabs API error details:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
    }

    const audioBuffer = await response.arrayBuffer()
    console.log("Received audio buffer size:", audioBuffer.byteLength)
    const base64Audio = Buffer.from(audioBuffer).toString("base64")
    console.log("Converted to base64, length:", base64Audio.length)

    return NextResponse.json({
      success: true,
      audioData: base64Audio,
    })
  } catch (error: any) {
    console.error("=== Text-to-speech error details ===")
    console.error("Error name:", error?.name || 'Unknown')
    console.error("Error message:", error?.message || 'Unknown error')
    console.error("Error stack:", error?.stack || 'No stack trace')
    console.error("Full error object:", error)
    
    return NextResponse.json({ 
      success: false, 
      error: "Failed to generate speech",
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}

