'use client'

import { memo, useCallback, useState } from 'react'
import type { Area, CropperProps, Point } from 'react-easy-crop'
import CropperLib from 'react-easy-crop'

// react-easy-crop uses React 18 class component types; cast for React 19 compatibility.
// Partial<CropperProps> because all required fields have defaultProps in the class.
const Cropper = CropperLib as unknown as React.ComponentType<Partial<CropperProps>>

import { getCroppedImg } from '@/shared/lib/cropImage'

import { Button } from './Button'

interface AvatarCropModalProps {
  open: boolean
  imageSrc: string
  onClose: () => void
  onApply: (blob: Blob) => void
  /** 'round' for avatars, 'rect' for banners. Default: 'round' */
  cropShape?: 'round' | 'rect'
  /** Crop area aspect ratio (w/h). Default: 1 */
  aspect?: number
  /** Modal title. Default: 'Редактировать фото' */
  title?: string
}

export const AvatarCropModal = memo<AvatarCropModalProps>(
  ({
    open,
    imageSrc,
    onClose,
    onApply,
    cropShape = 'round',
    aspect = 1,
    title = 'Редактировать фото',
  }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [applying, setApplying] = useState(false)

    const onCropComplete = useCallback((_: Area, pixels: Area) => {
      setCroppedAreaPixels(pixels)
    }, [])

    const handleApply = useCallback(async () => {
      if (!croppedAreaPixels) return
      setApplying(true)
      try {
        const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
        onApply(blob)
        onClose()
      } finally {
        setApplying(false)
      }
    }, [croppedAreaPixels, imageSrc, onApply, onClose])

    if (!open) return null

    return (
      <>
        {/* Backdrop — separate element so dialog has no onClick */}
        <div
          className="fixed inset-0 z-50 bg-dark/70 backdrop-blur-sm"
          aria-hidden="true"
          onClick={onClose}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        >
          {/* Card — wider for banner crop */}
          <div
            className={[
              'relative pointer-events-auto w-full bg-surface rounded-2xl shadow-accent-lg overflow-hidden flex flex-col',
              aspect > 2 ? 'max-w-xl' : 'max-w-sm',
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface2">
              <h2
                className="text-base font-semibold text-ink"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть"
                className="flex items-center justify-center w-8 h-8 rounded-full text-ash hover:text-ink hover:bg-surface2 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="3" x2="13" y2="13" />
                  <line x1="13" y1="3" x2="3" y2="13" />
                </svg>
              </button>
            </div>

            {/* Cropper area */}
            <div className="relative w-full bg-dark" style={{ height: 320 }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                minZoom={1}
                maxZoom={3}
                aspect={aspect}
                cropShape={cropShape}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                classes={{
                  containerClassName: 'rounded-none',
                  cropAreaClassName: 'border-2 border-bg/80',
                }}
              />
            </div>

            {/* Zoom slider */}
            <div className="px-5 py-4 flex items-center gap-3 border-t border-surface2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="text-ash shrink-0"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="5.5" />
                <line x1="4.5" y1="7" x2="9.5" y2="7" />
              </svg>

              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label="Масштаб"
                className="flex-1 h-1.5 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((zoom - 1) / 2) * 100}%, var(--color-surface3) ${((zoom - 1) / 2) * 100}%, var(--color-surface3) 100%)`,
                }}
              />

              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="text-ash shrink-0"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="5.5" />
                <line x1="7" y1="4.5" x2="7" y2="9.5" />
                <line x1="4.5" y1="7" x2="9.5" y2="7" />
              </svg>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 px-5 pb-5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={onClose}
              >
                Отмена
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="flex-1"
                disabled={applying}
                onClick={handleApply}
              >
                {applying ? 'Применяем...' : 'Применить'}
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  },
)

AvatarCropModal.displayName = 'AvatarCropModal'
