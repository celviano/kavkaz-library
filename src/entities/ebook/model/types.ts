export type EbookFormat = 'pdf' | 'epub' | 'djvu' | 'txt' | 'mobi'
export type EbookStatus = 'pending' | 'approved' | 'rejected'
export type CopyrightType = 'public_domain' | 'own_work' | 'permitted'

export const EBOOK_FORMAT_LABELS: Record<EbookFormat, string> = {
  pdf:  'PDF',
  epub: 'EPUB',
  djvu: 'DjVu',
  txt:  'TXT',
  mobi: 'MOBI',
}

export const EBOOK_STATUS_LABELS: Record<EbookStatus, string> = {
  pending:  'На рассмотрении',
  approved: 'Одобрена',
  rejected: 'Отклонена',
}

export const EBOOK_STATUS_COLORS: Record<EbookStatus, string> = {
  pending:  'bg-gold/10 text-gold border-gold/20',
  approved: 'bg-accent/10 text-accent border-accent/20',
  rejected: 'bg-red-50 text-red-500 border-red-200',
}

export const COPYRIGHT_LABELS: Record<CopyrightType, string> = {
  public_domain: 'Общественное достояние',
  own_work:      'Собственное произведение',
  permitted:     'Имею разрешение',
}

export const ALLOWED_EBOOK_FORMATS = ['pdf', 'epub', 'djvu', 'txt', 'mobi'] as const
export const MAX_EBOOK_SIZE = 50 * 1024 * 1024 // 50MB

export const ALLOWED_MIME_TYPES: Record<string, EbookFormat> = {
  'application/pdf':                         'pdf',
  'application/epub+zip':                    'epub',
  'image/vnd.djvu':                          'djvu',
  'image/x.djvu':                            'djvu',
  'text/plain':                              'txt',
  'application/x-mobipocket-ebook':          'mobi',
}

export interface EbookRow {
  id:               string
  title:            string
  author:           string
  year:             number | null
  category:         string
  description:      string | null
  file_url:         string
  file_name:        string
  file_format:      EbookFormat
  file_size:        number
  cover_url:        string | null
  user_id:          string
  status:           EbookStatus
  rejection_reason: string | null
  download_count:   number
  copyright_type:   CopyrightType
  created_at:       string
  updated_at:       string
}

export interface Ebook {
  id:              string
  title:           string
  author:          string
  year:            number | null
  category:        string
  description:     string | null
  fileUrl:         string
  fileName:        string
  fileFormat:      EbookFormat
  fileSize:        number
  coverUrl:        string | null
  userId:          string
  status:          EbookStatus
  rejectionReason: string | null
  downloadCount:   number
  copyrightType:   CopyrightType
  createdAt:       Date
  updatedAt:       Date
}

export function mapEbookRow(row: EbookRow): Ebook {
  return {
    id:              row.id,
    title:           row.title,
    author:          row.author,
    year:            row.year,
    category:        row.category,
    description:     row.description,
    fileUrl:         row.file_url,
    fileName:        row.file_name,
    fileFormat:      row.file_format,
    fileSize:        row.file_size,
    coverUrl:        row.cover_url,
    userId:          row.user_id,
    status:          row.status,
    rejectionReason: row.rejection_reason,
    downloadCount:   row.download_count,
    copyrightType:   row.copyright_type,
    createdAt:       new Date(row.created_at),
    updatedAt:       new Date(row.updated_at),
  }
}

export function getFormatFromFile(file: File): EbookFormat | null {
  const mime = file.type.toLowerCase()
  if (ALLOWED_MIME_TYPES[mime]) return ALLOWED_MIME_TYPES[mime]
  // fallback: по расширению
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (ext && ALLOWED_EBOOK_FORMATS.includes(ext as EbookFormat)) return ext as EbookFormat
  return null
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024)        return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}
