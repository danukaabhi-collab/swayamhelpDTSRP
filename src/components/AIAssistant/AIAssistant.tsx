import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff, Bot, Volume2, VolumeX, Languages } from 'lucide-react';
import { UserProfile } from '../../types';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI, Modality } from "@google/genai";
import { SCHEMES } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AIAssistant() {
  const { t } = useTranslation();
  const { profile: authProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (isOpen) {
      if (authProfile) {
        setProfile(authProfile);
      } else {
        // Fallback for anonymous
        setProfile({
          uid: 'anonymous',
          fullName: 'Guest User',
          email: '',
          age: 25,
          gender: 'Male',
          casteCategory: 'General',
          qualification: 'Graduate',
          occupation: 'Student',
          residence: 'Delhi',
          annualIncomeRange: 'Below ₹1 Lakh',
          avatarType: 'initials',
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
    }
  }, [isOpen, authProfile]);

  const speakText = (text: string) => {
    if (!isTtsEnabled) return;

    try {
      // Cancel any ongoing speech so it's snappy
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find an Indian or Female voice for a better experience
      const preferredVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('Female')) || voices[0];
      if (preferredVoice) {
         utterance.voice = preferredVoice;
      }
      
      utterance.rate = 1.05; // Slightly faster natural talk
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Native TTS Error:", error);
    }
  };

  const handleSend = async (text?: string) => {
    const input = text || message;
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      // Small simulated delay for realistic feel
      await new Promise(res => setTimeout(res, 800));

      const query = input.toLowerCase();
      let aiText = "";

      // Add basic local routing logic based on user queries
      if (query.match(/^(hi|hello|hey|namaste)/i)) {
        aiText = "Namaste! I am the SwayamHelp offline assistant. How can I assist you with government schemes today?";
      } 
      else if (query.includes("all schemes") || query.includes("how many") || query.includes("list")) {
        const categoryCounts = SCHEMES.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        let breakdown = Object.entries(categoryCounts).map(([cat, count]) => `- **${cat}**: ${count} schemes`).join('\n');
        aiText = `We currently have **${SCHEMES.length}** government schemes in our database across the following categories:\n\n${breakdown}\n\nYou can ask me about any specific category, or try searching for keywords like "farmers", "loans", or "scholarships"!`;
      } 
      else {
        let matches: typeof SCHEMES = [];

        // Priority overrides for common search terms
        if (query.includes("pm kisan") || query.includes("pm-kisan") || query.includes("kisan")) {
          matches = SCHEMES.filter(s => s.schemeName.toLowerCase().includes("kisan"));
        } else if (query.includes("scholarship") || query.includes("education")) {
          matches = SCHEMES.filter(s => s.category.toLowerCase().includes("education"));
        } else if (query.includes("women") || query.includes("girl") || query.includes("female") || query.includes("didi") || query.includes("mahila")) {
          matches = SCHEMES.filter(s => s.category.toLowerCase().includes("women"));
        } else if (query.includes("health") || query.includes("medical") || query.includes("insurance") || query.includes("ayushman")) {
          matches = SCHEMES.filter(s => s.category.toLowerCase().includes("health"));
        } else if (query.includes("agri") || query.includes("farm") || query.includes("crop") || query.includes("khet")) {
          matches = SCHEMES.filter(s => s.category.toLowerCase().includes("agriculture"));
        } else if (query.includes("business") || query.includes("startup") || query.includes("loan") || query.includes("mudra") || query.includes("msme")) {
          matches = SCHEMES.filter(s => s.category.toLowerCase().includes("startup"));
        } else if (query.includes("job") || query.includes("employ") || query.includes("work") || query.includes("rozgar") || query.includes("skill")) {
          matches = SCHEMES.filter(s => s.category.toLowerCase().includes("job"));
        } else if (query.includes("social") || query.includes("pension") || query.includes("welfare") || query.includes("widow")) {
          matches = SCHEMES.filter(s => s.category.toLowerCase().includes("social"));
        } else if (query.includes("housing") || query.includes("awas") || query.includes("home") || query.includes("house")) {
          matches = SCHEMES.filter(s => s.schemeName.toLowerCase().includes("awas") || s.benefits.toLowerCase().includes("hous"));
        } else {
          // General keyword search across all fields
          const stopWords = ['is', 'on', 'in', 'at', 'to', 'of', 'it', 'and', 'for', 'the', 'my', 'be', 'do', 'how', 'what', 'can', 'me', 'or', 'an', 'am'];
          const keywords = query.replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w));
          
          if (keywords.length > 0) {
            matches = SCHEMES.filter(s => 
              keywords.some(kw => {
                const name = s.schemeName.toLowerCase();
                const desc = s.description.toLowerCase();
                const ben = s.benefits.toLowerCase();
                const cat = s.category.toLowerCase();
                // For short words (2 chars like PM, CM), use word boundary matching
                if (kw.length <= 2) {
                  const regex = new RegExp('\\b' + kw + '\\b', 'i');
                  return regex.test(s.schemeName) || regex.test(s.description) || regex.test(s.benefits);
                }
                return name.includes(kw) || desc.includes(kw) || ben.includes(kw) || cat.includes(kw);
              })
            );
          }
        }

        if (matches.length > 0) {
          aiText = `I found **${matches.length}** relevant scheme(s). Here are the top results:\n\n`;
          matches.slice(0, 5).forEach(m => {
            aiText += `**${m.schemeName}**\n- **Benefits:** ${m.benefits}\n- [Official Portal](${m.officialWebsiteLink})\n\n`;
          });
          if (matches.length > 5) {
            aiText += `\n...and ${matches.length - 5} more! Try narrowing your search or browse categories on the home page.`;
          }
        } else {
          aiText = "I couldn't find a specific scheme matching those words in our dataset. Try searching by category like 'Agriculture', 'Health', 'Education', 'Jobs', 'Women', or 'Social Welfare'. You can also type 'all schemes' to see everything!";
        }
      } 

      setChatHistory(prev => [...prev, { role: 'model', text: aiText }]);
      
      if (isTtsEnabled) {
        speakText(aiText.replace(/[#*`\\[\\]()]/g, '')); // Strip markdown for TTS
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, { role: 'model', text: `⚠️ Error searching schemes offline.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t('VoiceRecognitionNotSupported'));
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    // Try to detect language or default to Indian English/Hindi
    recognition.lang = 'en-IN'; 

    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      setMessage('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      // Provide real-time typing feedback
      setMessage(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Automatically send the message when they finish talking or stop it manually
      if (finalTranscript.trim()) {
        handleSend(finalTranscript.trim());
      }
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[550px] flex flex-col mb-4 overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-cyan-900 p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">SwayamHelp AI</h3>
                  <p className="text-[10px] text-cyan-200">{t('MultilingualAssistant')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                  className={`p-1.5 rounded-lg transition-colors ${isTtsEnabled ? 'bg-cyan-800 text-white' : 'bg-transparent text-cyan-300'}`}
                  title={isTtsEnabled ? t('DisableVoice') : t('EnableVoice')}
                >
                  {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-cyan-800 p-1 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-cyan-900" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{t('NamasteAI')}</h4>
                  <p className="text-gray-500 text-sm px-6">
                    {t('AIIntro')}
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {[t('PMKisanEligibility'), t('SchemesForWomen'), t('Scholarships')].map((q) => (
                      <button 
                        key={q}
                        onClick={() => handleSend(q)}
                        className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-cyan-900 hover:text-cyan-900 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    chat.role === 'user' 
                      ? 'bg-cyan-900 text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                  }`}>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{chat.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-900/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-900/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cyan-900/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  title={isListening ? t('StopListening') : t('StartVoiceSearch')}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isListening ? t('Listening') : t('AskAnyLanguage')}
                    className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-900 outline-none transition-all"
                  />
                </div>
                <button 
                  onClick={() => handleSend()}
                  disabled={!message.trim() || isLoading}
                  className="p-2.5 bg-cyan-900 text-white rounded-xl hover:bg-cyan-800 disabled:opacity-50 transition-all shadow-lg shadow-cyan-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-center space-x-1 text-[10px] text-gray-400">
                <Languages className="w-3 h-3" />
                <span>{t('SupportsLanguages')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-cyan-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-cyan-800 transition-all hover:scale-110 active:scale-95 group relative"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
        {!isOpen && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
            AI
          </span>
        )}
      </button>
    </div>
  );
}

