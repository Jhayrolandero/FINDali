/**
 * IMEI Check API utilities for fetching device metadata
 */

import { IMEICheckResponse } from './types';

const IMEI_API_KEY = process.env.IMEI_API_KEY || 'A8D0-B6E5-C07D-9134-E47F-59NB';
const IMEI_API_URL = 'https://alpha.imeicheck.com/api/free_with_key/modelBrandName';

/**
 * Fetches device information from IMEI
 * @param imei - 15-digit IMEI number
 * @returns Promise with device metadata
 */
export async function fetchDeviceInfo(imei: string): Promise<IMEICheckResponse | null> {
  if (!imei || imei.length !== 15) {
    throw new Error('Invalid IMEI: must be 15 characters');
  }

  const url = `${IMEI_API_URL}?key=${IMEI_API_KEY}&imei=${imei}&format=json`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache for 24 hours since device info doesn't change
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error(`IMEI API error: ${response.status} ${response.statusText}`);
    }

    const data: IMEICheckResponse = await response.json();

    if (data.status !== 'succes') { // Note: API uses 'succes' (typo)
      console.error(`IMEI lookup failed: ${data.result || 'Unknown error'}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching device info:', error);
    // throw new Error(
    //   `Failed to fetch device info: ${error instanceof Error ? error.message : 'Unknown error'}`
    // );
  }
  return null;
}

/**
 * Fetches device information for multiple IMEIs in parallel
 * @param imeis - Array of IMEI numbers
 * @returns Promise with array of device metadata (null for failed requests)
 */
export async function fetchMultipleDeviceInfo(
  imeis: string[]
): Promise<(IMEICheckResponse | null)[]> {
  const promises = imeis.map(async (imei) => {
    try {
      return await fetchDeviceInfo(imei);
    } catch (error) {
      console.error(`Failed to fetch info for IMEI ${imei}:`, error);
      return null;
    }
  });

  return Promise.all(promises);
}

