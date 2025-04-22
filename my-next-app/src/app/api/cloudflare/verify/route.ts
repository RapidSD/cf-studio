import { NextResponse } from 'next/server';

interface VerifyRequest {
  token: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body as VerifyRequest;

    if (!token) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Token is required' }] },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    // If response is not ok, format the error to match Cloudflare's error format
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        errors: [{
          message: 'Invalid API token. Please check your token and try again.'
        }]
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({
      success: false,
      errors: [{
        message: 'Failed to verify token. Please try again.'
      }]
    }, { status: 500 });
  }
} 