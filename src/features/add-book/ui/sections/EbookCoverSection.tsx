import { FormField } from '@/shared/ui/FormField'
import { Dropzone, DropzoneEmptyState, DropzoneContent } from '@/shared/ui/Dropzone'
import { FormSection } from '../FormSection'
import type { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'

interface EbookCoverSectionProps {
  coverUpload: ReturnType<typeof useSupabaseUpload>
}

export function EbookCoverSection({ coverUpload }: EbookCoverSectionProps) {
  return (
    <FormSection title="Обложка">
      <FormField label="Обложка книги" hint="Главное фото книги. JPEG, PNG или WebP до 5 МБ">
        <Dropzone {...coverUpload}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </FormField>
    </FormSection>
  )
}
