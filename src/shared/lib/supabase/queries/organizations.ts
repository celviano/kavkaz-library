import { createClient } from '@/shared/lib/supabase/client'
import { mapOrganizationRow } from '@/entities/organization/model/types'
import type { OrganizationRow, Organization } from '@/entities/organization/model/types'

export async function fetchMyOrganization(ownerId: string): Promise<Organization | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('owner_id', ownerId)
    .single()

  if (error) return null
  return mapOrganizationRow(data as OrganizationRow)
}

export async function fetchOrganizationById(id: string): Promise<Organization | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapOrganizationRow(data as OrganizationRow)
}

export interface CreateOrganizationData {
  name:        string
  description: string
  website:     string
  email:       string
  phone:       string
  city:        string
  address:     string
  inn:         string
  logoUrl:     string
}

export async function createOrganization(data: CreateOrganizationData): Promise<Organization> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Необходима авторизация')

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({
      owner_id:    user.id,
      name:        data.name.trim(),
      description: data.description.trim() || null,
      website:     data.website.trim() || null,
      email:       data.email.trim() || null,
      phone:       data.phone.trim() || null,
      city:        data.city.trim() || null,
      address:     data.address.trim() || null,
      inn:         data.inn.trim() || null,
      logo_url:    data.logoUrl || null,
      is_verified: false,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  // Upgrade user role to seller
  await supabase
    .from('profiles')
    .update({ role: 'seller' })
    .eq('id', user.id)

  return mapOrganizationRow(org as OrganizationRow)
}
