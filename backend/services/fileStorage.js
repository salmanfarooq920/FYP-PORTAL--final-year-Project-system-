// File storage service - Local in-memory storage (MongoDB can be used for metadata)
// This is a stub implementation for development
export async function uploadFile(buffer, filename, pathPrefix = 'uploads') {
  return { url: `https://example.com/stub/${pathPrefix}/${Date.now()}-${filename}`, path: `${pathPrefix}/${Date.now()}-${filename}` };
}
