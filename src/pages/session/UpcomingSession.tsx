import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header/Header';
import { UpcomingSessionCard } from '@/components/Session/UpcomingSessionCard';

const UpcomingSession = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Header activeTab="Sessions" />
      <div className="py-10">
        <UpcomingSessionCard onJoin={() => navigate('/session-room')} />
      </div>
    </div>
  );
};

export default UpcomingSession;