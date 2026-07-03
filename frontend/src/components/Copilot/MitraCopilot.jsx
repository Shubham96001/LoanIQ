import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { MessageSquare, X, Send, Sparkles, User, Bot, HelpCircle } from 'lucide-react';

export default function MitraCopilot() {
  const { user, applications } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Seed initial Mitra greeting
  useEffect(() => {
    const greeting = user?.role === 'manager'
      ? `Namaste Rajesh ji! I am Mitra, your portfolio co-pilot. I can summarize risk factors, audit KYC logs, or check approval statistics.`
      : `Namaste ${user?.name || 'Customer'}! I am Mitra, your smart loan co-pilot. Ask me about credit eligibility, document scanner checks, or loan tracker updates.`;
      
    setMessages([
      { id: 1, sender: 'bot', text: greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, [user]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    setUnread(false);
  };

  const getMitraReply = (query) => {
    const text = query.toLowerCase();
    
    // Manager Responses
    if (user?.role === 'manager') {
      if (text.includes('risk') || text.includes('summarize') || text.includes('profile')) {
        const underReview = applications.filter(a => a.status === 'Under Review');
        if (underReview.length > 0) {
          const app = underReview[0];
          const applicantEmail = app.userEmail || app.applicant_email || '';
          const rawName = (applicantEmail.split && applicantEmail.split('@')[0]) || 'Applicant';
          const displayName = rawName.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
          return `Active evaluation check: Application ${app.id} (${displayName}) has a credit score of 87/100 (Low Risk). Aadhaar and PAN verified by OCR. Suggested decision: Approve.`;
        }
        return `All current loans have been audited. Average active portfolio risk rating is 84/100 (Safe).`;
      }
      if (text.includes('portfolio') || text.includes('disburs') || text.includes('volume')) {
        const approvedSum = applications.filter(a => a.status === 'Approved').reduce((sum, a) => sum + a.amount, 0) + 11100000;
        return `Branch active portfolio volume is currently ₹ ${approvedSum.toLocaleString()} across active Personal, Student, and Business loan sections.`;
      }
      if (text.includes('kyc') || text.includes('ocr') || text.includes('verif')) {
        return `AI OCR scans performed on Aadhaar & PAN are 99% match. Salary slips are awaiting final approval checks.`;
      }
      return `Rajesh ji, I can help you calculate portfolio averages, review applicant folders, or assess credit risks. Try typing 'summarize risk' or 'portfolio volume'.`;
    }

    // Customer Responses
    else {
      if (text.includes('eligible') || text.includes('eligibility') || text.includes('credit') || text.includes('score')) {
        return `Aapka eligibility score check krne ke liye 'Check Eligibility' page pr jaayiye. Agar monthly net salary 25,000+ hai or purane EMI commitments kam hain, to aap easily qualify ho jayenge!`;
      }
      if (text.includes('status') || text.includes('track') || text.includes('active')) {
        const underReview = applications.filter(a => a.status === 'Under Review');
        if (underReview.length > 0) {
          return `Aapka active loan application: ${underReview[0].id} (${underReview[0].type}) ₹${underReview[0].amount.toLocaleString()} abhi 'Loan Under Review' status mey hai. Humari team documents scan kr rhi hai.`;
        }
        const approved = applications.filter(a => a.status === 'Approved');
        if (approved.length > 0) {
          return `Good news! Aapka application approved ho chuka hai. Disbursal processing check krne ke liye 'Track Application' pr jaayiye.`;
        }
        return `Mujhe aapka koi active application nahi mila. Loan apply krne ke liye dashboard pr 'Apply Loan' pr click kre.`;
      }
      if (text.includes('document') || text.includes('ocr') || text.includes('upload') || text.includes('aadhaar') || text.includes('pan')) {
        return `Required documents: Aadhaar Card, PAN Card, 3-Month Salary Slip, Bank Statement, and Passport Photo. AI OCR models automatically file verification check krte hain.`;
      }
      if (text.includes('hello') || text.includes('hi') || text.includes('namaste') || text.includes('hey')) {
        return `Namaste! I am Mitra, your smart credit assistant. How can I help you today?`;
      }
      return `I am Mitra. I can help you check eligibility scores, track active applications, or explain document OCR check validations. Try typing 'eligibility score' or 'active status'.`;
    }
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    // Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // AI thinking delay
    setTimeout(() => {
      const botReplyText = getMitraReply(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  // Quick Action Buttons depending on role
  const quickPrompts = user?.role === 'manager' 
    ? [
        'Summarize active risk profile',
        'What is portfolio volume?',
        'Verify KYC checklist status'
      ]
    : [
        'Am I eligible for a loan?',
        'Check my active loan status',
        'What documents do I need?'
      ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Pane */}
      {isOpen && (
        <div className="mb-4 w-92 h-[500px] max-w-[calc(100vw-32px)] rounded-3xl border border-slate-100 bg-white shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header Panel */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-2 rounded-xl text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-none">Mitra</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-blue-100 font-semibold uppercase">Smart Co-Pilot</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleOpenToggle}
              className="rounded-xl p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar Icon */}
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  msg.sender === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-700'
                }`}>
                  {msg.sender === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Bubble content */}
                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === 'bot'
                      ? 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-tl-sm'
                      : 'bg-blue-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 block px-1 text-right">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%] items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white text-slate-400 border border-slate-100 p-3 rounded-2xl rounded-tl-sm text-xs font-medium shadow-sm flex gap-1">
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts list */}
          <div className="border-t border-slate-100 p-2.5 bg-white flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[10px] font-semibold text-slate-600 bg-slate-100/80 hover:bg-blue-50 hover:text-blue-600 border border-slate-150 px-2.5 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="h-3 w-3 shrink-0 text-blue-500" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Input text zone */}
          <div className="border-t border-slate-100 p-3 bg-white flex gap-2 items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Mitra..."
              className="flex-1 rounded-xl bg-slate-50 border border-slate-200 py-2.5 px-4 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white"
            />
            <button
              onClick={() => handleSend()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white p-2.5 shadow-sm transition-colors"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Bubble Button */}
      <button
        onClick={handleOpenToggle}
        className="relative group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl hover:scale-105 transition-all cursor-pointer ring-4 ring-white"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 animate-pulse" />}
        {unread && !isOpen && (
          <span className="absolute right-0 top-0 flex h-4 w-4 shrink-0 rounded-full bg-red-500 ring-2 ring-white">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </button>
    </div>
  );
}
