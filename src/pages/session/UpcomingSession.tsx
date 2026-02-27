import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { UpcomingSessionCard } from '@/components/Session/UpcomingSessionCard';
import { sessionService } from '@/api/services/session.service';
import { userService } from '@/api/services/user.service';
import { Loader2 } from 'lucide-react';

const UpcomingSession = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const fetchFirstUpcoming = async () => {
      try {
        setIsLoading(true);
        const [userRes, sessionsRes] = await Promise.all([
          userService.getCurrentProfile(),
          sessionService.getHistory({ status: 'SCHEDULED' }),
        ]);
        if (sessionsRes.success && userRes.success) {
          const raw = sessionsRes.data?.data || [];
          if (raw.length > 0) {
            const s = raw[0];
            const isHost = s.host?.id === userRes.data.id;
            const partner = isHost ? s.attendee : s.host;
            setSession({
              id: s.id,
              title: s.skill?.name || s.title || 'Skill Session',
              date: new Date(s.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
              time: new Date(s.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              partnerName: partner?.userName || 'Partner',
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch upcoming session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFirstUpcoming();
  }, []);

  const handleMarkComplete = async () => {
    if (!session?.id) return;
    setIsCompleting(true);
    try {
      await sessionService.completeSession(session.id, 'Completed from Upcoming Sessions');
      navigate(`/session-feedback/${session.id}`);
    } catch {
      navigate(`/session-feedback/${session.id}`);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Header activeTab="Sessions" />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-[#3E8FCC] animate-spin" />
              <p className="text-sm text-gray-500">Loading your upcoming session...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <UpcomingSessionCard
                sessionTitle={session?.title}
                dateLabel={session?.date}
                timeLabel={session?.time}
                partnerName={session?.partnerName}
                onJoin={() => navigate('/session-room')}
              />

              {session?.id && (
                <div className="mt-2 w-full max-w-sm">
                  <button
                    onClick={handleMarkComplete}
                    disabled={isCompleting}
                    className="w-full h-11 rounded-xl border-2 border-[#3E8FCC] bg-white text-[#3E8FCC] hover:bg-blue-50 text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 group"
                  >
                    {isCompleting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                    ) : (
                      <>✓ Mark as Completed</>
                    )}
                  </button>
                  <p className="mt-3 text-[11px] text-gray-400 text-center px-4">
                    Once completed, you'll be redirected to provide feedback and unlock potential badges.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpcomingSession;