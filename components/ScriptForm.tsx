import React, { useState } from 'react';
import { 
  VideoPlatform, 
  VideoLength, 
  VideoGoal, 
  VideoStyle, 
  ScriptRequestOptions 
} from '../types';
import { PLATFORM_ICONS, GOAL_ICONS, STYLE_ICONS } from '../constants';
import { Sparkles, Loader2, X, MessageSquarePlus } from 'lucide-react';

interface Props {
  initialKeywords: string[];
  onGenerate: (options: ScriptRequestOptions) => void;
  isGenerating: boolean;
  onClearKeywords: (kw: string) => void;
}

const MAX_NOTES_LENGTH = 500;

const ScriptForm: React.FC<Props> = ({ initialKeywords, onGenerate, isGenerating, onClearKeywords }) => {
  const [platform, setPlatform] = useState<VideoPlatform>(VideoPlatform.TIKTOK);
  const [length, setLength] = useState<VideoLength>(VideoLength.SHORT_30S);
  const [goal, setGoal] = useState<VideoGoal>(VideoGoal.ENGAGEMENT);
  const [style, setStyle] = useState<VideoStyle>(VideoStyle.FUNNY);
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      platform,
      length,
      goal,
      style,
      topic,
      keywords: initialKeywords,
      additionalNotes: notes
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_NOTES_LENGTH) {
      setNotes(value);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 md:p-8 shadow-xl h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8 border-b border-slate-700/50 pb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-500/20">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Thiết Lập Kịch Bản</h2>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">Cấu hình các thông số để tạo kịch bản viral tối ưu cho nền tảng của bạn.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Topic Input Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            Chủ đề / Ngành nghề <span className="text-red-400">*</span>
          </label>
          <input 
            type="text" 
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="VD: Review ẩm thực đường phố, Tips học tiếng Anh..."
            className="w-full bg-slate-900/80 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Selected Keywords Display */}
        {initialKeywords.length > 0 && (
          <div className="bg-indigo-900/10 rounded-xl p-5 border border-indigo-500/20 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Từ khóa tích hợp</label>
              <span className="text-xs text-indigo-400/70">{initialKeywords.length} từ khóa</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {initialKeywords.map((kw, idx) => (
                <span key={idx} className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 hover:bg-indigo-500/30 transition-colors group">
                  {kw}
                  <button type="button" onClick={() => onClearKeywords(kw)} className="text-indigo-400 hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Grid for Platform & Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Platform */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">Nền tảng mục tiêu</label>
            <div className="space-y-2.5">
              {Object.values(VideoPlatform).map((p) => (
                <label key={p} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group ${platform === p ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}>
                  <input type="radio" name="platform" value={p} checked={platform === p} onChange={() => setPlatform(p)} className="hidden" />
                  <div className={`p-1.5 rounded-lg transition-colors ${platform === p ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'}`}>
                    {PLATFORM_ICONS[p]}
                  </div>
                  <span className={`text-sm ${platform === p ? 'text-white font-medium' : 'text-slate-300'}`}>{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">Mục tiêu nội dung</label>
            <div className="space-y-2.5">
              {Object.values(VideoGoal).map((g) => (
                <label key={g} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group ${goal === g ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}>
                  <input type="radio" name="goal" value={g} checked={goal === g} onChange={() => setGoal(g)} className="hidden" />
                  <div className={`p-1.5 rounded-lg transition-colors ${goal === g ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'}`}>
                    {GOAL_ICONS[g]}
                  </div>
                  <span className={`text-sm ${goal === g ? 'text-white font-medium' : 'text-slate-300'}`}>{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Grid for Length & Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Length */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">Độ dài video</label>
            <div className="relative">
              <select 
                value={length} 
                onChange={(e) => setLength(e.target.value as VideoLength)}
                className="w-full appearance-none bg-slate-900/80 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all cursor-pointer"
              >
                {Object.values(VideoLength).map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Style */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">Phong cách thể hiện</label>
            <div className="relative">
              <select 
                value={style} 
                onChange={(e) => setStyle(e.target.value as VideoStyle)}
                className="w-full appearance-none bg-slate-900/80 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all cursor-pointer"
              >
                {Object.values(VideoStyle).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">Ghi chú bổ sung</label>
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all shadow-inner group">
              <div className="flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-sm text-slate-400 group-focus-within:text-purple-400 transition-colors">
                  <MessageSquarePlus className="w-4 h-4" />
                  <span>Hướng dẫn chi tiết cho AI</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${notes.length >= MAX_NOTES_LENGTH ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                  {notes.length}/{MAX_NOTES_LENGTH}
                </span>
              </div>
              <textarea 
                value={notes}
                onChange={handleNotesChange}
                placeholder="Ví dụ: 'Hãy tập trung vào tính năng tiết kiệm điện', 'Dùng giọng văn gen Z', 'Mở đầu bằng câu hỏi gây tò mò'..."
                className="w-full bg-transparent border-none p-0 text-white placeholder-slate-600 focus:ring-0 outline-none min-h-[120px] resize-none text-sm leading-relaxed"
              />
            </div>
            <p className="text-xs text-slate-500 pl-1">
              * AI sẽ ưu tiên xử lý các yêu cầu trong phần ghi chú này để cá nhân hóa kịch bản.
            </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_-10px_rgba(124,58,237,0.5)] transition-all transform hover:scale-[1.01] hover:shadow-[0_15px_35px_-12px_rgba(124,58,237,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-3 active:scale-[0.99] border border-white/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-lg">Đang Sáng Tạo Kịch Bản...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span className="text-lg">Tạo Kịch Bản Viral Ngay</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ScriptForm;