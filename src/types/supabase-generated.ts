export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          tagline: string | null
          mission: string | null
          logo: string | null
          hero_image: string | null
          website: string | null
          email: string
          phone: string | null
          year_founded: number | null
          verified: boolean | null
          country: string
          region: string | null
          city: string | null
          address: string | null
          coordinates: unknown | null
          timezone: string | null
          nearest_airport: string | null
          status: string | null
          featured: boolean | null
          last_updated: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          name: string
          slug: string
          email: string
          country: string
          tagline?: string | null
          mission?: string | null
          logo?: string | null
          hero_image?: string | null
          website?: string | null
          phone?: string | null
          year_founded?: number | null
          verified?: boolean | null
          region?: string | null
          city?: string | null
          address?: string | null
          coordinates?: unknown | null
          timezone?: string | null
          nearest_airport?: string | null
          status?: string | null
          featured?: boolean | null
        }
        Update: {
          name?: string
          slug?: string
          email?: string
          country?: string
          tagline?: string | null
          mission?: string | null
          logo?: string | null
          hero_image?: string | null
          website?: string | null
          phone?: string | null
          year_founded?: number | null
          verified?: boolean | null
          region?: string | null
          city?: string | null
          address?: string | null
          coordinates?: unknown | null
          timezone?: string | null
          nearest_airport?: string | null
          status?: string | null
          featured?: boolean | null
        }
      }
      programs: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string | null
          is_primary: boolean | null
          duration_min_weeks: number
          duration_max_weeks: number | null
          hours_per_day: number
          days_per_week: number
          seasonality: string | null
          cost_amount: number | null
          cost_currency: string | null
          cost_period: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          organization_id: string
          title: string
          duration_min_weeks: number
          hours_per_day: number
          days_per_week: number
          description?: string | null
          is_primary?: boolean | null
          duration_max_weeks?: number | null
          seasonality?: string | null
          cost_amount?: number | null
          cost_currency?: string | null
          cost_period?: string | null
          status?: string | null
        }
        Update: {
          organization_id?: string
          title?: string
          duration_min_weeks?: number
          hours_per_day?: number
          days_per_week?: number
          description?: string | null
          is_primary?: boolean | null
          duration_max_weeks?: number | null
          seasonality?: string | null
          cost_amount?: number | null
          cost_currency?: string | null
          cost_period?: string | null
          status?: string | null
        }
      }
      testimonials: {
        Row: {
          id: string
          organization_id: string
          program_id: string | null
          volunteer_name: string
          volunteer_country: string
          volunteer_age: number | null
          avatar_url: string | null
          rating: number
          quote: string
          review_title: string | null
          full_review: string | null
          program_name: string | null
          duration_weeks: number | null
          experience_date: string | null
          verified: boolean | null
          featured: boolean | null
          moderation_status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          organization_id: string
          volunteer_name: string
          volunteer_country: string
          rating: number
          quote: string
          program_id?: string | null
          volunteer_age?: number | null
          avatar_url?: string | null
          review_title?: string | null
          full_review?: string | null
          program_name?: string | null
          duration_weeks?: number | null
          experience_date?: string | null
          verified?: boolean | null
          featured?: boolean | null
          moderation_status?: string | null
        }
        Update: {
          organization_id?: string
          volunteer_name?: string
          volunteer_country?: string
          rating?: number
          quote?: string
          program_id?: string | null
          volunteer_age?: number | null
          avatar_url?: string | null
          review_title?: string | null
          full_review?: string | null
          program_name?: string | null
          duration_weeks?: number | null
          experience_date?: string | null
          verified?: boolean | null
          featured?: boolean | null
          moderation_status?: string | null
        }
      }
    }
    Views: {
      organization_overview: {
        Row: {
          id: string
          name: string
          slug: string
          tagline: string | null
          mission: string | null
          logo: string | null
          hero_image: string | null
          website: string | null
          email: string
          phone: string | null
          year_founded: number | null
          verified: boolean | null
          country: string
          region: string | null
          city: string | null
          address: string | null
          coordinates: unknown | null
          timezone: string | null
          nearest_airport: string | null
          status: string | null
          featured: boolean | null
          last_updated: string | null
          created_at: string | null
          updated_at: string | null
          primary_program_id: string | null
          primary_program_title: string | null
          duration_min_weeks: number | null
          duration_max_weeks: number | null
          cost_amount: number | null
          cost_currency: string | null
          total_reviews: number | null
          average_rating: number | null
          volunteers_hosted: number | null
        }
      }
    }
  }
}