import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestTabs } from '../../components/requests/RequestTabs';
import { StatusFilterTabs } from '../../components/requests/StatusFilterTabs';
import type { RequestStatus } from '../../components/requests/StatusFilterTabs';
import { RequestCard } from '../../components/requests/RequestCard';
import type { RequestCardProps } from '../../components/requests/RequestCard';
import { RequestDetailsPanel } from '../../components/requests/RequestDetailsPanel';
import { ReceivedRequestDetailsPanel } from '../../components/requests/ReceivedRequestDetailsPanel';
import { SentRequestStatusModal } from '../../components/requests/SentRequestStatusModal';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import {
  useAcceptSwapMutation,
  useCancelSwapMutation,
  useDeclineSwapMutation,
  useReceivedSwapsQuery,
  useSentSwapsQuery,
  useSwapDetailsQuery,
} from '../../features/swaps/swaps.queries';
import type { SwapApiStatus, SwapRequest, SwapRequestStatus } from '../../features/swaps/swaps.types';

type DeclineMetadata = {
  reason: string;
  additionalContext?: string;
};

interface SwapRequestCardItem extends RequestCardProps {
  id: string;
  backendStatus: SwapRequestStatus;
  expiresAt: string;
  statusUpdatedAt?: string;
  rejectionReason?: string | null;
}

const LIST_PAGE = 1;
const LIST_LIMIT = 20;
const STATUS_MODAL_STORAGE_KEY = 'requests-sent:status-modal-seen';

const mapUiFilterToApiStatus = (filter: RequestStatus): SwapApiStatus | undefined => {
  if (filter === 'all') return undefined;
  if (filter === 'pending') return 'PENDING';
  if (filter === 'accepted') return 'ACCEPTED';
  if (filter === 'declined') return 'DECLINED';
  if (filter === 'completed') return 'COMPLETED';
  if (filter === 'cancelled') return 'CANCELLED';
  if (filter === 'expired') return 'EXPIRED';
  return undefined;
};

const mapApiStatusToCardStatus = (status: SwapRequestStatus): RequestCardProps['status'] => {
  if (status === 'PENDING') return 'pending';
  if (status === 'ACCEPTED') return 'accepted';
  if (status === 'COMPLETED') return 'completed';
  if (status === 'EXPIRED') return 'expired';
  if (status === 'CANCELLED') return 'cancelled';
  return 'declined';
};

const formatRequestTime = (createdAt: string, prefix: 'Sent' | 'Received'): string => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return `${prefix} recently`;
  }
  return `${prefix} ${date.toLocaleDateString()}`;
};

const getFallbackAvatar = (seed: string): string =>
  `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}`;

const normalizeSwapMessage = (swap: SwapRequest): string | null => {
  if (typeof swap.message === 'string') {
    const trimmed = swap.message.trim();
    if (trimmed.length > 0) return trimmed;
  }

  const fallbackCandidates = [
    (swap as SwapRequest & { note?: unknown }).note,
    (swap as SwapRequest & { requestMessage?: unknown }).requestMessage,
    (swap as SwapRequest & { description?: unknown }).description,
  ];

  for (const candidate of fallbackCandidates) {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }

  return null;
};

const mapSwapToCard = (swap: SwapRequest, tab: 'sent' | 'received'): SwapRequestCardItem => {
  const participant = tab === 'sent' ? swap.receiver : swap.requester;
  const fallbackSeed = participant?.userName ?? swap.id;

  return {
    id: swap.id,
    backendStatus: swap.status,
    expiresAt: swap.expiresAt,
    userName: participant?.userName ?? 'Unknown User',
    userAvatar: participant?.image ?? getFallbackAvatar(fallbackSeed),
    userRating: 0,
    requestedSkill: swap.requestedUserSkill?.skill?.name ?? 'Unknown Skill',
    offeredSkill: swap.offeredUserSkill?.skill?.name,
    requestedSkillLevel: swap.requestedUserSkill?.level ?? null,
    offeredSkillLevel: swap.offeredUserSkill?.level ?? null,
    status: mapApiStatusToCardStatus(swap.status),
    sessionType: swap.offeredUserSkill?.skill?.name ? 'skill-swap' : 'free-session',
    sentTime: formatRequestTime(swap.createdAt, tab === 'sent' ? 'Sent' : 'Received'),
    message: normalizeSwapMessage(swap),
    startAt: swap.startAt,
    endAt: swap.endAt,
    timezone: swap.timezone,
    statusUpdatedAt: swap.updatedAt ?? swap.createdAt,
    rejectionReason: swap.rejectionReason ?? null,
  };
};

const isExpiredByDate = (expiresAt: string): boolean => {
  const expiresAtDate = new Date(expiresAt);
  if (Number.isNaN(expiresAtDate.getTime())) return false;
  return expiresAtDate.getTime() < Date.now();
};

const matchesActiveFilter = (request: SwapRequestCardItem, filter: RequestStatus): boolean => {
  if (filter === 'all') return true;
  if (filter === 'pending') {
    return request.backendStatus === 'PENDING' && !isExpiredByDate(request.expiresAt);
  }
  if (filter === 'accepted') return request.backendStatus === 'ACCEPTED';
  if (filter === 'declined') {
    return request.backendStatus === 'DECLINED' || request.backendStatus === 'REJECTED';
  }
  if (filter === 'completed') return request.backendStatus === 'COMPLETED';
  if (filter === 'cancelled') return request.backendStatus === 'CANCELLED';
  if (filter === 'expired') {
    return request.backendStatus === 'EXPIRED' || isExpiredByDate(request.expiresAt);
  }
  return true;
};

const getDeclineReason = (metadata: DeclineMetadata): string => {
  const trimmedContext = metadata.additionalContext?.trim();
  if (trimmedContext) return trimmedContext;

  const reasonMap: Record<string, string> = {
    'not-available': 'Not available at this time',
    'not-good-match': 'Skill not a good match',
    other: 'Other',
    'no-reason': 'No reason provided',
  };

  return reasonMap[metadata.reason] ?? metadata.reason ?? 'No reason provided';
};

const isDecisionStatus = (status: SwapRequestStatus): boolean =>
  status === 'ACCEPTED' || status === 'DECLINED' || status === 'REJECTED';

const createStatusModalKey = (request: SwapRequestCardItem): string =>
  `${request.id}:${request.backendStatus}`;

const getStatusUpdatedTimestamp = (request: SwapRequestCardItem): number => {
  const date = new Date(request.statusUpdatedAt ?? '');
  if (!Number.isNaN(date.getTime())) {
    return date.getTime();
  }

  const fallback = new Date(request.startAt ?? '');
  if (!Number.isNaN(fallback.getTime())) {
    return fallback.getTime();
  }

  return 0;
};

export const RequestsSent: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [activeFilter, setActiveFilter] = useState<RequestStatus>('all');
  const [selectedRequest, setSelectedRequest] = useState<SwapRequestCardItem | null>(null);
  const [statusModalRequest, setStatusModalRequest] = useState<SwapRequestCardItem | null>(null);
  const detailsPanelRef = useRef<HTMLDivElement | null>(null);
  const seenStatusModalKeysRef = useRef<Set<string>>(new Set());
  const hasHydratedStatusKeysRef = useRef(false);

  const queryParams = useMemo(
    () => ({
      page: LIST_PAGE,
      limit: LIST_LIMIT,
      status: mapUiFilterToApiStatus(activeFilter),
    }),
    [activeFilter]
  );

  const sentSwapsQuery = useSentSwapsQuery(queryParams);
  const receivedSwapsQuery = useReceivedSwapsQuery(queryParams);

  const acceptSwapMutation = useAcceptSwapMutation();
  const declineSwapMutation = useDeclineSwapMutation();
  const cancelSwapMutation = useCancelSwapMutation();

  const sentRequests = useMemo(
    () => (sentSwapsQuery.data?.data.data ?? []).map((swap) => mapSwapToCard(swap, 'sent')),
    [sentSwapsQuery.data]
  );

  const receivedRequests = useMemo(
    () => (receivedSwapsQuery.data?.data.data ?? []).map((swap) => mapSwapToCard(swap, 'received')),
    [receivedSwapsQuery.data]
  );

  const currentRequests = activeTab === 'sent' ? sentRequests : receivedRequests;
  const selectedRequestId = selectedRequest?.id ?? '';
  const selectedSwapDetailsQuery = useSwapDetailsQuery(selectedRequestId);

  const detailedSelectedRequest = useMemo(() => {
    if (!selectedRequest) return null;

    const detailSwap = selectedSwapDetailsQuery.data?.data;
    if (!detailSwap || detailSwap.id !== selectedRequest.id) {
      return selectedRequest;
    }

    const mappedDetail = mapSwapToCard(detailSwap, activeTab);
    return {
      ...selectedRequest,
      ...mappedDetail,
      message: mappedDetail.message ?? selectedRequest.message,
    };
  }, [selectedRequest, selectedSwapDetailsQuery.data, activeTab]);

  const filteredRequests = useMemo(
    () => currentRequests.filter((request) => matchesActiveFilter(request, activeFilter)),
    [currentRequests, activeFilter]
  );
  const isCurrentLoading = activeTab === 'sent' ? sentSwapsQuery.isPending : receivedSwapsQuery.isPending;
  const hasCurrentError = activeTab === 'sent' ? sentSwapsQuery.isError : receivedSwapsQuery.isError;

  const handleRequestClick = (request: SwapRequestCardItem) => {
    setSelectedRequest(request);
  };

  const handleClosePanel = () => {
    setSelectedRequest(null);
  };

  const handleCancelRequest = (request: SwapRequestCardItem) => {
    if (request.backendStatus !== 'PENDING' && request.backendStatus !== 'ACCEPTED') return;

    cancelSwapMutation.mutate(request.id, {
      onSuccess: () => {
        setSelectedRequest(null);
      },
    });
  };

  const handleAcceptRequest = (request: SwapRequestCardItem) => {
    if (request.backendStatus !== 'PENDING') return;

    acceptSwapMutation.mutate(request.id, {
      onSuccess: () => {
        setSelectedRequest(null);
      },
    });
  };

  const handleDeclineRequest = (request: SwapRequestCardItem, metadata: DeclineMetadata) => {
    if (request.backendStatus !== 'PENDING') return;

    declineSwapMutation.mutate(
      {
        id: request.id,
        reason: getDeclineReason(metadata),
      },
      {
        onSuccess: () => {
          setSelectedRequest(null);
        },
      }
    );
  };

  const handleViewProfile = (userName: string) => {
    console.log('View profile:', userName);
    // Handle view profile logic
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawValue = window.sessionStorage.getItem(STATUS_MODAL_STORAGE_KEY);
      if (!rawValue) {
        hasHydratedStatusKeysRef.current = true;
        return;
      }

      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        const validKeys = parsed.filter((value): value is string => typeof value === 'string');
        seenStatusModalKeysRef.current = new Set(validKeys);
      }
    } catch {
      seenStatusModalKeysRef.current = new Set();
    } finally {
      hasHydratedStatusKeysRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedStatusKeysRef.current) return;
    if (activeTab !== 'sent') return;
    if (sentSwapsQuery.isPending || sentSwapsQuery.isError) return;
    if (statusModalRequest) return;

    const nextRequest = [...sentRequests]
      .filter((request) => isDecisionStatus(request.backendStatus))
      .filter((request) => !seenStatusModalKeysRef.current.has(createStatusModalKey(request)))
      .sort((first, second) => getStatusUpdatedTimestamp(second) - getStatusUpdatedTimestamp(first))[0];

    if (!nextRequest) return;
    setStatusModalRequest(nextRequest);
  }, [
    activeTab,
    sentRequests,
    sentSwapsQuery.isPending,
    sentSwapsQuery.isError,
    statusModalRequest,
  ]);

  const persistSeenStatusModalKeys = () => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(
      STATUS_MODAL_STORAGE_KEY,
      JSON.stringify([...seenStatusModalKeysRef.current])
    );
  };

  const handleCloseStatusModal = () => {
    if (!statusModalRequest) return;
    seenStatusModalKeysRef.current.add(createStatusModalKey(statusModalRequest));
    persistSeenStatusModalKeys();
    setStatusModalRequest(null);
  };

  const handleStatusModalPrimaryAction = () => {
    if (!statusModalRequest) return;

    if (statusModalRequest.backendStatus === 'ACCEPTED') {
      handleCloseStatusModal();
      navigate('/messages');
      return;
    }

    handleCloseStatusModal();
    navigate('/explore');
  };

  const handleStatusModalSecondaryAction = () => {
    handleCloseStatusModal();
    navigate('/sessions');
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
                {isCurrentLoading ? (
                  <div className="flex items-center justify-center w-full py-12">
                    <p className="text-[#9ca3af] text-base">Loading requests...</p>
                  </div>
                ) : hasCurrentError ? (
                  <div className="flex items-center justify-center w-full py-12">
                    <p className="text-[#9ca3af] text-base">Failed to load requests</p>
                  </div>
                ) : filteredRequests.length > 0 ? (
                  filteredRequests.map((request, index) => (
                    <RequestCard
                      key={request.id ?? index}
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
                request={detailedSelectedRequest}
                isOpen={!!selectedRequest}
                onClose={handleClosePanel}
                onCancelRequest={() => {
                  if (detailedSelectedRequest) {
                    handleCancelRequest(detailedSelectedRequest);
                  }
                }}
                onViewProfile={handleViewProfile}
                isCanceling={cancelSwapMutation.isPending}
              />
            </div>
          )}
          
          {selectedRequest && activeTab === 'received' && (
            <div ref={detailsPanelRef} className="w-full xl:flex-1 min-w-0 animate-slideIn">
              <ReceivedRequestDetailsPanel
                request={detailedSelectedRequest}
                isOpen={!!selectedRequest}
                onClose={handleClosePanel}
                onAcceptRequest={() => {
                  if (detailedSelectedRequest) {
                    handleAcceptRequest(detailedSelectedRequest);
                  }
                }}
                onDeclineRequest={(_, metadata) => {
                  if (detailedSelectedRequest) {
                    handleDeclineRequest(detailedSelectedRequest, metadata);
                  }
                }}
                onViewProfile={handleViewProfile}
                isAccepting={acceptSwapMutation.isPending}
                isDeclining={declineSwapMutation.isPending}
              />
            </div>
          )}
        </div>
      </div>

      <SentRequestStatusModal
        isOpen={!!statusModalRequest}
        variant={statusModalRequest?.backendStatus === 'ACCEPTED' ? 'accepted' : 'declined'}
        providerName={statusModalRequest?.userName ?? 'Provider'}
        requestedSkill={statusModalRequest?.requestedSkill ?? 'Requested Skill'}
        requestedSkillLevel={statusModalRequest?.requestedSkillLevel ?? null}
        scheduledAt={statusModalRequest?.startAt}
        rejectionReason={statusModalRequest?.rejectionReason}
        onClose={handleCloseStatusModal}
        onPrimaryAction={handleStatusModalPrimaryAction}
        onSecondaryAction={handleStatusModalSecondaryAction}
      />

      {/* Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default RequestsSent;
