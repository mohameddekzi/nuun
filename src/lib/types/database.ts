export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: { id: string; name: string; description: string | null; permissions: Json; created_at: string };
        Insert: { id?: string; name: string; description?: string | null; permissions?: Json; created_at?: string };
        Update: { id?: string; name?: string; description?: string | null; permissions?: Json };
      };
      profiles: {
        Row: { id: string; email: string | null; full_name: string | null; avatar_url: string | null; role_id: string | null; is_active: boolean; last_login: string | null; created_at: string; updated_at: string };
        Insert: { id: string; email?: string | null; full_name?: string | null; avatar_url?: string | null; role_id?: string | null; is_active?: boolean };
        Update: { email?: string | null; full_name?: string | null; avatar_url?: string | null; role_id?: string | null; is_active?: boolean };
      };
      settings: {
        Row: { id: string; key: string; value: Json; category: string; created_at: string; updated_at: string };
        Insert: { id?: string; key: string; value: Json; category?: string };
        Update: { key?: string; value?: Json; category?: string };
      };
      pages: {
        Row: { id: string; slug: string; title: string; description: string | null; content: Json; seo_title: string | null; seo_description: string | null; og_image: string | null; is_published: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; title: string; description?: string | null; content?: Json; seo_title?: string | null; seo_description?: string | null; og_image?: string | null; is_published?: boolean };
        Update: { slug?: string; title?: string; description?: string | null; content?: Json; seo_title?: string | null; seo_description?: string | null; og_image?: string | null; is_published?: boolean };
      };
      services: {
        Row: { id: string; title: string; slug: string | null; short_description: string | null; description: string | null; icon: string | null; image_url: string | null; features: Json; order_index: number; is_active: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; slug?: string | null; short_description?: string | null; description?: string | null; icon?: string | null; image_url?: string | null; features?: Json; order_index?: number; is_active?: boolean };
        Update: { title?: string; slug?: string | null; short_description?: string | null; description?: string | null; icon?: string | null; image_url?: string | null; features?: Json; order_index?: number; is_active?: boolean };
      };
      project_categories: {
        Row: { id: string; name: string; slug: string | null; created_at: string };
        Insert: { id?: string; name: string; slug?: string | null };
        Update: { name?: string; slug?: string | null };
      };
      projects: {
        Row: { id: string; title: string; slug: string | null; description: string | null; client: string | null; category_id: string | null; cover_image: string | null; images: Json; tags: Json; year: number | null; is_featured: boolean; is_active: boolean; order_index: number; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; slug?: string | null; description?: string | null; client?: string | null; category_id?: string | null; cover_image?: string | null; images?: Json; tags?: Json; year?: number | null; is_featured?: boolean; is_active?: boolean; order_index?: number };
        Update: { title?: string; slug?: string | null; description?: string | null; client?: string | null; category_id?: string | null; cover_image?: string | null; images?: Json; tags?: Json; year?: number | null; is_featured?: boolean; is_active?: boolean; order_index?: number };
      };
      testimonials: {
        Row: { id: string; name: string; position: string | null; company: string | null; avatar_url: string | null; content: string; rating: number; video_url: string | null; is_featured: boolean; is_active: boolean; order_index: number; created_at: string };
        Insert: { id?: string; name: string; position?: string | null; company?: string | null; avatar_url?: string | null; content: string; rating?: number; video_url?: string | null; is_featured?: boolean; is_active?: boolean; order_index?: number };
        Update: { name?: string; position?: string | null; company?: string | null; avatar_url?: string | null; content?: string; rating?: number; video_url?: string | null; is_featured?: boolean; is_active?: boolean; order_index?: number };
      };
      pricing_plans: {
        Row: { id: string; name: string; slug: string | null; description: string | null; price: number | null; currency: string; period: string; features: Json; is_popular: boolean; is_active: boolean; order_index: number; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; slug?: string | null; description?: string | null; price?: number | null; currency?: string; period?: string; features?: Json; is_popular?: boolean; is_active?: boolean; order_index?: number };
        Update: { name?: string; slug?: string | null; description?: string | null; price?: number | null; currency?: string; period?: string; features?: Json; is_popular?: boolean; is_active?: boolean; order_index?: number };
      };
      faq: {
        Row: { id: string; question: string; answer: string; category: string; order_index: number; is_active: boolean; created_at: string };
        Insert: { id?: string; question: string; answer: string; category?: string; order_index?: number; is_active?: boolean };
        Update: { question?: string; answer?: string; category?: string; order_index?: number; is_active?: boolean };
      };
      blog_categories: {
        Row: { id: string; name: string; slug: string | null; description: string | null; created_at: string };
        Insert: { id?: string; name: string; slug?: string | null; description?: string | null };
        Update: { name?: string; slug?: string | null; description?: string | null };
      };
      blog_posts: {
        Row: { id: string; title: string; slug: string | null; excerpt: string | null; content: string | null; cover_image: string | null; author_id: string | null; category_id: string | null; tags: Json; is_published: boolean; is_featured: boolean; view_count: number; read_time: number; seo_title: string | null; seo_description: string | null; published_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; slug?: string | null; excerpt?: string | null; content?: string | null; cover_image?: string | null; author_id?: string | null; category_id?: string | null; tags?: Json; is_published?: boolean; is_featured?: boolean; view_count?: number; read_time?: number; seo_title?: string | null; seo_description?: string | null; published_at?: string | null };
        Update: { title?: string; slug?: string | null; excerpt?: string | null; content?: string | null; cover_image?: string | null; author_id?: string | null; category_id?: string | null; tags?: Json; is_published?: boolean; is_featured?: boolean; view_count?: number; read_time?: number; seo_title?: string | null; seo_description?: string | null; published_at?: string | null };
      };
      contact_messages: {
        Row: { id: string; name: string; email: string; phone: string | null; company: string | null; subject: string | null; message: string; service: string | null; status: string; is_read: boolean; created_at: string };
        Insert: { id?: string; name: string; email: string; phone?: string | null; company?: string | null; subject?: string | null; message: string; service?: string | null; status?: string; is_read?: boolean };
        Update: { name?: string; email?: string; phone?: string | null; company?: string | null; subject?: string | null; message?: string; service?: string | null; status?: string; is_read?: boolean };
      };
      subscribers: {
        Row: { id: string; email: string; name: string | null; is_active: boolean; created_at: string };
        Insert: { id?: string; email: string; name?: string | null; is_active?: boolean };
        Update: { email?: string; name?: string | null; is_active?: boolean };
      };
      media: {
        Row: { id: string; name: string; file_path: string; file_url: string; file_type: string | null; file_size: number | null; folder: string; alt_text: string | null; caption: string | null; uploaded_by: string | null; created_at: string };
        Insert: { id?: string; name: string; file_path: string; file_url: string; file_type?: string | null; file_size?: number | null; folder?: string; alt_text?: string | null; caption?: string | null; uploaded_by?: string | null };
        Update: { name?: string; file_path?: string; file_url?: string; file_type?: string | null; file_size?: number | null; folder?: string; alt_text?: string | null; caption?: string | null };
      };
      team_members: {
        Row: { id: string; name: string; position: string | null; bio: string | null; avatar_url: string | null; social_links: Json; order_index: number; is_active: boolean; created_at: string };
        Insert: { id?: string; name: string; position?: string | null; bio?: string | null; avatar_url?: string | null; social_links?: Json; order_index?: number; is_active?: boolean };
        Update: { name?: string; position?: string | null; bio?: string | null; avatar_url?: string | null; social_links?: Json; order_index?: number; is_active?: boolean };
      };
      sections: {
        Row: { id: string; page_id: string | null; type: string; title: string | null; content: Json; order_index: number; is_visible: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; page_id?: string | null; type: string; title?: string | null; content?: Json; order_index?: number; is_visible?: boolean };
        Update: { page_id?: string | null; type?: string; title?: string | null; content?: Json; order_index?: number; is_visible?: boolean };
      };
      analytics: {
        Row: { id: string; page: string; referrer: string | null; user_agent: string | null; country: string | null; created_at: string };
        Insert: { id?: string; page: string; referrer?: string | null; user_agent?: string | null; country?: string | null };
        Update: { page?: string; referrer?: string | null; user_agent?: string | null; country?: string | null };
      };
    };
  };
}

export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectCategory = Database["public"]["Tables"]["project_categories"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type PricingPlan = Database["public"]["Tables"]["pricing_plans"]["Row"];
export type FAQ = Database["public"]["Tables"]["faq"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type BlogCategory = Database["public"]["Tables"]["blog_categories"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];
export type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
export type Setting = Database["public"]["Tables"]["settings"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type Media = Database["public"]["Tables"]["media"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Role = Database["public"]["Tables"]["roles"]["Row"];
