/**
 * API Route: Fetch device information by IMEI
 * GET /api/device-info?imei={imei}
 * 
 * This endpoint fetches device metadata from the IMEI API
 * Used for auto-filling the registration form
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchDeviceInfo } from '@/lib/api/imei';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET handler for fetching device info by IMEI
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and validate IMEI
    const { searchParams } = new URL(request.url);
    const imei = searchParams.get('imei');

    if (!imei) {
      return NextResponse.json(
        { error: 'IMEI is required' },
        { status: 400 }
      );
    }

    if (imei.length !== 15 || !/^\d{15}$/.test(imei)) {
      return NextResponse.json(
        { error: 'IMEI must be exactly 15 digits' },
        { status: 400 }
      );
    }

    // Fetch device info from IMEI API
    const deviceInfo = await fetchDeviceInfo(imei);

    return NextResponse.json(
      {
        brand: deviceInfo.object.brand,
        model: deviceInfo.object.model,
        modelName: deviceInfo.object.name,
        imei: deviceInfo.imei,
      },
      {
        headers: {
          // Cache for 24 hours since device info doesn't change
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        },
      }
    );
  } catch (error) {
    console.error('Error in device-info API:', error);
    
    // Return a more graceful error for invalid IMEIs
    if (error instanceof Error && error.message.includes('IMEI lookup failed')) {
      return NextResponse.json(
        { error: 'Device not found in IMEI database' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Failed to fetch device information',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

