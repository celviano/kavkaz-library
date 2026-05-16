'use client'

import type { CreateOrganizationData } from '@/shared/lib/supabase/queries/organizations'
import {
  createOrganization,
  fetchMyOrganization,
  fetchOrganizationById,
} from '@/shared/lib/supabase/queries/organizations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useMyOrganization(ownerId: string | null) {
  return useQuery({
    queryKey: ['organization', 'my', ownerId],
    queryFn: () => fetchMyOrganization(ownerId!),
    enabled: Boolean(ownerId),
  })
}

export function useOrganization(id: string | null) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn: () => fetchOrganizationById(id!),
    enabled: Boolean(id),
  })
}

export function useCreateOrganization() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOrganizationData) => createOrganization(data),
    onSuccess: (org) => {
      qc.setQueryData(['organization', 'my', org.ownerId], org)
    },
  })
}
