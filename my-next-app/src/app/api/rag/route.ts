export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

interface RagRequest {
  query: string;
  topK?: number;
}

// Interfaces for AutoRAG response
interface AutoRagResponse {
  success: boolean;
  result: {
    response: string;
    search_query: string;
    data: AutoRagResult[];
  };
}

interface AutoRagResult {
  file_id: string;
  filename: string;
  score: number;
  content: {
    id: string;
    type: string;
    text: string;
  }[];
}

/**
 * API endpoint to handle RAG (Retrieval-Augmented Generation) searches
 * This connects to your Cloudflare AutoRAG service to find relevant context and generate responses
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as RagRequest;
    const { query, topK = 5 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Get environment variables
    const { env } = getRequestContext();
    const accountId = env.CLOUDFLARE_ACCOUNT_ID;
    const autoRagName = env.AUTORAG_NAME;
    const apiToken = env.AUTORAG_API_TOKEN;

    if (!accountId || !autoRagName || !apiToken) {
      return NextResponse.json(
        { error: 'Missing AutoRAG configuration' },
        { status: 500 }
      );
    }

    // Query the Cloudflare AutoRAG API
    const ragResponse = await queryAutoRag(query, accountId, autoRagName, apiToken, topK);

    return NextResponse.json(ragResponse);
  } catch (err) {
    console.error('Error processing RAG query:', err);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

/**
 * Query the Cloudflare AutoRAG API to get AI-generated responses with relevant context
 */
async function queryAutoRag(
  query: string, 
  accountId: string, 
  autoRagName: string, 
  apiToken: string,
  maxNumResults: number
) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/autorag/rags/${autoRagName}/ai-search`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        query,
        rewrite_query: true,
        max_num_results: maxNumResults,
        ranking_options: {
          score_threshold: 0.6
        },
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AutoRAG API error:', errorData);
      throw new Error(`AutoRAG API returned status ${response.status}`);
    }

    const data = await response.json() as AutoRagResponse;
    
    if (!data.success || !data.result) {
      throw new Error('Invalid response from AutoRAG API');
    }
    
    return {
      answer: data.result.response,
      context: data.result.data.map((item) => ({
        content: item.content[0]?.text || '',
        source: item.filename,
        score: item.score
      })),
      search_query: data.result.search_query
    };
  } catch (error) {
    console.error('Error querying AutoRAG:', error);
    throw error;
  }
} 