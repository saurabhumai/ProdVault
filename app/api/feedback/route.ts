import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received feedback data:', body)
    
    // Try multiple possible webhook URLs
    const webhookUrls = [
      'https://saurabhumai-123.app.n8n.cloud/webhook/feedback-form',
      'https://saurabhumai-123.app.n8n.cloud/webhook/a9080614-55de-4a86-8aa1-7e478a9dbc04',
      'https://saurabhumai-123.app.n8n.cloud/form/a9080614-55de-4a86-8aa1-7e478a9dbc04'
    ]

    let response: Response | null = null
    let workingUrl = ''

    // Try each URL until one works
    for (const url of webhookUrls) {
      try {
        console.log('Trying webhook URL:', url)
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })

        if (response.ok) {
          workingUrl = url
          console.log('Success with URL:', url)
          break
        } else {
          console.log('Failed with URL:', url, 'Status:', response.status)
        }
      } catch (err) {
        console.log('Error with URL:', url, err)
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        { 
          error: 'All webhook URLs failed',
          triedUrls: webhookUrls,
          lastStatus: response?.status || 'No response'
        },
        { status: 500 }
      )
    }

    const responseText = await response.text()
    console.log('n8n response from', workingUrl, ':', response.status, responseText)

    return NextResponse.json({ 
      success: true, 
      webhookUsed: workingUrl,
      n8nResponse: responseText 
    })
  } catch (error) {
    console.error('Feedback submission error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to submit feedback', details: errorMessage },
      { status: 500 }
    )
  }
}
