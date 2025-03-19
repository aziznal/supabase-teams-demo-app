export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      project: {
        Row: {
          project_content: string
          project_id: string
          project_name: string
        }
        Insert: {
          project_content?: string
          project_id?: string
          project_name?: string
        }
        Update: {
          project_content?: string
          project_id?: string
          project_name?: string
        }
        Relationships: []
      }
      team: {
        Row: {
          team_id: string
          team_name: string
        }
        Insert: {
          team_id?: string
          team_name?: string
        }
        Update: {
          team_id?: string
          team_name?: string
        }
        Relationships: []
      }
      team_projects: {
        Row: {
          team_projects_project_id: string
          team_projects_team_id: string
        }
        Insert: {
          team_projects_project_id: string
          team_projects_team_id: string
        }
        Update: {
          team_projects_project_id?: string
          team_projects_team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_projects_team_projects_project_id_project_project_id_fk"
            columns: ["team_projects_project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "team_projects_team_projects_project_id_project_project_id_fk"
            columns: ["team_projects_project_id"]
            isOneToOne: false
            referencedRelation: "user_projects_view"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "team_projects_team_projects_team_id_team_team_id_fk"
            columns: ["team_projects_team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["team_id"]
          },
        ]
      }
      team_users: {
        Row: {
          team_users_team_id: string
          team_users_user_id: string
          team_users_user_role: Database["public"]["Enums"]["user_team_role"]
        }
        Insert: {
          team_users_team_id: string
          team_users_user_id: string
          team_users_user_role: Database["public"]["Enums"]["user_team_role"]
        }
        Update: {
          team_users_team_id?: string
          team_users_user_id?: string
          team_users_user_role?: Database["public"]["Enums"]["user_team_role"]
        }
        Relationships: [
          {
            foreignKeyName: "team_users_team_users_team_id_team_team_id_fk"
            columns: ["team_users_team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "team_users_team_users_user_id_users_id_fk"
            columns: ["team_users_user_id"]
            isOneToOne: false
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          user_full_name: string
          user_id: string
        }
        Insert: {
          user_full_name: string
          user_id: string
        }
        Update: {
          user_full_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_projects_view: {
        Row: {
          project_content: string | null
          project_id: string | null
          project_name: string | null
          team_name: string | null
          team_users_team_id: string | null
          team_users_user_role:
            | Database["public"]["Enums"]["user_team_role"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "team_users_team_users_team_id_team_team_id_fk"
            columns: ["team_users_team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["team_id"]
          },
        ]
      }
      user_teams_view: {
        Row: {
          projectsCount: number | null
          team_name: string | null
          team_users_team_id: string | null
          team_users_user_role:
            | Database["public"]["Enums"]["user_team_role"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "team_users_team_users_team_id_team_team_id_fk"
            columns: ["team_users_team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["team_id"]
          },
        ]
      }
      users_view: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_team_role: "member" | "admin" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
