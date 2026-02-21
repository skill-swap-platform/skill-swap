import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { swapsService } from '@/services/swaps.service';
import type {
  CreateSwapRequestPayload,
  DeclineSwapRequestPayload,
  SwapsListQueryParams,
} from './swaps.types';

export const swapsQueryKeys = {
  stats: ['swaps', 'stats'] as const,
  sent: (params: SwapsListQueryParams) =>
    ['swaps', 'sent', { page: params.page, limit: params.limit, status: params.status }] as const,
  received: (params: SwapsListQueryParams) =>
    ['swaps', 'received', { page: params.page, limit: params.limit, status: params.status }] as const,
  details: (id: string) => ['swaps', 'details', id] as const,
};

export const useSwapsStatsQuery = () =>
  useQuery({
    queryKey: swapsQueryKeys.stats,
    queryFn: swapsService.getSwapStats,
  });

export const useSentSwapsQuery = (params: SwapsListQueryParams) =>
  useQuery({
    queryKey: swapsQueryKeys.sent(params),
    queryFn: () => swapsService.getSentSwapRequests(params),
  });

export const useReceivedSwapsQuery = (params: SwapsListQueryParams) =>
  useQuery({
    queryKey: swapsQueryKeys.received(params),
    queryFn: () => swapsService.getReceivedSwapRequests(params),
  });

export const useSwapDetailsQuery = (id: string) =>
  useQuery({
    queryKey: swapsQueryKeys.details(id),
    queryFn: () => swapsService.getSwapRequestDetails(id),
    enabled: Boolean(id),
  });

export const useCreateSwapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSwapRequestPayload) => swapsService.createSwapRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps', 'sent'] });
      queryClient.invalidateQueries({ queryKey: ['swaps', 'stats'] });
    },
  });
};

export const useAcceptSwapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => swapsService.acceptSwapRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['swaps', 'received'] });
      queryClient.invalidateQueries({ queryKey: ['swaps', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['swaps', 'details', id] });
    },
  });
};

type DeclineSwapMutationPayload = {
  id: string;
  reason: DeclineSwapRequestPayload['reason'];
};

export const useDeclineSwapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: DeclineSwapMutationPayload) =>
      swapsService.declineSwapRequest(id, { reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['swaps', 'received'] });
      queryClient.invalidateQueries({ queryKey: ['swaps', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['swaps', 'details', variables.id] });
    },
  });
};

export const useCancelSwapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => swapsService.cancelSwapRequest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['swaps', 'sent'] });
      queryClient.invalidateQueries({ queryKey: ['swaps', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['swaps', 'details', id] });
    },
  });
};
