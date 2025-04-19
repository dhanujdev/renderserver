import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = join(__dirname, '..', 'storage');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Save resume data
export async function saveResume(id, data) {
  await ensureStorageDir();
  const filePath = join(STORAGE_DIR, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return data;
}

// Get resume data
export async function getResume(id) {
  try {
    const filePath = join(STORAGE_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

// Update resume data
export async function updateResume(id, updates) {
  const existing = await getResume(id);
  if (!existing) {
    throw new Error('Resume not found');
  }
  const updated = { ...existing, ...updates };
  return saveResume(id, updated);
} 