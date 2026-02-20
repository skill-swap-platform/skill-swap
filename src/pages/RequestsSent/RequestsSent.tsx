import React, { useEffect, useRef, useState } from 'react';
import { RequestTabs } from '../../components/requests/RequestTabs';
import { StatusFilterTabs } from '../../components/requests/StatusFilterTabs';
import type { RequestStatus } from '../../components/requests/StatusFilterTabs';
import { RequestCard } from '../../components/requests/RequestCard';
import type { RequestCardProps } from '../../components/requests/RequestCard';
import { RequestDetailsPanel } from '../../components/requests/RequestDetailsPanel';
import { ReceivedRequestDetailsPanel } from '../../components/requests/ReceivedRequestDetailsPanel';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

// Sample data - Sent requests (replace with actual data from API)
const sampleSentRequests: RequestCardProps[] = [
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    offeredSkill: 'React Basics',
    status: 'pending',
    sessionType: 'skill-swap',
    sentTime: 'Sent 2 days ago',
  },
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    offeredSkill: 'React Basics',
    status: 'accepted',
    sessionType: 'skill-swap',
    sentTime: 'Sent 2 days ago',
  },
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    offeredSkill: 'React Basics',
    status: 'accepted',
    sessionType: 'skill-swap',
    sentTime: 'Sent 2 days ago',
  },
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    status: 'declined',
    sessionType: 'free-session',
    sentTime: 'Sent 2 days ago',
  },
];

// Sample data - Received requests (replace with actual data from API)
const sampleReceivedRequests: RequestCardProps[] = [
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    offeredSkill: 'React Basics',
    status: 'pending',
    sessionType: 'skill-swap',
    sentTime: 'Received 2 days ago',
  },
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    offeredSkill: 'React Basics',
    status: 'accepted',
    sessionType: 'skill-swap',
    sentTime: 'Received 2 days ago',
  },
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    offeredSkill: 'React Basics',
    status: 'accepted',
    sessionType: 'skill-swap',
    sentTime: 'Received 2 days ago',
  },
  {
    userName: 'Haya Al Rubi',
    userAvatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=haya',
    userRating: 4.9,
    requestedSkill: 'Photography Basics',
    status: 'declined',
    sessionType: 'free-session',
    sentTime: 'Received 2 days ago',
  },
];

export const RequestsSent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [activeFilter, setActiveFilter] = useState<RequestStatus>('all');
  const [selectedRequest, setSelectedRequest] = useState<RequestCardProps | null>(null);
  const detailsPanelRef = useRef<HTMLDivElement | null>(null);

  // Get appropriate requests based on active tab
  const currentRequests = activeTab === 'sent' ? sampleSentRequests : sampleReceivedRequests;

  // Filter requests based on active filter
  const filteredRequests = currentRequests.filter((request) => {
    if (activeFilter === 'all') return true;
    return request.status === activeFilter;
  });

  const handleRequestClick = (request: RequestCardProps) => {
    setSelectedRequest(request);
  };

  const handleClosePanel = () => {
    setSelectedRequest(null);
  };

  const handleCancelRequest = (request: RequestCardProps) => {
    console.log('Cancel request:', request);
    // Handle cancel request logic
    setSelectedRequest(null);
  };

  const handleAcceptRequest = (request: RequestCardProps) => {
    console.log('Accept request:', request);
    // Handle accept request logic
    setSelectedRequest(null);
  };

  const handleDeclineRequest = (
    request: RequestCardProps,
    metadata: { reason: string; additionalContext?: string }
  ) => {
    console.log('Decline request:', request, metadata);
    // Handle decline request logic
    setSelectedRequest(null);
  };

  const handleViewProfile = (userName: string) => {
    console.log('View profile:', userName);
    // Handle view profile logic
  };

  useEffect(() => {
    if (!selectedRequest) return;
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 1279px)').matches) return;

    const rafId = window.requestAnimationFrame(() => {
      detailsPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [selectedRequest, activeTab]);

  return (
    <div className="requests-page bg-[#f9fafb] flex flex-col items-center min-h-screen overflow-auto">
      {/* Header */}
      <div className="w-full">
        <Header activeTab="Requests" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 items-center w-full px-4 py-6 sm:px-6 lg:px-20">
        <div className={`flex flex-col xl:flex-row gap-6 items-start w-full transition-all duration-300 ${
          selectedRequest ? 'max-w-[1280px]' : 'max-w-[846px] justify-center'
        }`}>
          {/* Left Side - Requests List */}
          <div className="flex flex-col gap-4 items-start w-full max-w-[846px] flex-shrink-0">
            {/* Tabs */}
            <RequestTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content Area */}
            <div className="flex flex-col items-start w-full">
              {/* Status Filters */}
              <StatusFilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              {/* Request Cards Container */}
              <div className="bg-white border border-[#e5e7eb] flex flex-col gap-2 items-start justify-center p-4 rounded-bl-[10px] rounded-br-[10px] w-full">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <RequestCard
                      key={index}
                      {...request}
                      onClick={() => handleRequestClick(request)}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full py-12">
                    <p className="text-[#9ca3af] text-base">
                      No requests found for this filter
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Details Panel */}
          {selectedRequest && activeTab === 'sent' && (
            <div ref={detailsPanelRef} className="w-full xl:flex-1 min-w-0 animate-slideIn">
              <RequestDetailsPanel
                request={selectedRequest}
                isOpen={!!selectedRequest}
                onClose={handleClosePanel}
                onCancelRequest={handleCancelRequest}
                onViewProfile={handleViewProfile}
              />
            </div>
          )}
          
          {selectedRequest && activeTab === 'received' && (
            <div ref={detailsPanelRef} className="w-full xl:flex-1 min-w-0 animate-slideIn">
              <ReceivedRequestDetailsPanel
                request={selectedRequest}
                isOpen={!!selectedRequest}
                onClose={handleClosePanel}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                onViewProfile={handleViewProfile}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default RequestsSent;
