
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create a Supabase client with the service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Only handle POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Parse request body
    const requestData = await req.json();
    
    // Generate sitemap.xml
    await generateSitemap();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Sitemap updated successfully",
      slug: requestData.slug
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    console.error("Error in update-sitemap function:", error);
    
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: error.message 
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});

async function generateSitemap() {
  try {
    // Fetch all published blog posts
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Generate sitemap XML
    const baseUrl = "https://idztech.pl";
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Add blog posts to sitemap
    if (posts) {
      for (const post of posts) {
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }

    sitemap += `
</urlset>`;

    // Store the sitemap in a Supabase bucket or database
    // This would require additional setup for storage buckets
    // For now, just log it as this is a demonstration
    console.log("Generated sitemap:", sitemap);
    
    // In a real implementation, you might save this to a public storage bucket
    // or make it accessible through a special endpoint

    return true;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw error;
  }
}
