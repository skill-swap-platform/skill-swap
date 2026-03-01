import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { UpcomingSessionCard } from '@/components/Session/UpcomingSessionCard';
import { sessionService } from '@/api/services/session.service';
import { userService } from '@/api/services/user.service';
import { Loader2 } from 'lucide-react';

interface UpcomingSessionViewModel {
  id: string;
  title: string;
  date: string;
  time: string;
  partnerName: string;
}

const UpcomingSession = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<UpcomingSessionViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            const startTime = new Date(s.scheduledAt);
            const endTime = s.duration ? new Date(startTime.getTime() + s.duration * 60000) : null;
            const timeStr = endTime
              ? `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
              : startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            setSession({
              id: s.id,
              title: s.skill?.name || s.title || 'Skill Session',
              date: new Date(s.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
              time: timeStr,
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
                onJoin={() => navigate('/session-room', { state: { sessionId: session?.id } })}
              />

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UpcomingSession;
