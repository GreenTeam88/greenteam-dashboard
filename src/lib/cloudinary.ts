/**
 * Upload an image to S3 via API route
 * @param file - The image file (from <input type="file"> or a Blob)
 * @returns The uploaded image data { secure_url, public_id }
 */
export const uploadToCloudinary = async (file: File | Blob) => {
  if (!file) throw new Error('No file provided');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Upload failed:', data);
    throw new Error(data.error || 'Failed to upload image');
  }

  return data; // Contains { secure_url, public_id }
};
