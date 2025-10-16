/**
 * Example component demonstrating how to use the useUserDevicesWithMetadata hook
 * This component displays a list of devices owned by the connected wallet
 */

"use client";

import React from 'react';
import { useAccount } from 'wagmi';
import { useUserDevicesWithMetadata } from '@/lib/hooks/useUserDevicesWithMetadata';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function DeviceList() {
  const { address, isConnected } = useAccount();
  const { devices, totalCount, isLoading, error, refetch } = useUserDevicesWithMetadata(address);

  if (!isConnected) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Please connect your wallet to view your devices</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-3">Loading your devices...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">Error Loading Devices</h3>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </div>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (devices.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">You don't have any registered devices yet</p>
          <Button variant="outline">Register a Device</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          My Devices <Badge variant="secondary" className="ml-2">{totalCount}</Badge>
        </h2>
        <Button onClick={refetch} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <Card key={device.tokenId} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{device.modelName}</h3>
                  <p className="text-sm text-muted-foreground">{device.brand}</p>
                </div>
                <Badge variant="outline">#{device.tokenId}</Badge>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{device.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minted:</span>
                  <span className="font-medium">
                    {new Date(device.mintedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  Create Bounty
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

