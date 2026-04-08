import type { Metadata } from 'next'
import { SellerPage } from '@/pages/seller'
import { fetchProfile } from '@/shared/lib/supabase/queries/profiles'
import { getFullName } from '@/entities/profile/model/types'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const profile = await fetchProfile(id)
  if (!profile) return { title: 'Продавец не найден' }
  const name = getFullName(profile) ?? 'Продавец'
  return {
    title:       name,
    description: `Книги продавца ${name} на KavkazLibrary — исторические книги о Кавказе и Закавказье.`,
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <SellerPage sellerId={id} />
}
