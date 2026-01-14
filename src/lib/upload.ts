/**
 * Upload a file to S3 via API route
 * @param file - The file (from <input type="file"> or a Blob)
 * @returns The uploaded file data { secure_url, public_id }
 */
export const uploadFile = async (file: File | Blob) => {
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
    throw new Error(data.error || 'Failed to upload file');
  }

  return data; 
};
