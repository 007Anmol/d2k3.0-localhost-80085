// src/app/api/events/trending/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category');
  
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    let apiUrl = `${mlServiceUrl}/api/recommendations/trending?limit=${limit}`;
    
    if (category) {
      apiUrl += `&category=${category}`;
    }
    
    console.log(`Fetching trending events from ML service: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ML service error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { error: `Failed to fetch trending events: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Trending events API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending events from ML service' },
      { status: 500 }
    );
  }
}