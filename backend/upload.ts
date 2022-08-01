import formidable from 'formidable'
import { mkdirSync } from 'fs'

export let uploadDir = 'uploads'

mkdirSync(uploadDir, { recursive: true })

export let form = formidable({
  uploadDir,
  allowEmptyFiles: false,
  maxFiles: 1,
  maxFileSize: 10 * 1024 ** 2, //max file size - 10MB
  keepExtensions: true,
  filter: (part) => part.mimetype?.startsWith('image/') || false,
})

export function extractSingleFile(
  file: formidable.File[] | formidable.File,
): formidable.File | undefined {
  return Array.isArray(file) ? file[0] : file
}
