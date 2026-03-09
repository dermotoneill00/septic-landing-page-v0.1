import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ChevronRight } from "lucide-react";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

type QuickReply = {
  label: string;
  answer: string;
  followUps?: QuickReply[];
};

const QUICK_REPLIES: QuickReply[] = [
  {
    label: "What does ProGuard cover?",
    answer:
      "ProGuard covers septic pump failures, tank structural issues, drain field problems, distribution box failures, baffle repairs, and up to 2 emergency pump-outs per year. No inspection required to enroll.",
    followUps: [
      {
        label: "What's NOT covered?",
        answer:
          "ProGuard does not cover cesspools, systems installed less than 12 months ago, damage from neglect or misuse, or pre-existing conditions known at enrollment.",
      },
      {
        label: "How do I file a claim?",
        answer:
          "Call our claims line at 1-800-PRO-GUARD (available 24/7). Have your policy number ready. A licensed technician will be dispatched within 48 hours — we pay them directly so there's nothing out of pocket for you.",
      },
    ],
  },
  {
    label: "How do I file a claim?",
    answer:
      "Call 1-800-PRO-GUARD anytime — we're available 24/7. Have your policy number handy. We dispatch a licensed technician within 48 hours and pay them directly. You pay nothing out of pocket.",
    followUps: [
      {
        label: "What info do I need?",
        answer:
          "Just your policy number and a description of the problem — we handle the rest. You'll find your policy number at the top of your portal dashboard.",
      },
    ],
  },
  {
    label: "How much does it cost?",
    answer:
      "ProGuard is $499/year — less than the average cost of a single septic pump replacement ($600–$2,500). No deductibles, no surprise bills. One flat annual rate.",
    followUps: [
      {
        label: "How do I enroll?",
        answer:
          "Click "Get Protected" on the homepage and complete the 3-minute enrollment form. You'll receive a portal invite by email within minutes.",
      },
    ],
  },
  {
    label: "When does coverage start?",
    answer:
      "Coverage begins immediately upon enrollment for systems installed more than 12 months ago. There's no waiting period for qualified systems.",
  },
  {
    label: "Talk to a real person",
    answer:
      "We'd love to help! Call us at 1-800-PRO-GUARD or email support@proguardplans.com. Our team is available Monday–Friday 8am–6pm ET, with emergency claims support 24/7.",
  },
];

let msgId = 0;
const uid = () => ++msgId;

const WELCOME: Message = {
  id: uid(),
  role: "bot",
  text: "👋 Hi! I'm the ProGuard assistant. How can I help you today?",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [currentReplies, setCurrentReplies] = useState<QuickReply[]>(QUICK_REPLIES);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [open, messages]);

  const pushBot = (text: string, followUps?: QuickReply[]) => {
    setMessages((m) => [...m, { id: uid(), role: "bot", text }]);
    setCurrentReplies(followUps ?? QUICK_REPLIES);
    if (!open) setUnread((n) => n + 1);
  };

  const pushUser = (text: string) => {
    setMessages((m) => [...m, { id: uid(), role: "user", text }]);
  };

  const handleQuickReply = (qr: QuickReply) => {
    pushUser(qr.label);
    setTimeout(() => pushBot(qr.answer, qr.followUps), 400);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    pushUser(text);
    setTimeout(() => {
      pushBot(
        "Thanks for your message! Our support team will follow up via email within a few hours. For urgent issues, call 1-800-PRO-GUARD — we're available 24/7.",
        QUICK_REPLIES
      );
    }, 500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
        {!open && (
          <div className="bg-white border border-border rounded-xl shadow-lg px-3 py-2 text-sm text-foreground max-w-[200px] text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
            Questions? Ask us anything.
          </div>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="relative h-14 w-14 rounded-full bg-[#1B5E3B] text-white shadow-xl flex items-center justify-center hover:bg-[#164d31] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E3B] focus:ring-offset-2"
          aria-label={open ? "Close chat" : "Open chat"}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          {!open && unread > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[340px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl border border-border bg-background flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#1B5E3B] px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">ProGuard Support</p>
              <p className="text-white/70 text-xs">Typically replies instantly</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-white/70 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[320px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1B5E3B] text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {currentReplies.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {currentReplies.map((qr) => (
                <button
                  key={qr.label}
                  onClick={() => handleQuickReply(qr)}
                  className="inline-flex items-center gap-1 text-xs rounded-full border border-[#1B5E3B]/40 text-[#1B5E3B] px-2.5 py-1 hover:bg-[#1B5E3B]/10 transition-colors font-medium"
                >
                  {qr.label}
                  <ChevronRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border px-3 py-2 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="h-8 w-8 rounded-full bg-[#1B5E3B] text-white flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-[#164d31]"
              aria-label="Send"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
