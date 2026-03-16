import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { useListPosts, useCreatePost, useRatePost } from '@workspace/api-client-react';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelPanel } from '@/components/ui/PixelPanel';
import { Heart, Share2, ArrowLeft } from 'lucide-react';
import { CITIES } from '@/lib/game-data';

export default function SocialScreen() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const [caption, setCaption] = useState('');
  
  const { data: postsData, refetch } = useListPosts();
  const { mutate: createPost, isPending: isPosting } = useCreatePost();
  const { mutate: ratePost } = useRatePost();

  const handlePost = () => {
    if (!state.currentCity) return;
    const city = CITIES[state.currentCity];
    
    createPost({
      data: {
        playerId: state.playerId,
        playerName: state.playerName,
        city: city.name,
        genre: city.genre,
        caption: caption || `Just dropped a new ${city.genre} beat in ${city.name}! 🎵🔥`,
        screenshot: 'placeholder.png' // In full app, use html2canvas
      }
    }, {
      onSuccess: () => {
        setCaption('');
        refetch();
      }
    });
  };

  const handleRate = (postId: string) => {
    ratePost({ postId, data: { playerId: state.playerId, rating: 5 } }, {
      onSuccess: () => refetch()
    });
  };

  return (
    <div className="min-h-screen bg-background relative flex justify-center pb-20">
      <div className="absolute inset-0 scanlines z-10 pointer-events-none"></div>

      <div className="w-full max-w-md z-20 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-card p-4 border-b-4 border-primary flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setLocation('/map')} className="text-white hover:text-primary">
            <ArrowLeft />
          </button>
          <h1 className="text-xl text-primary font-pixel">GRAMMCHAT</h1>
          <div className="text-xs text-yellow-400">CLOUT: {state.clout}</div>
        </div>

        {/* Compose */}
        {state.currentCity && (
          <div className="p-4 bg-gray-900 border-b-2 border-gray-800">
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your latest track..."
              className="w-full bg-black text-white p-3 pixel-borders focus:outline-none text-xs h-20 resize-none mb-3"
            />
            <PixelButton 
              variant="primary" 
              className="w-full" 
              onClick={handlePost}
              disabled={isPosting}
            >
              {isPosting ? 'POSTING...' : 'SHARE TRACK'}
            </PixelButton>
          </div>
        )}

        {/* Feed */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {postsData?.posts?.length === 0 && (
            <div className="text-center text-gray-500 mt-10 text-xs">NO POSTS YET. BE THE FIRST!</div>
          )}
          
          {postsData?.posts?.map((post) => (
            <PixelPanel key={post.id} className="bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-700 pixel-borders"></div>
                <div>
                  <div className="text-xs text-white">{post.playerName}</div>
                  <div className="text-[8px] text-gray-400">📍 {post.city} • {post.genre}</div>
                </div>
              </div>
              
              {/* Fake visualizer image for the post */}
              <div className="w-full h-32 bg-gray-800 pixel-borders mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="flex gap-1 items-end h-16 w-full px-4">
                  {Array(16).fill(0).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-secondary" 
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <p className="text-[10px] text-gray-300 mb-4 leading-relaxed">
                {post.caption}
              </p>
              
              <div className="flex justify-between items-center border-t border-gray-800 pt-3">
                <button 
                  onClick={() => handleRate(post.id)}
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-pink-500"
                >
                  <Heart size={14} className={post.ratingCount > 0 ? "fill-pink-500 text-pink-500" : ""} />
                  {post.cloutRating || 0}
                </button>
                <button className="text-gray-400 hover:text-white">
                  <Share2 size={14} />
                </button>
              </div>
            </PixelPanel>
          ))}
        </div>
      </div>
    </div>
  );
}
