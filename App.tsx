import React, { useState } from 'react';
import { Clapperboard, Sparkles } from 'lucide-react';
import ScriptForm from './components/ScriptForm';
import ScriptResult from './components/ScriptResult';
import KeywordResearcher from './components/KeywordResearcher';
import { ScriptRequestOptions, GeneratedScript } from './types';
import { generateViralScript } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'script' | 'keywords'>('keywords');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeywordsSelected = (keywords: string[]) => {
    setSelectedKeywords(keywords);
    setActiveTab('script');
    // Smooth scroll to top for mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateScript = async (options: ScriptRequestOptions) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedScript(null);

    try {
      const script = await generateViralScript(options);
      setGeneratedScript(script);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearKeyword = (kw: string) => {
    setSelectedKeywords(prev => prev.filter(k => k !== kw));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('keywords')}>
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Clapperboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ScriptGenius <span className="text-indigo-500 text-sm font-normal">V2.0</span>
            </h1>
          </div>
          
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'keywords' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nghiên Cứu
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'script' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tạo Kịch Bản
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
           <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center justify-between animate-fade-in">
             <span>{error}</span>
             <button onClick={() => setError(null)} className="text-red-400 hover:text-red-100 font-bold">✕</button>
           </div>
        )}

        {/* Tab Content */}
        {activeTab === 'keywords' ? (
          <div className="max-w-4xl mx-auto animate-fade-in">
             <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Bắt đầu với ý tưởng viral</h2>
              <p className="text-slate-400">Tìm kiếm từ khóa xu hướng trước khi viết kịch bản để tối đa hóa lượt xem.</p>
             </div>
             <KeywordResearcher 
               onKeywordsSelected={handleKeywordsSelected} 
               preSelectedKeywords={selectedKeywords}
             />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left: Form */}
            <div className="lg:col-span-4 xl:col-span-4">
              <ScriptForm 
                initialKeywords={selectedKeywords}
                onGenerate={handleGenerateScript}
                isGenerating={isGenerating}
                onClearKeywords={clearKeyword}
              />
            </div>

            {/* Right: Result */}
            <div className="lg:col-span-8 xl:col-span-8">
              {generatedScript ? (
                <ScriptResult script={generatedScript} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-12 text-center bg-slate-900/30">
                  <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <Sparkles className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-medium text-slate-300 mb-2">Chưa có kịch bản nào</h3>
                  <p className="text-slate-500 max-w-sm">
                    Hãy điền thông tin bên trái và nhấn "Tạo Kịch Bản Viral Ngay" để AI bắt đầu làm việc.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 ScriptGenius V2.0. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;