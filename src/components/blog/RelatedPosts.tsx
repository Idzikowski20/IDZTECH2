
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useBlogStore } from '@/utils/blog';

interface RelatedPostsProps {
  currentPostId: string;
  categories: string[];
  tags: string[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPostId, categories, tags }) => {
  const { posts } = useBlogStore();
  
  // Get related posts (simplified version)
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);
  
  if (relatedPosts.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Powiązane artykuły</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <Link to={`/blog/${post.id}`} key={post.id}>
            <Card className="h-full hover:bg-premium-light/5 transition-colors">
              {post.featuredImage && (
                <div className="w-full h-36 overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                <p className="text-premium-light/70 line-clamp-2">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
