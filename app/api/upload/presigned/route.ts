import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/s3';
import { getBucketConfig } from '@/lib/aws-config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType, isPublic } = body;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'Missing fileName or contentType' },
        { status: 400 }
      );
    }

    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
      fileName,
      contentType,
      isPublic || false
    );

    // Generate public URL for public files
    let publicUrl: string | undefined;
    if (isPublic) {
      const { bucketName } = getBucketConfig();
      const region = process.env.AWS_REGION || 'us-east-1';
      publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
    }

    return NextResponse.json(
      {
        uploadUrl,
        cloud_storage_path,
        publicUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
