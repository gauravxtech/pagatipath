export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          id: string
          interview_scheduled_at: string | null
          opportunity_id: string
          recruiter_feedback: string | null
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          interview_scheduled_at?: string | null
          opportunity_id: string
          recruiter_feedback?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          interview_scheduled_at?: string | null
          opportunity_id?: string
          recruiter_feedback?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string | null
          created_at: string
          description: string | null
          id: string
          issued_at: string
          issued_by: string | null
          student_id: string
          title: string
          type: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          student_id: string
          title: string
          type: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          issued_at?: string
          issued_by?: string | null
          student_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      college_rankings: {
        Row: {
          average_package: number | null
          college_id: string
          companies_visited: number | null
          created_at: string
          highest_package: number | null
          id: string
          placement_rate: number | null
          rank: number | null
          students_placed: number | null
          year: number
        }
        Insert: {
          average_package?: number | null
          college_id: string
          companies_visited?: number | null
          created_at?: string
          highest_package?: number | null
          id?: string
          placement_rate?: number | null
          rank?: number | null
          students_placed?: number | null
          year: number
        }
        Update: {
          average_package?: number | null
          college_id?: string
          companies_visited?: number | null
          created_at?: string
          highest_package?: number | null
          id?: string
          placement_rate?: number | null
          rank?: number | null
          students_placed?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "college_rankings_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      college_tpo: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          college_id: string | null
          college_registration_number: string
          created_at: string
          email: string
          id: string
          mobile_number: string
          tpo_full_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          college_id?: string | null
          college_registration_number: string
          created_at?: string
          email: string
          id?: string
          mobile_number: string
          tpo_full_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          college_id?: string | null
          college_registration_number?: string
          created_at?: string
          email?: string
          id?: string
          mobile_number?: string
          tpo_full_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "college_tpo_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          address: string | null
          approved: boolean | null
          approved_by: string | null
          code: string
          created_at: string
          created_by: string | null
          district: string
          email: string | null
          id: string
          name: string
          phone: string | null
          state: string
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          approved?: boolean | null
          approved_by?: string | null
          code: string
          created_at?: string
          created_by?: string | null
          district: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          state: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          approved?: boolean | null
          approved_by?: string | null
          code?: string
          created_at?: string
          created_by?: string | null
          district?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          state?: string
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      department_coordinators: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          college_id: string
          coordinator_name: string
          created_at: string
          department_id: string | null
          department_name: string
          email: string
          id: string
          mobile_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          college_id: string
          coordinator_name: string
          created_at?: string
          department_id?: string | null
          department_name: string
          email: string
          id?: string
          mobile_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          college_id?: string
          coordinator_name?: string
          created_at?: string
          department_id?: string | null
          department_name?: string
          email?: string
          id?: string
          mobile_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "department_coordinators_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "department_coordinators_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          code: string
          college_id: string
          coordinator_id: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          code: string
          college_id: string
          coordinator_id?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          code?: string
          college_id?: string
          coordinator_id?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      dto_officers: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          created_at: string
          district: string
          district_officer_id: string
          email: string
          full_name: string
          id: string
          mobile_number: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          district: string
          district_officer_id: string
          email: string
          full_name: string
          id?: string
          mobile_number: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          district?: string
          district_officer_id?: string
          email?: string
          full_name?: string
          id?: string
          mobile_number?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          interviewer_name: string | null
          location: string | null
          meeting_link: string | null
          rating: number | null
          scheduled_at: string
          status: string | null
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          rating?: number | null
          scheduled_at: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interviewer_name?: string | null
          location?: string | null
          meeting_link?: string | null
          rating?: number | null
          scheduled_at?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nto_officers: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          mobile_number: string
          national_officer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          mobile_number: string
          national_officer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          mobile_number?: string
          national_officer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          active: boolean | null
          created_at: string
          created_by: string | null
          deadline: string | null
          department: string | null
          description: string | null
          duration_months: number | null
          id: string
          location: string | null
          positions_available: number | null
          recruiter_id: string
          requirements: Json | null
          skills_required: string[] | null
          stipend_max: number | null
          stipend_min: number | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          department?: string | null
          description?: string | null
          duration_months?: number | null
          id?: string
          location?: string | null
          positions_available?: number | null
          recruiter_id: string
          requirements?: Json | null
          skills_required?: string[] | null
          stipend_max?: number | null
          stipend_min?: number | null
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          department?: string | null
          description?: string | null
          duration_months?: number | null
          id?: string
          location?: string | null
          positions_available?: number | null
          recruiter_id?: string
          requirements?: Json | null
          skills_required?: string[] | null
          stipend_max?: number | null
          stipend_min?: number | null
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "public_recruiters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiters"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_drives: {
        Row: {
          college_id: string | null
          companies_invited: string[] | null
          created_at: string
          department_id: string | null
          description: string | null
          end_date: string
          id: string
          organizer_id: string
          participants_count: number | null
          start_date: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          college_id?: string | null
          companies_invited?: string[] | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          end_date: string
          id?: string
          organizer_id: string
          participants_count?: number | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          college_id?: string | null
          companies_invited?: string[] | null
          created_at?: string
          department_id?: string | null
          description?: string | null
          end_date?: string
          id?: string
          organizer_id?: string
          participants_count?: number | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "placement_drives_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "placement_drives_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      recruiters: {
        Row: {
          approved_by: string | null
          company_name: string
          company_website: string | null
          contact_person: string
          created_at: string
          email: string
          id: string
          industry: string | null
          kyc_documents: Json | null
          mobile_number: string | null
          phone: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          approved_by?: string | null
          company_name: string
          company_website?: string | null
          contact_person: string
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          kyc_documents?: Json | null
          mobile_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          approved_by?: string | null
          company_name?: string
          company_website?: string | null
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          kyc_documents?: Json | null
          mobile_number?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      sto_officers: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          mobile_number: string
          state: string
          state_officer_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          mobile_number: string
          state: string
          state_officer_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          mobile_number?: string
          state?: string
          state_officer_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          abc_id: string
          approved: boolean | null
          approved_by: string | null
          certificates: Json | null
          college_id: string | null
          created_at: string
          department_id: string | null
          district: string | null
          dob: string | null
          domains_interested: string[] | null
          education: Json | null
          email: string
          employability_score: number | null
          enrollment_number: string | null
          experience: Json | null
          full_name: string
          gender: string | null
          id: string
          mobile_number: string | null
          phone: string | null
          placed: boolean | null
          profile_completed: boolean | null
          resume_url: string | null
          skills: string[] | null
          state: string | null
          updated_at: string
          user_id: string
          year_semester: string | null
        }
        Insert: {
          abc_id: string
          approved?: boolean | null
          approved_by?: string | null
          certificates?: Json | null
          college_id?: string | null
          created_at?: string
          department_id?: string | null
          district?: string | null
          dob?: string | null
          domains_interested?: string[] | null
          education?: Json | null
          email: string
          employability_score?: number | null
          enrollment_number?: string | null
          experience?: Json | null
          full_name: string
          gender?: string | null
          id?: string
          mobile_number?: string | null
          phone?: string | null
          placed?: boolean | null
          profile_completed?: boolean | null
          resume_url?: string | null
          skills?: string[] | null
          state?: string | null
          updated_at?: string
          user_id: string
          year_semester?: string | null
        }
        Update: {
          abc_id?: string
          approved?: boolean | null
          approved_by?: string | null
          certificates?: Json | null
          college_id?: string | null
          created_at?: string
          department_id?: string | null
          district?: string | null
          dob?: string | null
          domains_interested?: string[] | null
          education?: Json | null
          email?: string
          employability_score?: number | null
          enrollment_number?: string | null
          experience?: Json | null
          full_name?: string
          gender?: string | null
          id?: string
          mobile_number?: string | null
          phone?: string | null
          placed?: boolean | null
          profile_completed?: boolean | null
          resume_url?: string | null
          skills?: string[] | null
          state?: string | null
          updated_at?: string
          user_id?: string
          year_semester?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          status: string | null
          student_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          student_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          status?: string | null
          student_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          approved: boolean | null
          approved_by: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          approved?: boolean | null
          approved_by?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_recruiters: {
        Row: {
          company_name: string | null
          company_website: string | null
          id: string | null
          industry: string | null
          verified: boolean | null
        }
        Insert: {
          company_name?: string | null
          company_website?: string | null
          id?: string | null
          industry?: string | null
          verified?: boolean | null
        }
        Update: {
          company_name?: string | null
          company_website?: string | null
          id?: string | null
          industry?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_employability_score: {
        Args: { student_id_param: string }
        Returns: number
      }
      create_notification: {
        Args: {
          action_url_param?: string
          message_param: string
          title_param: string
          type_param?: string
          user_id_param: string
        }
        Returns: string
      }
      get_pending_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      track_event: {
        Args: {
          entity_id_param?: string
          entity_type_param?: string
          event_type_param: string
          metadata_param?: Json
          user_id_param?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "student"
        | "dept_coordinator"
        | "college_placement"
        | "recruiter"
        | "dto"
        | "sto"
        | "nto"
        | "admin"
      application_status:
        | "applied"
        | "under_review"
        | "interview_scheduled"
        | "interviewed"
        | "offered"
        | "accepted"
        | "rejected"
        | "withdrawn"
      opportunity_type: "job" | "internship" | "training" | "project"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "student",
        "dept_coordinator",
        "college_placement",
        "recruiter",
        "dto",
        "sto",
        "nto",
        "admin",
      ],
      application_status: [
        "applied",
        "under_review",
        "interview_scheduled",
        "interviewed",
        "offered",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      opportunity_type: ["job", "internship", "training", "project"],
    },
  },
} as const
