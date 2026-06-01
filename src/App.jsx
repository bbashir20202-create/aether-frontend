import { useState, useRef, useEffect } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello Boss. I'm Aether — your professional AI agent.\n\nI have long-term memory and can help you with your scrap metal business, research, planning, analysis, and personal growth.\n\nWhat would you like to work on today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Cannot connect to backend. Make sure backend is running on port 8000." }]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <div className="w-72 bg-zinc-900 border-r border-zinc-800 p-4">
        <div className="text-violet-400 font-bold text-xl mb-8">Aether AI</div>
        <div className="text-zinc-400 text-sm mb-4">CURRENT PROJECT</div>
        <div className="bg-zinc-800 p-3 rounded-xl mb-6">
          Scrap Metal Business in Bahawalpur
        </div>
        <div className="text-zinc-400 text-sm mb-4">MEMORY ACTIVE</div>
        <div className="text-emerald-400 text-xs">• Long-term memory enabled</div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">🌌</div>
            <div>
              <div className="font-semibold">Aether</div>
              <div className="text-emerald-400 text-xs">● Online • Professional Mode</div>
            </div>
          </div>
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-5 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-zinc-800 border border-zinc-700'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-violet-400">Aether is working...</div>}
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything... Research, plan, analyze, be honest..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 text-white"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-violet-600 hover:bg-violet-700 px-10 rounded-2xl font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
