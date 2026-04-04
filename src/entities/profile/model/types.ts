export interface ProfileRow {
  id:           string   // = auth.users.id
  display_name: string | null
  first_name:   string | null
  last_name:    string | null
  bio:          string | null
  city:         string | null
  country:      string | null
  avatar_url:   string | null
  website:      string | null
  born_year:    number | null
  created_at:   string
  updated_at:   string
}

export interface Profile {
  id:          string
  displayName: string | null
  firstName:   string | null
  lastName:    string | null
  bio:         string | null
  city:        string | null
  country:     string | null
  avatarUrl:   string | null
  website:     string | null
  bornYear:    number | null
  createdAt:   Date
  updatedAt:   Date
}

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id:          row.id,
    displayName: row.display_name,
    firstName:   row.first_name,
    lastName:    row.last_name,
    bio:         row.bio,
    city:        row.city,
    country:     row.country,
    avatarUrl:   row.avatar_url,
    website:     row.website,
    bornYear:    row.born_year,
    createdAt:   new Date(row.created_at),
    updatedAt:   new Date(row.updated_at),
  }
}

export function getFullName(profile: Profile | null): string | null {
  if (!profile) return null
  const parts = [profile.firstName, profile.lastName].filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  return profile.displayName
}
