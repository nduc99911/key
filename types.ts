export enum VideoPlatform {
  TIKTOK = 'TikTok',
  REELS = 'Instagram Reels',
  SHORTS = 'YouTube Shorts',
  YOUTUBE_LONG = 'YouTube Video (Dài)',
}

export enum VideoLength {
  SHORT_15S = '15 Giây',
  SHORT_30S = '30 Giây',
  SHORT_60S = '60 Giây',
  LONG_1_3M = '1-3 Phút',
  LONG_5_10M = '5-10 Phút',
}

export enum VideoGoal {
  ENGAGEMENT = 'Tăng Tương Tác (Views/Comments)',
  SALES = 'Bán Hàng / Chuyển Đổi',
  EDUCATION = 'Giáo Dục / Chia Sẻ Kiến Thức',
  BRANDING = 'Xây Dựng Thương Hiệu',
  ENTERTAINMENT = 'Giải Trí Thuần Túy',
}

export enum VideoStyle {
  FUNNY = 'Hài Hước',
  SHOCKING = 'Gây Sốc / Drama',
  PROFESSIONAL = 'Chuyên Nghiệp / Nghiêm Túc',
  EMOTIONAL = 'Cảm Động / Truyền Cảm Hứng',
  FAST_PACED = 'Năng Động / Nhanh',
  MINIMALIST = 'Tối Giản / Nhẹ Nhàng',
}

export interface KeywordData {
  keyword: string;
  volume: string; // e.g., "High", "Medium", "Trending"
  relevance: number; // 0-100 score
  intent: string;
}

export interface ScriptScene {
  sceneNumber: number;
  duration: string;
  visual: string;
  audio: string; // Dialogue or VO
  soundEffect: string; // SFX or BGM notes
}

export interface GeneratedScript {
  titleOptions: string[];
  hashtags: string[];
  hookAnalysis: string;
  scenes: ScriptScene[];
  estimatedTotalDuration: string;
}

export interface ScriptRequestOptions {
  platform: VideoPlatform;
  length: VideoLength;
  topic: string;
  goal: VideoGoal;
  style: VideoStyle;
  keywords: string[]; // From keyword research
  additionalNotes?: string;
}