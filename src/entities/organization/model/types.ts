export interface OrganizationRow {
  id:          string
  owner_id:    string
  name:        string
  description: string | null
  logo_url:    string | null
  website:     string | null
  email:       string | null
  phone:       string | null
  city:        string | null
  address:     string | null
  inn:         string | null
  is_verified: boolean
  created_at:  string
}

export interface Organization {
  id:          string
  ownerId:     string
  name:        string
  description: string | null
  logoUrl:     string | null
  website:     string | null
  email:       string | null
  phone:       string | null
  city:        string | null
  address:     string | null
  inn:         string | null
  isVerified:  boolean
  createdAt:   Date
}

export function mapOrganizationRow(row: OrganizationRow): Organization {
  return {
    id:          row.id,
    ownerId:     row.owner_id,
    name:        row.name,
    description: row.description,
    logoUrl:     row.logo_url,
    website:     row.website,
    email:       row.email,
    phone:       row.phone,
    city:        row.city,
    address:     row.address,
    inn:         row.inn,
    isVerified:  row.is_verified,
    createdAt:   new Date(row.created_at),
  }
}
