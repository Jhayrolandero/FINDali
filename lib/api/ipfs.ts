/**
 * IPFS upload utilities using Pinata
 */

export interface IPFSUploadResult {
  hash: string;
  url: string;
}

/**
 * Uploads an image file to IPFS via Pinata
 * @param file - The image file to upload
 * @returns Promise with IPFS hash and URL
 */
export async function uploadImageToIPFS(file: File): Promise<IPFSUploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Using Pinata's public API (you should replace with your own API key)
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to IPFS');
    }

    const data = await response.json();
    const hash = data.IpfsHash;

    return {
      hash,
      url: `https://gateway.pinata.cloud/ipfs/${hash}`,
    };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

/**
 * Uploads JSON metadata to IPFS
 * @param metadata - The metadata object to upload
 * @returns Promise with IPFS hash and URL
 */
export async function uploadMetadataToIPFS(metadata: any): Promise<IPFSUploadResult> {
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error('Failed to upload metadata to IPFS');
    }

    const data = await response.json();
    const hash = data.IpfsHash;

    return {
      hash,
      url: `https://gateway.pinata.cloud/ipfs/${hash}`,
    };
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}

/**
 * Uploads a claim (image + description) to IPFS
 * @param image - The image file
 * @param description - The description text
 * @returns Promise with the IPFS hash of the metadata
 */
export async function uploadClaimToIPFS(
  image: File,
  description: string
): Promise<string> {
  try {
    // First, upload the image
    const imageResult = await uploadImageToIPFS(image);

    // Then, create and upload metadata containing both image hash and description
    const metadata = {
      image: imageResult.hash,
      imageUrl: imageResult.url,
      description,
      timestamp: Date.now(),
    };

    const metadataResult = await uploadMetadataToIPFS(metadata);

    // Return the metadata hash (this will be stored in the smart contract)
    return metadataResult.hash;
  } catch (error) {
    console.error('Error uploading claim to IPFS:', error);
    throw error;
  }
}

/**
 * Fetches claim data from IPFS
 * @param hash - The IPFS hash
 * @returns Promise with the claim data
 */
export async function fetchClaimFromIPFS(hash: string): Promise<{
  image: string;
  imageUrl: string;
  description: string;
  timestamp: number;
}> {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch claim from IPFS');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
}

