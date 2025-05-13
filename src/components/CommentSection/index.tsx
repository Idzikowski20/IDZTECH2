
import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/utils/AuthProvider";
import CommentHeader from "./CommentHeader";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { Skeleton } from "../ui/skeleton";

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
  guest_name?: string;
  profiles?: {
    name?: string;
    lastName?: string;
    profilePicture?: string;
    email?: string;
    role?: string;
  };
}

export interface CommentSectionProps {
  postId: string;
  postTitle?: string;
}

const CommentSection = ({ postId, postTitle }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_comments")
          .select(`
            id, 
            content, 
            created_at, 
            user_id,
            guest_name,
            status,
            profiles (
              name, 
              lastName, 
              profilePicture,
              email,
              role
            )
          `)
          .eq("post_id", postId)
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching comments:", error);
          return;
        }

        setComments(data || []);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Handle submitting a new comment
  const handleSubmitComment = async (content: string, guestName?: string) => {
    try {
      // Prepare comment data
      const commentData = {
        post_id: postId,
        content,
        status: "approved", // Auto-approve comments for now
      };
      
      // Add user_id if authenticated, or guest_name if provided
      if (isAuthenticated && user) {
        Object.assign(commentData, { user_id: user.id });
      } else if (guestName) {
        Object.assign(commentData, { guest_name: guestName });
      }

      const { data, error } = await supabase
        .from("blog_comments")
        .insert(commentData)
        .select(`
          id, 
          content, 
          created_at, 
          user_id,
          guest_name,
          status,
          profiles (
            name, 
            lastName, 
            profilePicture,
            email,
            role
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      // Add the new comment to the list
      setComments((prev) => [data, ...prev]);
      
      return true;
    } catch (error) {
      console.error("Error adding comment:", error);
      return false;
    }
  };

  return (
    <div className="bg-premium-dark/50 border border-premium-light/10 rounded-xl p-6 mb-8">
      <CommentHeader commentsCount={comments.length} />
      
      <CommentForm
        onSubmit={handleSubmitComment}
        isAuthenticated={isAuthenticated}
      />
      
      {loading ? (
        <div className="space-y-6 mt-8">
          {[1, 2].map((item) => (
            <div key={item} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24 mb-4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CommentList comments={comments} postTitle={postTitle} />
      )}
    </div>
  );
};

export default CommentSection;
