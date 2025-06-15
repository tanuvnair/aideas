import { supabase } from "~/lib/supabase";

// Types for AIdea
export interface AIdea {
  id: number;
  title: string;
  content: any; // JSONB field - can store notes content, drawing data, etc.
  tags: string[]; // JSONB field stored as string array
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAIdeaInput {
  title: string;
  content?: any;
  tags?: string[];
}

export interface UpdateAIdeaInput {
  title?: string;
  content?: any;
  tags?: string[];
}

export interface AIdeaFilters {
  tags?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

// CRUD Helper Class
export class AIdeaService {
  // Create a new AIdea
  static async create(
    input: CreateAIdeaInput
  ): Promise<{ data: AIdea | null; error: string | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("aideas")
        .insert([
          {
            title: input.title,
            content: input.content || {},
            tags: input.tags || [],
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating AIdea:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error creating AIdea:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  // Get all AIdeas for the current user
  static async getAll(
    filters?: AIdeaFilters
  ): Promise<{ data: AIdea[] | null; error: string | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: "User not authenticated" };
      }

      let query = supabase
        .from("aideas")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.tags && filters.tags.length > 0) {
          // Use JSONB containment operator for tags
          query = query.contains("tags", filters.tags);
        }

        if (filters.search) {
          // Search in title and content (content is JSONB, so we'll search for text within it)
          query = query.or(
            `title.ilike.%${filters.search}%,content::text.ilike.%${filters.search}%`
          );
        }

        if (filters.limit) {
          query = query.limit(filters.limit);
        }

        if (filters.offset) {
          query = query.range(
            filters.offset,
            filters.offset + (filters.limit || 10) - 1
          );
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching AIdeas:", error);
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      console.error("Unexpected error fetching AIdeas:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  // Get recent AIdeas (last 5)
  static async getRecent(): Promise<{
    data: AIdea[] | null;
    error: string | null;
  }> {
    return this.getAll({ limit: 5 });
  }

  // Get a single AIdea by ID
  static async getById(
    id: number
  ): Promise<{ data: AIdea | null; error: string | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("aideas")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching AIdea:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error fetching AIdea:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  // Update an AIdea
  static async update(
    id: number,
    input: UpdateAIdeaInput
  ): Promise<{ data: AIdea | null; error: string | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: "User not authenticated" };
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (input.title !== undefined) updateData.title = input.title;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.tags !== undefined) updateData.tags = input.tags;

      const { data, error } = await supabase
        .from("aideas")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating AIdea:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error updating AIdea:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  // Delete an AIdea
  static async delete(
    id: number
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const { error } = await supabase
        .from("aideas")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting AIdea:", error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error("Unexpected error deleting AIdea:", err);
      return { success: false, error: "An unexpected error occurred" };
    }
  }

  // Search AIdeas
  static async search(
    query: string
  ): Promise<{ data: AIdea[] | null; error: string | null }> {
    return this.getAll({ search: query });
  }

  // Get AIdeas by tags
  static async getByTags(
    tags: string[]
  ): Promise<{ data: AIdea[] | null; error: string | null }> {
    return this.getAll({ tags });
  }

  // Get statistics
  static async getStats(): Promise<{
    data: {
      total: number;
      recentCount: number;
      tagsCount: number;
    } | null;
    error: string | null;
  }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: "User not authenticated" };
      }

      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from("aideas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (totalError) {
        console.error("Error getting total count:", totalError);
        return { data: null, error: totalError.message };
      }

      // Get recent count (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: recentCount, error: recentError } = await supabase
        .from("aideas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString());

      if (recentError) {
        console.error("Error getting recent count:", recentError);
        return { data: null, error: recentError.message };
      }

      // Get unique tags count
      const { data: allIdeas, error: tagsError } = await supabase
        .from("aideas")
        .select("tags")
        .eq("user_id", user.id);

      if (tagsError) {
        console.error("Error getting tags:", tagsError);
        return { data: null, error: tagsError.message };
      }

      const uniqueTags = new Set();
      allIdeas?.forEach((idea) => {
        if (Array.isArray(idea.tags)) {
          idea.tags.forEach((tag) => uniqueTags.add(tag));
        }
      });

      return {
        data: {
          total: totalCount || 0,
          recentCount: recentCount || 0,
          tagsCount: uniqueTags.size,
        },
        error: null,
      };
    } catch (err) {
      console.error("Unexpected error getting stats:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  // Get all unique tags for the user
  static async getAllTags(): Promise<{
    data: string[] | null;
    error: string | null;
  }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("aideas")
        .select("tags")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching tags:", error);
        return { data: null, error: error.message };
      }

      const uniqueTags = new Set<string>();
      data?.forEach((idea) => {
        if (Array.isArray(idea.tags)) {
          idea.tags.forEach((tag) => uniqueTags.add(tag));
        }
      });

      return { data: Array.from(uniqueTags).sort(), error: null };
    } catch (err) {
      console.error("Unexpected error fetching tags:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  // Batch operations
  static async createMultiple(
    inputs: CreateAIdeaInput[]
  ): Promise<{ data: AIdea[] | null; error: string | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: null, error: "User not authenticated" };
      }

      const insertData = inputs.map((input) => ({
        title: input.title,
        content: input.content || {},
        tags: input.tags || [],
        user_id: user.id,
      }));

      const { data, error } = await supabase
        .from("aideas")
        .insert(insertData)
        .select();

      if (error) {
        console.error("Error creating multiple AIdeas:", error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error("Unexpected error creating multiple AIdeas:", err);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  // Delete multiple AIdeas
  static async deleteMultiple(
    ids: number[]
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const { error } = await supabase
        .from("aideas")
        .delete()
        .in("id", ids)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error deleting multiple AIdeas:", error);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err) {
      console.error("Unexpected error deleting multiple AIdeas:", err);
      return { success: false, error: "An unexpected error occurred" };
    }
  }
}
