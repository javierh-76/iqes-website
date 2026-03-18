import { NextRequest, NextResponse } from 'next/server';
import { getPresignedUrlForPart } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cloud_storage_path, uploadId, partNumber } = body;

    if (!cloud_storage_path || !uploadId || !partNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const presignedUrl = await getPresignedUrlForPart(
      cloud_storage_path,
      uploadId,
      partNumber
    );

    return NextResponse.json(
      {
        presignedUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get part URL error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get presigned URL for part' },
      { status: 500 }
    );
  }
}
