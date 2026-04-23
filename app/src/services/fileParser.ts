import type { UploadedFile } from '@/types'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'text/markdown',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp'
]

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: '文件大小超过10MB限制' }
  }

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return { valid: false, error: '不支持的文件类型' }
  }

  return { valid: true }
}

export async function parseFile(file: File): Promise<{ content: string; preview?: string }> {
  if (file.type === 'application/pdf') {
    return parsePdf(file)
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/msword'
  ) {
    return parseWord(file)
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel'
  ) {
    return parseExcel(file)
  }

  if (file.type.startsWith('image/')) {
    return parseImage(file)
  }

  // Text files
  return parseText(file)
}

async function parsePdf(file: File): Promise<{ content: string }> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(' ')
    text += pageText + '\n'
  }

  return { content: text.trim() }
}

async function parseWord(file: File): Promise<{ content: string }> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return { content: result.value.trim() }
}

async function parseExcel(file: File): Promise<{ content: string }> {
  const XLSX = await import('xlsx')
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })

  let text = ''
  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    text += `Sheet: ${sheetName}\n${csv}\n`
  })

  return { content: text.trim() }
}

async function parseImage(file: File): Promise<{ content: string; preview: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const preview = reader.result as string
      resolve({ content: `[图片: ${file.name}]`, preview })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function parseText(file: File): Promise<{ content: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({ content: reader.result as string })
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export async function processFiles(files: FileList): Promise<UploadedFile[]> {
  const uploadedFiles: UploadedFile[] = []

  for (let i = 0; i < Math.min(files.length, 5); i++) {
    const file = files[i]
    const validation = validateFile(file)

    if (!validation.valid) {
      throw new Error(`${file.name}: ${validation.error}`)
    }

    const parsed = await parseFile(file)

    uploadedFiles.push({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      size: file.size,
      content: parsed.content,
      preview: parsed.preview,
      uploadedAt: Date.now()
    })
  }

  return uploadedFiles
}
