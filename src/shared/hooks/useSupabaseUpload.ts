'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone, type DropzoneOptions, type FileRejection } from 'react-dropzone'
import { createClient } from '@/shared/lib/supabase/client'

export interface UploadedFile extends File {
  preview: string
  errors: { message: string }[]
}

export interface UseSupabaseUploadOptions {
  bucketName: string
  path?: string
  allowedMimeTypes?: string[]
  maxFiles?: number
  maxFileSize?: number
}

export interface UseSupabaseUploadReturn {
  files: UploadedFile[]
  setFiles: (files: UploadedFile[]) => void
  loading: boolean
  successes: string[]
  errors: { name: string; message: string }[]
  isSuccess: boolean
  isDragActive: boolean
  isDragReject: boolean
  maxFiles: number
  maxFileSize: number
  inputRef: React.RefObject<HTMLInputElement | null>
  getRootProps: ReturnType<typeof useDropzone>['getRootProps']
  getInputProps: ReturnType<typeof useDropzone>['getInputProps']
  onUpload: () => Promise<string[]>
}

export function useSupabaseUpload({
  bucketName,
  path = '',
  allowedMimeTypes = ['image/*'],
  maxFiles = 10,
  maxFileSize = 5 * 1024 * 1024, // 5MB
}: UseSupabaseUploadOptions): UseSupabaseUploadReturn {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(false)
  const [successes, setSuccesses] = useState<string[]>([])
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([])
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      const acceptedMapped: UploadedFile[] = accepted.map((f) =>
        Object.assign(f, { preview: URL.createObjectURL(f), errors: [] }),
      )
      const rejectedMapped: UploadedFile[] = rejected.map(({ file, errors: errs }) =>
        Object.assign(file, {
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
          errors: errs,
        }),
      )
      setFiles((prev) => [...prev, ...acceptedMapped, ...rejectedMapped])
    },
    [],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: allowedMimeTypes.reduce((acc, mime) => ({ ...acc, [mime]: [] }), {}),
    maxSize: maxFileSize,
    maxFiles,
  } as DropzoneOptions)

  const onUpload = useCallback(async (): Promise<string[]> => {
    const supabase = createClient()
    const validFiles = files.filter((f) => f.errors.length === 0)
    if (validFiles.length === 0) return []

    setLoading(true)
    const newSuccesses: string[] = []
    const newErrors: { name: string; message: string }[] = []
    const uploadedUrls: string[] = []

    await Promise.all(
      validFiles.map(async (file) => {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const filePath = path ? `${path}/${fileName}` : fileName

        const { error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, { upsert: true, cacheControl: '3600' })

        if (error) {
          newErrors.push({ name: file.name, message: error.message })
        } else {
          newSuccesses.push(file.name)
          const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
          uploadedUrls.push(data.publicUrl)
        }
      }),
    )

    setSuccesses(newSuccesses)
    setErrors(newErrors)
    setIsSuccess(newErrors.length === 0 && newSuccesses.length > 0)
    setLoading(false)
    return uploadedUrls
  }, [files, bucketName, path])

  return {
    files,
    setFiles,
    loading,
    successes,
    errors,
    isSuccess,
    isDragActive,
    isDragReject,
    maxFiles,
    maxFileSize,
    inputRef,
    getRootProps,
    getInputProps,
    onUpload,
  }
}
