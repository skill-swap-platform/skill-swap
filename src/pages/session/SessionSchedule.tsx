import React from "react";
import { UpcomingSessionCard } from "./UpcomingSessionCard";

export type Session = {
  id: string;
  category: string;
  title: string;
  date: string;
  time: string;
  partnerName: string;
};

type SessionScheduleProps = {
  sessions: Session[];
};

export const SessionSchedule: React.FC<SessionScheduleProps> = ({
  sessions,
}) => {
  if (!sessions.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
        <p className="text-sm text-slate-500">No upcoming sessions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <UpcomingSessionCard
          key={session.id}
          category={session.category}
          sessionTitle={session.title}
          dateLabel={session.date}
          timeLabel={session.time}
          partnerName={session.partnerName}
          onJoin={() => handleJoin(session.id)}
          onReschedule={() => handleReschedule(session.id)}
        />
      ))}
    </div>
  );
};

function handleJoin(sessionId: string) {
  console.log("Joining session:", sessionId);
  // open modal
}

function handleReschedule(sessionId: string) {
  console.log("Rescheduling session:", sessionId);
  // open modal
}
