import { NextRequest, NextResponse } from 'next/server';
import { initiateMultipartUpload } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, isPublic } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: 'Missing fileName' },
        { status: 400 }
      );
    }

    const { uploadId, cloud_storage_path } = await initiateMultipartUpload(
      fileName,
      isPublic || false
    );

    return NextResponse.json(
      {
        uploadId,
        cloud_storage_path,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Multipart initiate error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initiate multipart upload' },
      { status: 500 }
    );
  }
}
