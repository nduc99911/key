import React from 'react';
import { GeneratedScript } from '../types';
import { Download, Copy, Clock, Hash, Zap, Film, Music, Mic } from 'lucide-react';

interface Props {
  script: GeneratedScript;
}

const ScriptResult: React.FC<Props> = ({ script }) => {

  const handleCopy = () => {
    let text = `TITLE: ${script.titleOptions[0]}\n\nSCENES:\n`;
    script.scenes.forEach(s => {
      text += `[${s.duration}] Scene ${s.sceneNumber}: ${s.visual}\nAudio: ${s.audio}\nSFX: ${s.soundEffect}\n\n`;
    });
    text += `HASHTAGS: ${script.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    alert('Đã sao chép kịch bản vào clipboard!');
  };

  const handleDownload = () => {
    const text = JSON.stringify(script, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-genius-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg overflow-hidden animate-fade-in-up">
      {/* Header Info */}
      <div className="p-6 border-b border-slate-700 bg-slate-900/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-1">Kịch Bản Đề Xuất</h3>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4" />
              <span>Thời lượng ước tính: <span className="text-white font-bold">{script.estimatedTotalDuration}</span></span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors">
              <Copy className="w-4 h-4" /> Sao Chép
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Lưu JSON
            </button>
          </div>
        </div>

        {/* Titles */}
        <div className="mb-6">
          <h4 className="text-slate-400 text-sm mb-3 font-medium">Gợi ý Tiêu đề (Clickbait & Viral)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {script.titleOptions.map((title, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-600 p-3 rounded-lg text-white font-medium text-sm hover:border-purple-500 transition-colors cursor-pointer select-all">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Hook Analysis */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-lg flex gap-3">
          <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-indigo-300 font-bold text-sm mb-1">Phân Tích Hook</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{script.hookAnalysis}</p>
          </div>
        </div>
      </div>

      {/* Storyboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 border-b border-slate-700 w-16">#</th>
              <th className="p-4 border-b border-slate-700 w-24">Thời gian</th>
              <th className="p-4 border-b border-slate-700 w-1/3">Hình Ảnh (Visual)</th>
              <th className="p-4 border-b border-slate-700 w-1/3">Âm Thanh / Thoại (Audio)</th>
              <th className="p-4 border-b border-slate-700">Ghi chú (SFX)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {script.scenes.map((scene, idx) => (
              <tr key={idx} className="hover:bg-slate-700/30 transition-colors group">
                <td className="p-4 text-slate-500 font-mono text-sm">{scene.sceneNumber}</td>
                <td className="p-4 text-purple-400 font-bold text-sm">{scene.duration}</td>
                <td className="p-4 align-top">
                  <div className="flex gap-2">
                    <Film className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                    <p className="text-slate-200 text-sm leading-relaxed">{scene.visual}</p>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <div className="flex gap-2">
                    <Mic className="w-4 h-4 text-slate-500 mt-1 shrink-0" />
                    <p className="text-white font-medium text-sm leading-relaxed">"{scene.audio}"</p>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <div className="flex gap-2 text-slate-400">
                    <Music className="w-4 h-4 mt-1 shrink-0" />
                    <span className="text-sm italic">{scene.soundEffect}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hashtags */}
      <div className="p-6 border-t border-slate-700 bg-slate-900/30">
        <div className="flex items-center gap-2 mb-3 text-slate-400">
          <Hash className="w-4 h-4" />
          <span className="text-sm font-medium">Bộ Hashtag Đề Xuất</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {script.hashtags.map((tag, idx) => (
            <span key={idx} className="text-blue-400 bg-blue-900/20 px-2 py-1 rounded text-sm hover:bg-blue-900/40 cursor-pointer transition-colors">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScriptResult;