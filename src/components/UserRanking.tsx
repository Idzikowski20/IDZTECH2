
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchSanityData } from '@/lib/sanity';
import { calculatePoints } from '@/utils/authTypes';

interface UserRankingProps {
  showMonthly?: boolean;
  limit?: number;
}

interface RankedUser {
  _id: string;
  name: string;
  profilePicture?: string;
  stats: {
    views: number;
    posts: number;
    comments: number;
    likes: number;
    pointsTotal: number;
    pointsThisMonth: number;
  };
}

const UserRanking: React.FC<UserRankingProps> = ({ showMonthly = false, limit = 5 }) => {
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Tworzymy odpowiednie zapytanie do Sanity
        // Sortujemy po punktach miesięcznych lub całkowitych w zależności od propsa showMonthly
        const query = `*[_type == "user"] | order(${
          showMonthly ? "stats.pointsThisMonth" : "stats.pointsTotal"
        } desc)[0...${limit}]{
          _id,
          name,
          profilePicture,
          stats {
            views,
            posts,
            comments,
            likes,
            pointsTotal,
            pointsThisMonth
          }
        }`;
        
        const data = await fetchSanityData(query);
        
        if (data) {
          // Jeśli mamy dane z Sanity, aktualizujemy stan
          setUsers(data);
        } else {
          // Jeśli nie ma danych, można ustawić pusty array lub pokazać placeholder
          setUsers([]);
        }
      } catch (err) {
        console.error('Error fetching user ranking:', err);
        setError('Nie udało się pobrać rankingu użytkowników');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [showMonthly, limit]);

  // Funkcja do generowania kolorowego tła dla avatara na podstawie ID
  const getAvatarColor = (id: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-amber-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    
    // Używamy sumy kodów znaków ID jako prostego hasha
    const colorIndex = id
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    
    return colors[colorIndex];
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-premium-dark/50 border border-premium-light/10 rounded-lg">
        <h2 className="text-lg font-bold mb-3">Ranking użytkowników</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="rounded-full bg-premium-light/10 h-10 w-10"></div>
              <div className="flex-1">
                <div className="h-4 bg-premium-light/10 rounded w-28"></div>
                <div className="h-3 bg-premium-light/10 rounded w-20 mt-2"></div>
              </div>
              <div className="h-6 bg-premium-light/10 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-premium-dark/50 border border-premium-light/10 rounded-lg">
        <h2 className="text-lg font-bold mb-3">Ranking użytkowników</h2>
        <p className="text-premium-light/70">{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 bg-premium-dark/50 border border-premium-light/10 rounded-lg">
        <h2 className="text-lg font-bold mb-3">Ranking użytkowników</h2>
        <p className="text-premium-light/70">
          Brak danych o użytkownikach. Ranking pojawi się, gdy użytkownicy zaczną być aktywni.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-premium-dark/50 border border-premium-light/10 rounded-lg">
      <h2 className="text-lg font-bold mb-3">
        {showMonthly ? "Ranking miesięczny" : "Ranking wszech czasów"}
      </h2>
      
      <div className="space-y-4">
        {users.map((user, index) => {
          const pointsToDisplay = showMonthly 
            ? user.stats.pointsThisMonth 
            : user.stats.pointsTotal;
            
          return (
            <div 
              key={user._id} 
              className="flex items-center justify-between group hover:bg-premium-light/5 p-2 rounded-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-premium-light/10 font-semibold">
                  {index + 1}
                </div>
                
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className={`${getAvatarColor(user._id)} text-white`}>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium group-hover:text-white">{user.name}</div>
                  <div className="text-sm text-premium-light/70">
                    {user.stats.posts} postów • {user.stats.comments} komentarzy
                  </div>
                </div>
              </div>
              
              <div className="bg-premium-gradient text-white px-3 py-1 rounded-full text-sm font-medium">
                {pointsToDisplay} pkt
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserRanking;
