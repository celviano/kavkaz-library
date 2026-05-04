import { SellerBlock } from '@/widgets/seller-block'
import { BookPurchaseBlock } from '@/widgets/book-purchase'
import { EbookDownloadBlock } from '@/widgets/ebook-download/ui/EbookDownloadBlock'
import type { Book } from '@/entities/book'

interface BookSellerSectionProps {
  book: Book
}

export function BookSellerSection({ book }: BookSellerSectionProps) {
  const isEbook = book.bookType === 'ebook'

  return (
    <>
      {!isEbook && book.ownerId && (
        <div>
          <p className="text-[11px] font-medium tracking-[2px] uppercase text-accent mb-3">
            Продавец
          </p>
          <SellerBlock sellerId={book.ownerId} />
        </div>
      )}

      {isEbook ? <EbookDownloadBlock book={book} /> : <BookPurchaseBlock book={book} />}
    </>
  )
}
