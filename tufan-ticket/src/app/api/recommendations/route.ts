import { NextRequest, NextResponse } from 'next/server';
import { Event } from '../events/route';

// Mock events from the events API
import { events } from '../events/route';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const type = searchParams.get('type') || 'personalized';
  const userId = searchParams.get('userId') || 'current-user'; // In a real app, get from auth session
  const limit = parseInt(searchParams.get('limit') || '10');
  
  // In a real implementation, this would call the ML service
  // Here we're mocking the response based on the type
  let recommendations: Event[] = [];
  
  switch (type) {
    case 'personalized':
      // This would call the personalized recommendation ML endpoint
      recommendations = getMockedPersonalizedRecommendations(userId, limit);
      break;
    case 'trending':
      // This would call the trending events ML endpoint
      recommendations = getMockedTrendingRecommendations(limit);
      break;
    case 'nearby':
      // This would use geolocation and the ML service
      const lat = parseFloat(searchParams.get('latitude') || '0');
      const lng = parseFloat(searchParams.get('longitude') || '0');
      recommendations = getMockedNearbyRecommendations(lat, lng, limit);
      break;
    case 'discovery':
      // This would call the discovery/exploration ML endpoint
      recommendations = getMockedDiscoveryRecommendations(userId, limit);
      break;
    default:
      return NextResponse.json({ error: 'Invalid recommendation type' }, { status: 400 });
  }
  
  return NextResponse.json({ recommendations });
}

// Mock functions that would be replaced with actual ML service calls
function getMockedPersonalizedRecommendations(userId: string, limit: number): Event[] {
  // In a real implementation, this would call your recommendation model
  // For now, just return some mock events
  return events
    .sort(() => 0.5 - Math.random()) // Random shuffle
    .slice(0, limit);
}

function getMockedTrendingRecommendations(limit: number): Event[] {
  // In a real implementation, this would call your trending algorithm
  return events
    .sort((a: Event, b: Event) => (b.ticketsSold || 0) - (a.ticketsSold || 0)) // Sort by tickets sold
    .slice(0, limit);
}

function getMockedNearbyRecommendations(lat: number, lng: number, limit: number): Event[] {
  // In a real implementation, this would use geospatial queries
  // For mock purposes, sort by "distance" (just a simple calculation)
  return events
    .sort((a: { location: { latitude: number; longitude: number; }; }, b: { location: { latitude: number; longitude: number; }; }) => {
      const distA = Math.sqrt(
        Math.pow(a.location.latitude - lat, 2) + 
        Math.pow(a.location.longitude - lng, 2)
      );
      const distB = Math.sqrt(
        Math.pow(b.location.latitude - lat, 2) + 
        Math.pow(b.location.longitude - lng, 2)
      );
      return distA - distB;
    })
    .slice(0, limit);
}

function getMockedDiscoveryRecommendations(userId: string, limit: number): Event[] {
  // In a real implementation, this would call your exploration algorithm
  // For mock purposes, return events from categories the user doesn't typically engage with
  // Here, we're just returning random events
  return events
    .sort(() => 0.5 - Math.random())
    .slice(0, limit);
}