import React, { useState } from 'react';
import { Search, TrendingUp, Check, Loader2, Plus } from 'lucide-react';
import { KeywordData } from '../types';
import { generateKeywordResearch } from '../services/geminiService';

interface Props {
  onKeywordsSelected: (keywords: string[]) => void;
  preSelectedKeywords: string[];
}

const KeywordResearcher: React.FC<Props> = ({ onKeywordsSelected, preSelectedKeywords }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KeywordData[] | null>(null);
  const [selected, setSelected] = useState<string[]>(preSelectedKeywords);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await generateKeywordResearch(topic);
      setResults(data);
    } catch (err) {
      setError("Có lỗi xảy ra khi phân tích từ khóa. Vui lòng kiểm tra API Key hoặc thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyword = (kw: string) => {
    let newSelected;
    if (selected.includes(kw)) {
      newSelected = selected.filter(k => k !== kw);
    } else {
      newSelected = [...selected, kw];
    }
    setSelected(newSelected);
  };

  const applyKeywords = () => {
    onKeywordsSelected(selected);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-lg">
          <Search className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Nghiên Cứu & Phân Tích Từ Khóa</h2>
          <p className="text-slate-400 text-sm">Tìm từ khóa xu hướng để tối ưu hóa khả năng hiển thị video.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Nhập chủ đề (ví dụ: Chăm sóc da, Đầu tư crypto, Nấu ăn chay...)"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Phân Tích
        </button>
      </form>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {results && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {results.map((item, idx) => {
              const isSelected = selected.includes(item.keyword);
              return (
                <div
                  key={idx}
                  onClick={() => toggleKeyword(item.keyword)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 flex justify-between items-center group
                    ${isSelected 
                      ? 'bg-indigo-600/20 border-indigo-500' 
                      : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                        {item.keyword}
                      </span>
                      {item.volume === 'Đột Phá' || item.volume === 'Rất Cao' ? (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Hot
                        </span>
                      ) : (
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                          {item.volume}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex gap-3">
                      <span>Độ liên quan: {item.relevance}%</span>
                      <span>•</span>
                      <span>{item.intent}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                    {!isSelected && <Plus className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center border-t border-slate-700 pt-4">
            <span className="text-slate-400 text-sm">
              Đã chọn: <strong className="text-white">{selected.length}</strong> từ khóa
            </span>
            <button
              onClick={applyKeywords}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Sử Dụng Từ Khóa Này
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordResearcher;