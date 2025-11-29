import React from 'react';
import { 
  Clapperboard, 
  Search, 
  Sparkles, 
  Youtube, 
  Instagram, 
  Video, 
  Smartphone,
  Zap,
  DollarSign,
  BookOpen,
  Smile,
  AlertTriangle,
  Briefcase,
  Heart,
  TrendingUp,
  Wind
} from 'lucide-react';
import { VideoPlatform, VideoGoal, VideoStyle } from './types';

export const PLATFORM_ICONS: Record<VideoPlatform, React.ReactNode> = {
  [VideoPlatform.TIKTOK]: <Smartphone className="w-4 h-4" />,
  [VideoPlatform.REELS]: <Instagram className="w-4 h-4" />,
  [VideoPlatform.SHORTS]: <Video className="w-4 h-4" />,
  [VideoPlatform.YOUTUBE_LONG]: <Youtube className="w-4 h-4" />,
};

export const GOAL_ICONS: Record<VideoGoal, React.ReactNode> = {
  [VideoGoal.ENGAGEMENT]: <Zap className="w-4 h-4 text-yellow-400" />,
  [VideoGoal.SALES]: <DollarSign className="w-4 h-4 text-green-400" />,
  [VideoGoal.EDUCATION]: <BookOpen className="w-4 h-4 text-blue-400" />,
  [VideoGoal.BRANDING]: <Sparkles className="w-4 h-4 text-purple-400" />,
  [VideoGoal.ENTERTAINMENT]: <Smile className="w-4 h-4 text-pink-400" />,
};

export const STYLE_ICONS: Record<VideoStyle, React.ReactNode> = {
  [VideoStyle.FUNNY]: <Smile className="w-4 h-4" />,
  [VideoStyle.SHOCKING]: <AlertTriangle className="w-4 h-4 text-red-400" />,
  [VideoStyle.PROFESSIONAL]: <Briefcase className="w-4 h-4" />,
  [VideoStyle.EMOTIONAL]: <Heart className="w-4 h-4 text-rose-400" />,
  [VideoStyle.FAST_PACED]: <Wind className="w-4 h-4" />,
  [VideoStyle.MINIMALIST]: <div className="w-4 h-4 border border-current rounded-full" />,
};
