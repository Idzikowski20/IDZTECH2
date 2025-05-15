
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Award, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBlogStore } from '@/utils/blog';
import { supabase } from '@/utils/supabaseClient';

interface UserRankingProps {
  limit?: number;
  showMonthly?: boolean;
  className?: string;
}

interface RankedUser {
  id: string;
  name: string;
  lastName?: string;
  profilePicture?: string;
  role?: string;
  stats: {
    posts: number;
    comments: number;
    likes: number;
    views: number;
    pointsTotal: number;
    pointsThisMonth: number;
  }
}

const UserRanking: React.FC<UserRankingProps> = ({ 
  limit = 5,
  showMonthly = false,
  className
}) => {
  const auth = useAuth();
  const { posts } = useBlogStore();
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Force refresh user stats when component mounts to ensure data is up-to-date
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Call refreshUserStats from auth context if available
        if (auth.refreshUserStats) {
          auth.refreshUserStats();
        }
        
        // Fetch users from Supabase profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error("Error fetching user profiles:", profilesError);
          return;
        }
        
        if (!profiles) {
          setUsers([]);
          return;
        }
        
        // Transform profiles into RankedUser format
        const rankedUsers = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || 'Użytkownik',
          lastName: profile.lastName,
          profilePicture: profile.profilePicture,
          role: profile.role,
          stats: {
            posts: Math.floor(Math.random() * 10), // Mock data - replace with real stats
            comments: Math.floor(Math.random() * 20),
            likes: Math.floor(Math.random() * 50),
            views: Math.floor(Math.random() * 1000),
            pointsTotal: Math.floor(Math.random() * 1000),
            pointsThisMonth: Math.floor(Math.random() * 300)
          }
        }));
        
        // Sort by points
        const sortedUsers = rankedUsers.sort((a, b) => 
          showMonthly 
            ? b.stats.pointsThisMonth - a.stats.pointsThisMonth 
            : b.stats.pointsTotal - a.stats.pointsTotal
        );
        
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching user ranking:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [auth, posts, showMonthly]);
  
  // Get displayed users based on limit
  const displayUsers = users.slice(0, limit);
  
  if (loading) {
    return <div className="p-4 text-center text-premium-light/50">Ładowanie rankingu...</div>;
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-bold flex items-center">
        {showMonthly ? (
          <>
            <Award className="mr-2 text-amber-400" size={20} />
            Ranking tego miesiąca
          </>
        ) : (
          <>
            <Trophy className="mr-2 text-amber-400" size={20} />
            Ranking wszech czasów
          </>
        )}
      </h3>
      
      <div className="space-y-3">
        {displayUsers.map((user, index) => (
          <div 
            key={user.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-all",
              "border border-premium-light/10 bg-premium-dark/50 hover:bg-white hover:text-black"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 flex justify-center">
                {index === 0 ? (
                  <Trophy className="text-amber-400" size={22} />
                ) : index === 1 ? (
                  <Medal className="text-gray-300" size={22} />
                ) : index === 2 ? (
                  <Medal className="text-amber-700" size={22} />
                ) : (
                  <span className="text-premium-light/70 text-lg font-semibold">{index + 1}</span>
                )}
              </div>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback className="bg-premium-gradient">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-medium">{user.name} {user.lastName}</div>
                <div className="text-xs text-premium-light/60">
                  Posty: {user.stats.posts} | Komentarze: {user.stats.comments}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold flex items-center justify-end gap-1">
                <Star className="text-amber-400" size={16} />
                {showMonthly ? user.stats.pointsThisMonth : user.stats.pointsTotal} pkt
              </div>
              <div className="text-xs text-premium-light/60">
                {user.stats.views} wyświetleń
              </div>
            </div>
          </div>
        ))}
        
        {displayUsers.length === 0 && (
          <div className="p-4 text-center text-premium-light/50">
            Brak użytkowników do wyświetlenia w rankingu.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRanking;
