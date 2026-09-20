import { handleUpload } from '@vercel/blob/client';

export default async function handler(request) {
  try {
    const body = await request.json();

    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['image/png'],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            uploadedAt: Date.now()
          })
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.url);
      }
    });

    return Response.json(response);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error.message || 'Upload failed'
      },
      {
        status: 500
      }
    );
  }
}
