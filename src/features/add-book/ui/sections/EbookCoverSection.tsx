import type { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/shared/ui/Dropzone'
import { FormField } from '@/shared/ui/FormField'

import { FormSection } from '../FormSection'

interface EbookCoverSectionProps {
  coverUpload: ReturnType<typeof useSupabaseUpload>
}

export function EbookCoverSection({ coverUpload }: EbookCoverSectionProps) {
  return (
    <FormSection title="Обложка">
      <FormField
        label="Обложка книги"
        hint="Главное фото книги. JPEG, PNG или WebP до 5 МБ"
      >
        <Dropzone {...coverUpload}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </FormField>
    </FormSection>
  )
}
