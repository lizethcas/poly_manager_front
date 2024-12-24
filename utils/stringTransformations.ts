export default function transformKey(key: string): string {
  return key
    .toLowerCase()
    .trim()
    .replace(/[:]/g, '')
    .replace(/\s+/g, '_')
    .replace(/^_+|_+$/g, '')
} 