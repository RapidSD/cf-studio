export const runtime = 'edge';

import { NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ChatRequest;

    // For now, we'll just echo back the message
    // In production, this would integrate with Cloudflare Workers AI
    return NextResponse.json({
      response: `Received: ${body.message}`,
    });
  } catch (err) {
    console.error('Error processing chat:', err);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
} 