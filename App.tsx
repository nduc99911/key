import React, { useState, useEffect } from 'react';
import { Clapperboard, Sparkles, Settings, Key, X, Save } from 'lucide-react';
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

  // API Key State
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check if key exists in env or local storage on load
    const localKey = localStorage.getItem('user_gemini_api_key');
    if (localKey) {
      setApiKeyInput(localKey);
      setHasKey(true);
    } else if (process.env.API_KEY) {
      setHasKey(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('user_gemini_api_key', apiKeyInput.trim());
      setHasKey(true);
      setShowApiKeyModal(false);
      setError(null); // Clear errors if any
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('user_gemini_api_key');
    setApiKeyInput('');
    setHasKey(!!process.env.API_KEY); // Revert to env var status
    setShowApiKeyModal(false);
  };

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
      if (err.message.includes("API Key")) {
        setShowApiKeyModal(true);
      }
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
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
              ScriptGenius <span className="text-indigo-500 text-sm font-normal">V2.0</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('keywords')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'keywords' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Nghiên Cứu
              </button>
              <button
                onClick={() => setActiveTab('script')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'script' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tạo Kịch Bản
              </button>
            </div>

            <button 
              onClick={() => setShowApiKeyModal(true)}
              className={`p-2 rounded-lg border transition-colors ${
                hasKey 
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500' 
                  : 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse'
              }`}
              title="Cài đặt API Key"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Key className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Cấu hình API Key</h3>
              </div>
              <button 
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-slate-400 text-sm mb-4">
              Nhập Google Gemini API Key của bạn để sử dụng ứng dụng. Key sẽ được lưu an toàn trong trình duyệt (LocalStorage).
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
                <input 
                  type="password" 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={handleSaveApiKey}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Lưu Key
                </button>
                {hasKey && (
                  <button 
                    onClick={handleRemoveApiKey}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700 rounded-lg font-medium transition-colors"
                  >
                    Xóa
                  </button>
                )}
              </div>
              
              <p className="text-xs text-center text-slate-500 mt-4">
                Chưa có Key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Lấy Key tại đây</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Notification */}
        {error && (
           <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center justify-between animate-fade-in">
             <div className="flex items-center gap-2">
               <span>{error}</span>
               {error.includes('API Key') && (
                 <button onClick={() => setShowApiKeyModal(true)} className="underline text-red-300 hover:text-white ml-2">Nhập Key ngay</button>
               )}
             </div>
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