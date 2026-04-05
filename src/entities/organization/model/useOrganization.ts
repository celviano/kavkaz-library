'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyOrganization,
  fetchOrganizationById,
  createOrganization,
} from '@/shared/lib/supabase/queries/organizations'
import type { CreateOrganizationData } from '@/shared/lib/supabase/queries/organizations'

export function useMyOrganization(ownerId: string | null) {
  return useQuery({
    queryKey: ['organization', 'my', ownerId],
    queryFn:  () => fetchMyOrganization(ownerId!),
    enabled:  Boolean(ownerId),
  })
}

export function useOrganization(id: string | null) {
  return useQuery({
    queryKey: ['organization', id],
    queryFn:  () => fetchOrganizationById(id!),
    enabled:  Boolean(id),
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
