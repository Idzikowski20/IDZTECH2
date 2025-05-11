
import React, { useEffect, useState } from 'react';
import { useAuth, User } from '@/utils/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Award, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBlogStore } from '@/utils/blog';

interface UserRankingProps {
  limit?: number;
  showMonthly?: boolean;
  className?: string;
}

const UserRanking: React.FC<UserRankingProps> = ({ 
  limit = 5,
  showMonthly = false,
  className
}) => {
  const { getUserRanking, refreshUserStats } = useAuth();
  const { posts } = useBlogStore();
  const [users, setUsers] = useState<User[]>([]);
  
  // Force refresh user stats when component mounts to ensure data is up-to-date
  useEffect(() => {
    refreshUserStats?.();
    
    // Fetch and handle users data
    const fetchUsers = async () => {
      try {
        const usersList = await getUserRanking();
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching user ranking:", error);
        setUsers([]);
      }
    };
    
    fetchUsers();
  }, [refreshUserStats, posts]);
  
  // Get displayed users based on limit
  const displayUsers = users.slice(0, limit);
  
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
