import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header/Header';
import { Video, VideoOff, Mic, MicOff, Monitor, LogOut, Clock, X } from 'lucide-react';

const SessionRoom: React.FC = () => {
    const navigate = useNavigate();
    const [isCamOn, setIsCamOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isSharing, setIsSharing] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        let timer: any;
        if (hasJoined) {
            timer = setInterval(() => {
                setTimeElapsed((prev) => {
                    const nextTime = prev + 1;
                    if (nextTime === 3300) setShowWarning(true);
                    return nextTime;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [hasJoined]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#22272E] flex flex-col font-sans">
            <Header activeTab="Sessions" />

            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative">
                {showWarning && (
                    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-[#E74C3C] text-white px-6 py-3 rounded-[16px] shadow-2xl z-[100] animate-bounce-in flex items-center gap-3 border border-white/20">
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[14px] font-bold">5 Minutes Remaining</p>
                            <p className="text-[11px] opacity-80 font-medium">Please start wrapping up your session.</p>
                        </div>
                        <button
                            onClick={() => setShowWarning(false)}
                            className="ml-2 hover:bg-white/10 p-1 rounded-md transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {hasJoined && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white font-bold text-lg tracking-wider opacity-90">
                        {formatTime(timeElapsed)}
                    </div>
                )}

                {!hasJoined && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#2D333B]/80 backdrop-blur-md px-6 py-2.5 rounded-2xl flex items-center gap-3 border border-white/5 shadow-2xl z-10 transition-all">
                        <img
                            src="https://api.dicebear.com/7.x/notionists/svg?seed=Curtis&backgroundColor=b6e3f4"
                            alt="Curtis"
                            className="w-10 h-10 rounded-xl object-cover bg-white/10"
                        />
                        <div className="text-left">
                            <h3 className="text-white text-[14px] font-bold leading-tight">Curtis Welsh</h3>
                            <p className="text-gray-400 text-[11px] font-medium leading-tight">Waiting for Ade to join the call</p>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-[1240px] flex flex-col md:flex-row gap-4 flex-1 items-center justify-center my-12">

                    <div className={`relative bg-[#2D333B] rounded-[24px] border border-white/5 shadow-2xl flex items-center justify-center transition-all duration-500 overflow-hidden ${hasJoined ? 'flex-1 aspect-video' : 'w-full max-w-[900px] aspect-video'}`}>
                        {!isCamOn ? (
                            <div className="w-full h-full flex items-center justify-center bg-[#24292F]">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/10 bg-gray-700 shadow-xl transform transition-transform hover:scale-105">
                                    <img
                                        src="https://api.dicebear.com/7.x/notionists/svg?seed=Adam&backgroundColor=ffdfbf"
                                        alt="Adam"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                <img
                                    src="/Video-Cell.png"
                                    alt="Video feed"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] font-bold border border-white/10">
                            Adam jallad
                        </div>
                    </div>

                    {hasJoined && (
                        <div className="relative bg-[#2D333B] rounded-[24px] border border-white/5 shadow-2xl flex items-center justify-center transition-all duration-500 flex-1 aspect-video overflow-hidden animate-fade-in">
                            <div className="w-full h-full relative">
                                <img
                                    src="/Video-Cell.png"
                                    alt="Curtis feed"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[11px] font-bold border border-white/10">
                                Curtis Welsh
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 py-6">
                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsCamOn(!isCamOn)}
                            className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center shadow-lg transition-all active:scale-95 ${isCamOn ? 'bg-[#2D333B] text-white hover:bg-[#383E48]' : 'bg-red-500 text-white'}`}
                        >
                            {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                        </button>
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-tight">Cam</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => setIsMicOn(!isMicOn)}
                            className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center shadow-lg transition-all active:scale-95 ${isMicOn ? 'bg-[#2D333B] text-white hover:bg-[#383E48]' : 'bg-red-500 text-white'}`}
                        >
                            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                        </button>
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-tight">Mic</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => {
                                setIsSharing(!isSharing);
                                setHasJoined(!hasJoined);
                            }}
                            className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center shadow-lg transition-all active:scale-95 ${isSharing ? 'bg-[#3E8FCC] text-white' : 'bg-[#2D333B] text-white hover:bg-[#383E48]'}`}
                        >
                            <Monitor className="w-6 h-6" />
                        </button>
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-tight">Share</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <button
                            onClick={() => navigate('/session-feedback/3b6f1d2e-1111-4b2c-9c2f-1a2b3c4d5e6f')}
                            className="w-[60px] h-[60px] bg-[#E74C3C] hover:bg-[#C0392B] text-white rounded-[18px] flex items-center justify-center shadow-lg transition-all active:scale-95 group"
                        >
                            <LogOut className="w-6 h-6 transform rotate-180 transition-transform group-hover:-translate-x-1" />
                        </button>
                        <span className="text-gray-400 text-[11px] font-bold uppercase tracking-tight">Leave</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SessionRoom;
