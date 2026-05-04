import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AddPhysicalBookValues } from '@/shared/lib/zod/schemas'
import type { BookType } from '@/features/add-book/ui/BookTypeToggle'
import type { CopyrightType } from '@/entities/ebook/model/types'

// ─── Add Book Draft Store ─────────────────────────────────────────────────────

interface AddBookDraft {
  bookType:      BookType
  values:        Partial<AddPhysicalBookValues>
  copyrightType: CopyrightType
}

interface AddBookStore extends AddBookDraft {
  setBookType:      (type: BookType) => void
  setValues:        (values: Partial<AddPhysicalBookValues>) => void
  setCopyrightType: (type: CopyrightType) => void
  reset:            () => void
}

const initialDraft: AddBookDraft = {
  bookType:      'physical',
  values:        {},
  copyrightType: 'public_domain',
}

export const useAddBookStore = create<AddBookStore>()(
  persist(
    (set) => ({
      ...initialDraft,
      setBookType:      (bookType) => set({ bookType }),
      setValues:        (values)   => set((s) => ({ values: { ...s.values, ...values } })),
      setCopyrightType: (type)     => set({ copyrightType: type }),
      reset:            ()         => set(initialDraft),
    }),
    {
      name:    'add-book-draft',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

// ─── UI Store (modals, sidebars, etc.) ───────────────────────────────────────

interface UIStore {
  requestModalBookId: string | null
  openRequestModal:   (bookId: string) => void
  closeRequestModal:  () => void
}

export const useUIStore = create<UIStore>()((set) => ({
  requestModalBookId: null,
  openRequestModal:   (bookId) => set({ requestModalBookId: bookId }),
  closeRequestModal:  ()       => set({ requestModalBookId: null }),
}))
