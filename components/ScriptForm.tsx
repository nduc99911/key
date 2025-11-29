import React, { useState } from 'react';
import { 
  VideoPlatform, 
  VideoLength, 
  VideoGoal, 
  VideoStyle, 
  ScriptRequestOptions 
} from '../types';
import { PLATFORM_ICONS, GOAL_ICONS, STYLE_ICONS } from '../constants';
import { Sparkles, Loader2, X, FileText, MessageSquarePlus } from 'lucide-react';

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
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-lg h-full overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-500/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Thiết Lập Kịch Bản</h2>
          <p className="text-slate-400 text-sm">Cấu hình các thông số để tạo kịch bản viral.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Chủ đề / Ngành nghề</label>
          <input 
            type="text" 
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="VD: Review ẩm thực đường phố, Tips học tiếng Anh..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Selected Keywords Display */}
        {initialKeywords.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Từ khóa tích hợp</label>
            <div className="flex flex-wrap gap-2">
              {initialKeywords.map((kw, idx) => (
                <span key={idx} className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {kw}
                  <button type="button" onClick={() => onClearKeywords(kw)} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Nền tảng mục tiêu</label>
            <div className="space-y-2">
              {Object.values(VideoPlatform).map((p) => (
                <label key={p} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${platform === p ? 'bg-purple-600/20 border-purple-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                  <input type="radio" name="platform" value={p} checked={platform === p} onChange={() => setPlatform(p)} className="hidden" />
                  <div className={`text-slate-400 ${platform === p ? 'text-purple-400' : ''}`}>
                    {PLATFORM_ICONS[p]}
                  </div>
                  <span className={`text-sm ${platform === p ? 'text-white font-medium' : 'text-slate-300'}`}>{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mục tiêu nội dung</label>
            <div className="space-y-2">
              {Object.values(VideoGoal).map((g) => (
                <label key={g} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${goal === g ? 'bg-purple-600/20 border-purple-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}>
                  <input type="radio" name="goal" value={g} checked={goal === g} onChange={() => setGoal(g)} className="hidden" />
                  <div className={`text-slate-400 ${goal === g ? 'text-purple-400' : ''}`}>
                    {GOAL_ICONS[g]}
                  </div>
                  <span className={`text-sm ${goal === g ? 'text-white font-medium' : 'text-slate-300'}`}>{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Độ dài</label>
            <select 
              value={length} 
              onChange={(e) => setLength(e.target.value as VideoLength)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {Object.values(VideoLength).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Phong cách</label>
            <select 
              value={style} 
              onChange={(e) => setStyle(e.target.value as VideoStyle)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {Object.values(VideoStyle).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 focus-within:border-purple-500/50 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <MessageSquarePlus className="w-4 h-4 text-purple-400" />
              Ghi chú bổ sung
            </label>
            <span className={`text-xs ${notes.length >= MAX_NOTES_LENGTH ? 'text-red-400' : 'text-slate-500'}`}>
              {notes.length}/{MAX_NOTES_LENGTH}
            </span>
          </div>
          <textarea 
            value={notes}
            onChange={handleNotesChange}
            placeholder="Mô tả bối cảnh cụ thể, đối tượng mục tiêu chi tiết, hoặc các yêu cầu đặc biệt về lời thoại/hình ảnh để AI hiểu rõ hơn ý tưởng của bạn..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none text-sm leading-relaxed placeholder-slate-500"
          />
          <div className="flex justify-end items-center mt-2">
             <p className="text-xs text-purple-400">
                AI sẽ ưu tiên xử lý các yêu cầu này.
             </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Đang Sáng Tạo Kịch Bản...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Tạo Kịch Bản Viral Ngay
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ScriptForm;