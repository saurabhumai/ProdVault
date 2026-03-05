import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Just log that we received the request
    console.log('Feedback API called')
    
    const body = await request.json()
    console.log('Received feedback data:', JSON.stringify(body, null, 2))
    
    // Create FormData object as expected by n8n
    const formData = new FormData()
    formData.append('name', body.name)
    formData.append('email', body.email)
    formData.append('feedback', body.feedback)
    
    // Try webhook URL with FormData
    const webhookUrl = 'https://saurabhumai-123.app.n8n.cloud/webhook/a9080614-55de-4a86-8aa1-7e478a9dbc04'
    
    console.log('Sending to n8n webhook URL:', webhookUrl)
    console.log('Sending as FormData')
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData, // Send as FormData instead of JSON
    })

    console.log('n8n response status:', response.status)
    
    const responseText = await response.text()
    console.log('n8n response body:', responseText)

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: `n8n webhook error: ${response.status}`,
          responseText: responseText
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      n8nStatus: response.status 
    })
    
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { 
        error: 'API error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
