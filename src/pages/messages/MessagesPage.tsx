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
import { Header } from '@/components';

// Mock Data 
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9';

const mockChats = [
    {
        id: '1',
        name: 'Ahmad Al-Mansour',
        skill: 'Spanish Conversation',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: DEFAULT_AVATAR,
        online: true
    },
    {
        id: '2',
        name: 'Fatima Al-Zahra',
        skill: 'UIUX Design',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: DEFAULT_AVATAR,
        online: false
    },
    {
        id: '3',
        name: 'Omar Khalil',
        skill: 'Product Design',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: DEFAULT_AVATAR,
        online: true
    },
    {
        id: '4',
        name: 'Leyla Hassan',
        skill: 'English Conversation',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: DEFAULT_AVATAR,
        online: false
    },
    {
        id: '5',
        name: 'Zaid Ibrahim',
        skill: 'Music',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: DEFAULT_AVATAR,
        online: true
    },
    {
        id: '6',
        name: 'Noor Al-Din',
        skill: 'Art',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: DEFAULT_AVATAR,
        online: false
    },
    {
        id: '7',
        name: 'Mariam Abbas',
        skill: 'UIUX Design',
        lastMessage: 'well I hope it goes well I hope it goes well....',
        time: '16:14 AM',
        avatar: DEFAULT_AVATAR,
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
    "Sounds good!", "I'm available tomorrow", "I'll be there!", "What time works best for you?", "Can we reschedule?", "How long will the session be?"
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
        <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
            <Header activeTab="Chat" />

            <div className="flex-1 flex overflow-hidden">
                <aside className={`${isSidebarOpen ? 'w-full md:w-[380px]' : 'w-0 md:w-0'} bg-white border-r border-slate-100 flex flex-col transition-all duration-300 overflow-hidden shrink-0 z-10 shadow-sm`}>
                    <div className="p-5 flex items-center gap-3">
                        <button className="md:hidden p-2 hover:bg-slate-50 rounded-full" onClick={() => setIsSidebarOpen(false)}>
                            <ChevronLeft className="w-5 h-5 text-slate-500" />
                        </button>
                        <div className="flex-1 flex items-center bg-slate-50 rounded-2xl px-4 py-2.5 gap-3 border border-slate-100/50 transition-all focus-within:bg-white focus-within:border-blue-200 focus-within:shadow-sm">
                            <Menu className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                className="bg-transparent outline-none w-full text-[13px] text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {mockChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => {
                                    setSelectedChat(chat);
                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                }}
                                className={`group flex items-center gap-4 p-4 mx-2 my-1 rounded-2xl cursor-pointer transition-all duration-200 ${selectedChat.id === chat.id ? 'bg-blue-50/80 shadow-sm' : 'hover:bg-slate-50'}`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                                        <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                                    </div>
                                    {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h3 className={`text-[13.5px] font-bold truncate transition-colors ${selectedChat.id === chat.id ? 'text-blue-700' : 'text-slate-800'}`}>{chat.name}</h3>
                                        <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                                    </div>
                                    <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1 transition-colors ${selectedChat.id === chat.id ? 'bg-blue-200/50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {chat.skill}
                                    </div>
                                    <p className={`text-[12px] truncate ${selectedChat.id === chat.id ? 'text-blue-600/70' : 'text-slate-500'}`}>{chat.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className={`flex-1 flex flex-col bg-[#F1F5F9] overflow-hidden relative ${!isSidebarOpen ? 'w-full' : 'hidden md:flex'}`}>
                    <header className="h-[72px] flex items-center justify-between px-6 border-b border-slate-100 shrink-0 bg-white/80 backdrop-blur-md z-10">
                        <div className="flex items-center gap-4">
                            <button className="md:hidden p-2 hover:bg-slate-50 rounded-full" onClick={() => setIsSidebarOpen(true)}>
                                <ChevronLeft className="w-5 h-5 text-slate-500" />
                            </button>
                            <div className="relative">
                                <img src={selectedChat.avatar} alt={selectedChat.name} className="w-11 h-11 rounded-xl border border-slate-100" />
                                {selectedChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div>
                                <h2 className="text-[15px] font-black text-slate-800">{selectedChat.name}</h2>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{selectedChat.online ? 'Active Now' : 'Offline'}</span>
                                    <span className="text-slate-200">|</span>
                                    <span className="text-[11px] text-blue-500 font-black tracking-tight cursor-pointer hover:underline">{selectedChat.skill}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </header>

                    <div className="bg-blue-50/50 px-6 py-2.5 flex items-center justify-between shrink-0 border-b border-blue-200/30">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-[12px] font-bold text-blue-600">Upcoming session on Saturday, Dec 16</span>
                        </div>
                        <button
                            onClick={() => setShowSessionModal(true)}
                            className="text-[11px] bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-bold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            View Details
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide z-[1]">
                        {mockMessages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[80%] md:max-w-[70%] px-5 py-4 rounded-[22px] relative shadow-sm ${msg.senderId === 'me'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                                    }`}>
                                    <p className="text-[14px] md:text-[14.5px] leading-relaxed font-medium">{msg.text}</p>
                                    <div className={`flex items-center gap-1.5 mt-2 ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <span className={`text-[10px] font-bold ${msg.senderId === 'me' ? 'text-blue-100/70' : 'text-slate-400'}`}>
                                            {msg.time}
                                        </span>
                                        {msg.senderId === 'me' && <ThumbsUp className="w-3 h-3 text-blue-100/70" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <footer className="p-5 bg-white border-t border-slate-100 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
                            {quickReplies.map((reply, i) => (
                                <button
                                    key={i}
                                    className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-white transition-all shadow-sm"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 md:gap-4 bg-slate-100/50 p-2 rounded-[28px] border border-slate-100 transition-all focus-within:bg-white focus-within:border-blue-200 focus-within:shadow-md">
                            <div className="flex gap-1.5 pl-2">
                                <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-blue-500">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-blue-500">
                                    <Camera className="w-5 h-5" />
                                </button>
                                <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-blue-500">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 flex items-center min-h-[48px]">
                                <textarea
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="flex-1 bg-transparent outline-none text-[14px] text-slate-700 resize-none max-h-32 py-3 placeholder:text-slate-400 font-medium"
                                    rows={1}
                                />
                                <button className="p-2.5 text-slate-400 hover:text-blue-500 transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>

                            <button
                                onClick={handleSendMessage}
                                className={`p-3.5 rounded-full transition-all flex items-center justify-center ${messageText.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105 active:scale-95' : 'text-slate-300 hover:text-blue-500'}`}
                            >
                                {messageText.trim() ? <Send className="w-5 h-5" /> : <ThumbsUp className="w-5 h-5" />}
                            </button>
                        </div>
                    </footer>
                </main>
            </div>

            {showSessionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-[420px] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
                            <h3 className="text-[12px] font-black uppercase tracking-widest text-blue-600">Upcoming Session</h3>
                            <button onClick={() => setShowSessionModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <h4 className="text-2xl font-black text-slate-900 leading-tight">{selectedChat.skill}</h4>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 transition-hover hover:border-blue-100">
                                    <div className="p-3 bg-blue-100/50 rounded-xl">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Session Title</p>
                                        <p className="text-[15px] font-bold text-slate-800">Basic of spanish</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 transition-hover hover:border-blue-100">
                                    <div className="p-3 bg-blue-100/50 rounded-xl">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Date</p>
                                        <p className="text-[15px] font-bold text-slate-800">Saturday, Dec 16</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 transition-hover hover:border-blue-100">
                                    <div className="p-3 bg-blue-100/50 rounded-xl">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Time</p>
                                        <p className="text-[15px] font-bold text-slate-800">3:00 PM - 4:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2 px-1">
                                <img src={selectedChat.avatar} className="w-12 h-12 rounded-lg border border-slate-100 shadow-sm" alt="" />
                                <div>
                                    <p className="text-[15px] font-black text-slate-900">{selectedChat.name}</p>
                                    <p className="text-[12px] text-slate-400 font-medium">Your learning partner</p>
                                </div>
                            </div>

                            <div className="bg-blue-50/50 p-5 rounded-lg border border-blue-100/30 space-y-4">
                                <p className="text-[12px] font-black text-blue-600 uppercase tracking-wider">Session Tips</p>
                                <ul className="space-y-3">
                                    {[
                                        "Test your camera and microphone before joining",
                                        "Find a quiet space with good lighting",
                                        "Prepare any questions or topics to discuss"
                                    ].map((tip, i) => (
                                        <li key={i} className="flex items-start gap-3 text-[12px] text-slate-500 leading-snug">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0 shadow-sm shadow-blue-200" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-black text-[15px] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Join Session
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRescheduleModal(true);
                                        setShowSessionModal(false);
                                    }}
                                    className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-lg font-black text-[15px] hover:bg-slate-50 hover:border-slate-200 transition-all"
                                >
                                    Reschedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showRescheduleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-[420px] rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 text-center">
                            <div className="flex-1">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Reschedule Session</h3>
                                <p className="text-[16px] font-black text-slate-900">{selectedChat.skill}</p>
                            </div>
                            <button onClick={() => setShowRescheduleModal(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors absolute right-6">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Session Title</label>
                                <input
                                    type="text"
                                    defaultValue="Basic of Spanish"
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-lg px-5 text-[15px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Date</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        defaultValue="16/10/2025"
                                        className="w-full h-14 bg-slate-50 border border-slate-100 rounded-lg px-5 text-[15px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all cursor-pointer"
                                    />
                                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Start Time</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            defaultValue="02:00 pm"
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-lg px-5 text-[15px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all cursor-pointer"
                                        />
                                        <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">End Time</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            defaultValue="03:00 pm"
                                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-lg px-5 text-[15px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-400 focus:shadow-sm transition-all cursor-pointer"
                                        />
                                        <Clock className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                                <img src={selectedChat.avatar} className="w-12 h-12 rounded-lg border border-slate-100 shadow-sm" alt="" />
                                <div>
                                    <p className="text-[15px] font-black text-slate-900">{selectedChat.name}</p>
                                    <p className="text-[12px] text-slate-400 font-medium">Your learning partner</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 space-y-3">
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Rescheduling Tips</p>
                                <ul className="space-y-2">
                                    {[
                                        "Choose a time that works for both of you",
                                        "Your partner will be notified instantly",
                                        "Double-check your availability before confirming"
                                    ].map((tip, i) => (
                                        <li key={i} className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <button className="w-full py-4 bg-blue-600 text-white rounded-lg font-black text-[15px] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Confirm Reschedule
                                </button>
                                <button
                                    onClick={() => setShowRescheduleModal(false)}
                                    className="w-full py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-lg font-black text-[15px] hover:bg-slate-50 hover:border-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
