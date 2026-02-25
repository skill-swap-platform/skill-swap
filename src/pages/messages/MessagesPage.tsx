import { useState } from 'react';
import {
    Search,
    Menu,
    MoreVertical,
    ChevronLeft,
    Calendar,
    Clock,
    Paperclip,
    Camera,
    Image as ImageIcon,
    Smile,
    ThumbsUp,
    Send,
    X,
    FileText
} from 'lucide-react';
import Header from '@/components/Header/Header';

// Mock Data
const mockChats = [
    {
        id: '1',
        name: 'Ahmad Al-Mansour',
        skill: 'Spanish Conversation',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9',
        online: true
    },
    {
        id: '2',
        name: 'Fatima Al-Zahra',
        skill: 'UIUX Design',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9',
        online: false
    },
    {
        id: '3',
        name: 'Omar Khalil',
        skill: 'Product Design',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9',
        online: true
    },
    {
        id: '4',
        name: 'Leyla Hassan',
        skill: 'English Conversation',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9',
        online: false
    },
    {
        id: '5',
        name: 'Zaid Ibrahim',
        skill: 'Music',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9',
        online: true
    },
    {
        id: '6',
        name: 'Noor Al-Din',
        skill: 'Art',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9',
        online: false
    },
    {
        id: '7',
        name: 'Mariam Abbas',
        skill: 'UIUX Design',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9',
        online: true
    }
];

const mockMessages = [
    { id: '1', chatId: '1', senderId: 'me', text: "Hi! I'm excited to learn Spanish with you!", time: '16:14 AM' },
    { id: '2', chatId: '1', senderId: 'them', text: "Hello! Me too! When would you like to start?", time: '16:14 AM' },
    { id: '3', chatId: '1', senderId: 'me', text: "How about tomorrow afternoon?", time: '16:14 AM' },
    { id: '4', chatId: '1', senderId: 'them', text: "Perfect! 3pm works for me", time: '16:14 AM' },
    { id: '5', chatId: '1', senderId: 'them', text: "Great! See you tomorrow at 3pm", time: '16:14 AM' },
];

const quickReplies = [
    "Sounds good!", "I'm available tomorrow", "I'll be there!", "What time works best for you?", "Can we reschedule?", "How long will the session be?", "I'll be there!", "I'll be there!"
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState(mockChats[0]);
    const [messageText, setMessageText] = useState('');
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        setMessageText('');
    };

    return (
        <div className="flex flex-col h-screen bg-[#F3F7FA] overflow-hidden">
            <Header activeTab="Chat" />

            <div className="flex-1 flex overflow-hidden">
                <aside className={`${isSidebarOpen ? 'w-full md:w-[320px]' : 'w-0 md:w-0'} bg-white border-r border-[#E8ECEF] flex flex-col transition-all duration-300 overflow-hidden shrink-0 z-10`}>
                    <div className="p-4 flex items-center gap-3">
                        <button className="p-1 hover:bg-gray-100 rounded-lg">
                            <Menu className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-[#F3F5F7] rounded-xl py-2 pl-9 pr-4 text-[14px] outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
                        {mockChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => {
                                    setSelectedChat(chat);
                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                }}
                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedChat.id === chat.id ? 'bg-[#E3EBF2]' : 'hover:bg-gray-50'}`}
                            >
                                <div className="shrink-0">
                                    <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[14px] font-bold text-gray-900 truncate">{chat.name}</h3>
                                        <span className="text-[10px] text-gray-400 font-medium">{chat.time}</span>
                                    </div>
                                    <div className="inline-block bg-[#DDE6ED] text-[#4A7292] text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5">
                                        {chat.skill}
                                    </div>
                                    <p className="text-[11px] text-gray-400 truncate mt-1 leading-normal font-medium">{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className={`flex-1 flex flex-col bg-[#F3F7FA] overflow-hidden relative ${!isSidebarOpen ? 'w-full' : 'hidden md:flex'}`}>
                    <header className="h-[64px] flex items-center justify-between px-4 border-b border-[#E8ECEF] shrink-0 bg-white">
                        <div className="flex items-center gap-3">
                            <button className="p-1 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            </button>
                            <div className="flex items-center gap-3">
                                <img src={selectedChat.avatar} alt={selectedChat.name} className="w-9 h-9 rounded-full object-cover" />
                                <div>
                                    <h2 className="text-[14px] font-bold text-gray-900">{selectedChat.name}</h2>
                                    <span className="inline-block bg-[#DDE6ED] text-[#4A7292] text-[10px] font-bold px-2 py-0.5 rounded-md">
                                        {selectedChat.skill}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </header>

                    <div className="bg-[#F3F7FA] px-4 py-2 border-b border-[#E8ECEF] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#3E8FCC]" />
                            <span className="text-[11px] font-bold text-gray-500">Next session</span>
                        </div>
                        <button
                            onClick={() => setShowSessionModal(true)}
                            className="text-[11px] font-bold text-gray-400 hover:text-[#3E8FCC]"
                        >
                            View
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar bg-[#F3F7FA]">
                        {mockMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                                    {msg.senderId === 'them' && (
                                        <div className="bg-white border border-[#E8ECEF] rounded-2xl p-4 shadow-sm relative mb-1 min-w-[200px]">
                                            <p className="text-[13px] font-bold text-gray-900 mb-1">{selectedChat.name}</p>
                                            <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{msg.text}</p>
                                            <span className="text-[10px] text-gray-300 font-bold block mt-2 text-right">{msg.time}</span>
                                        </div>
                                    )}
                                    {msg.senderId === 'me' && (
                                        <div className="bg-[#41769F] text-white rounded-2xl p-4 shadow-sm relative mb-0 min-w-[200px]">
                                            <p className="text-[13px] leading-relaxed font-medium">{msg.text}</p>
                                            <span className="text-[10px] text-blue-100/50 font-bold block mt-1 text-right">{msg.time}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <footer className="p-4 bg-white border-t border-[#E8ECEF]">
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {quickReplies.map((reply, i) => (
                                <button
                                    key={i}
                                    className="whitespace-nowrap px-3 py-1.5 bg-white border border-[#E8ECEF] rounded-xl text-[11px] font-bold text-gray-500 hover:border-[#3E8FCC] hover:text-[#3E8FCC] transition-all"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-[#F3F5F7] rounded-3xl p-1.5 px-3">
                            <div className="flex items-center gap-1 shrink-0">
                                <button className="p-2 hover:bg-white rounded-full transition-all text-gray-400">
                                    <Paperclip className="w-5 h-5 rotate-45" />
                                </button>
                                <button className="p-2 hover:bg-white rounded-full transition-all text-gray-400">
                                    <Camera className="w-5 h-5" />
                                </button>
                                <button className="p-2 hover:bg-white rounded-full transition-all text-gray-400">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <input
                                type="text"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Message..."
                                className="flex-1 bg-transparent outline-none text-[14px] text-gray-700 py-2 placeholder:text-gray-400 font-medium"
                            />

                            <div className="flex items-center gap-1 shrink-0">
                                <button className="p-2 text-gray-400 hover:text-[#3E8FCC]">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    className="p-2 text-[#3E8FCC] hover:scale-110 transition-transform"
                                >
                                    {messageText.trim() ? <Send className="w-5 h-5" /> : <ThumbsUp className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>

            {showSessionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
                    <div className="bg-white w-full max-w-[380px] rounded-[16px] overflow-hidden shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3E8FCC]">Upcoming Session</h3>
                            <button onClick={() => setShowSessionModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[13px] font-medium text-gray-900 mb-6">{selectedChat.skill}</p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E8ECEF] bg-white">
                                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-[#3E8FCC]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-1">Session Title</p>
                                    <p className="text-[13px] font-bold text-gray-800 truncate">Basic of spanish</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E8ECEF] bg-white">
                                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-[#3E8FCC]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-1">Date</p>
                                    <p className="text-[13px] font-bold text-gray-800">Saturday, Dec 16</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E8ECEF] bg-white">
                                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
                                    <Clock className="w-5 h-5 text-[#3E8FCC]" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold leading-none mb-1">Time</p>
                                    <p className="text-[13px] font-bold text-gray-800">3:00 PM - 4:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-4 mt-2">
                            <img src={selectedChat.avatar} className="w-10 h-10 rounded-full border border-gray-100" alt="" />
                            <div>
                                <p className="text-[14px] font-bold text-gray-900">{selectedChat.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold">Your learning partner</p>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] p-5 rounded-lg space-y-3 mt-2">
                            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Session Tips</p>
                            <ul className="space-y-2">
                                {["Test your camera and microphone before joining", "Find a quiet space with good lighting", "Prepare any questions or topics to discuss"].map((tip, i) => (
                                    <li key={i} className="text-[12px] text-gray-500 flex items-start gap-3 leading-snug">
                                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-[#3E8FCC] rounded-full" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3 pt-6">
                            <button className="w-full py-4 bg-[#41769F] text-white rounded-lg font-bold text-[15px] hover:bg-[#32628A] transition-all">Join Session</button>
                            <button
                                onClick={() => {
                                    setShowSessionModal(false);
                                    setShowRescheduleModal(true);
                                }}
                                className="w-full py-4 bg-white border border-[#E8ECEF] text-[#3E8FCC] rounded-lg font-bold text-[15px] hover:bg-gray-50 transition-all"
                            >
                                Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
                    <div className="bg-white w-full max-w-[380px] rounded-[16px] overflow-hidden shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#3E8FCC]">Upcoming Session</h3>
                            <button onClick={() => setShowRescheduleModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-[15px] font-bold text-gray-900 mb-6">{selectedChat.skill}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-gray-400 uppercase mb-1.5 block">Session Title</label>
                                <input type="text" defaultValue="Basic of Spanish" className="w-full bg-white border border-[#E8ECEF] rounded-lg px-4 py-3 text-[14px] font-bold text-gray-800 outline-none focus:border-[#3E8FCC]" />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-gray-400 uppercase mb-1.5 block">Date</label>
                                <div className="relative">
                                    <input type="text" defaultValue="16/10/2025" className="w-full bg-white border border-[#E8ECEF] rounded-lg px-4 py-3 text-[14px] font-bold text-gray-800 outline-none focus:border-[#3E8FCC]" />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase mb-1.5 block">Start</label>
                                    <div className="relative">
                                        <input type="text" defaultValue="02:00 pm" className="w-full bg-white border border-[#E8ECEF] rounded-lg px-4 py-3 text-[14px] font-bold text-gray-800 outline-none focus:border-[#3E8FCC]" />
                                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <span className="mt-6 text-gray-400 text-sm">to</span>
                                <div className="flex-1">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase mb-1.5 block">End</label>
                                    <div className="relative">
                                        <input type="text" defaultValue="03:00 pm" className="w-full bg-white border border-[#E8ECEF] rounded-lg px-4 py-3 text-[14px] font-bold text-gray-800 outline-none focus:border-[#3E8FCC]" />
                                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 py-4 border-t border-b border-gray-50 mt-4">
                                <img src={selectedChat.avatar} className="w-10 h-10 rounded-full border border-gray-100" alt="" />
                                <div>
                                    <p className="text-[14px] font-bold text-gray-900">{selectedChat.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold">Your learning partner</p>
                                </div>
                            </div>

                            <div className="bg-[#F8FAFC] p-4 rounded-lg space-y-2">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rescheduling Tips</p>
                                <ul className="space-y-1.5">
                                    {["Chose a time that works for both of you", "Your partner will be notified at the time you have chosen", "Double-check your availability before confirming"].map((tip, i) => (
                                        <li key={i} className="text-[11px] text-gray-500 flex items-start gap-2 font-medium">
                                            <span className="mt-1 flex-shrink-0 w-1 h-1 bg-gray-300 rounded-full" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button className="w-full py-4 bg-[#41769F] text-white rounded-lg font-bold text-[15px] hover:bg-[#32628A] transition-all">Confirm</button>
                                <button onClick={() => setShowRescheduleModal(false)} className="w-full py-4 bg-white border border-[#E8ECEF] text-[#41769F] rounded-lg font-bold text-[15px] hover:bg-gray-50 transition-all">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
