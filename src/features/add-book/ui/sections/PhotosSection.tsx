import { FormField } from '@/shared/ui/FormField'
import { Dropzone, DropzoneEmptyState, DropzoneContent } from '@/shared/ui/Dropzone'
import { FormSection } from '../FormSection'
import type { useSupabaseUpload } from '@/shared/hooks/useSupabaseUpload'

interface PhotosSectionProps {
  coverUpload:  ReturnType<typeof useSupabaseUpload>
  imagesUpload: ReturnType<typeof useSupabaseUpload>
}

export function PhotosSection({ coverUpload, imagesUpload }: PhotosSectionProps) {
  return (
    <FormSection title="Фотографии">
      <FormField label="Обложка" hint="Главное фото книги. JPEG, PNG или WebP до 5 МБ">
        <Dropzone {...coverUpload}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </FormField>

      <FormField label="Дополнительные фото" hint="Фото разворотов, состояния переплёта. До 9 файлов">
        <Dropzone {...imagesUpload}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      </FormField>
    </FormSection>
  )
}
