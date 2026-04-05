import type { Metadata } from 'next'
import { SellerPage } from '@/pages/seller'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Продавец` }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <SellerPage sellerId={id} />
}
