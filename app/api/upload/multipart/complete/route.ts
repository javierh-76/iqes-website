import { NextRequest, NextResponse } from 'next/server';
import { completeMultipartUpload } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cloud_storage_path, uploadId, parts } = body;

    if (!cloud_storage_path || !uploadId || !parts) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await completeMultipartUpload(cloud_storage_path, uploadId, parts);

    return NextResponse.json(
      {
        message: 'Multipart upload completed successfully',
        cloud_storage_path,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Complete multipart error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to complete multipart upload' },
      { status: 500 }
    );
  }
}
