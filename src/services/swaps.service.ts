import axiosInstance from '@/api/axiosInstance';
import type {
  ApiSuccessResponse,
  CreateSwapRequestPayload,
  DeclineSwapRequestPayload,
  SwapDetailsResponse,
  SwapListResponse,
  SwapRequest,
  SwapStatsResponse,
  SwapsListQueryParams,
} from '@/features/swaps/swaps.types';

const buildListParams = (params: SwapsListQueryParams) => {
  if (!params.status) {
    return {
      page: params.page,
      limit: params.limit,
    };
  }

  return params;
};

export const swapsService = {
  createSwapRequest: async (
    payload: CreateSwapRequestPayload
  ): Promise<ApiSuccessResponse<SwapRequest>> => {
    const response = await axiosInstance.post<ApiSuccessResponse<SwapRequest>>(
      '/api/v1/swaps/requests',
      payload
    );
    return response.data;
  },

  getSentSwapRequests: async (
    params: SwapsListQueryParams
  ): Promise<SwapListResponse> => {
    const response = await axiosInstance.get<SwapListResponse>(
      '/api/v1/swaps/requests/sent',
      { params: buildListParams(params) }
    );
    return response.data;
  },

  getReceivedSwapRequests: async (
    params: SwapsListQueryParams
  ): Promise<SwapListResponse> => {
    const response = await axiosInstance.get<SwapListResponse>(
      '/api/v1/swaps/requests/received',
      { params: buildListParams(params) }
    );
    return response.data;
  },

  getSwapRequestDetails: async (id: string): Promise<SwapDetailsResponse> => {
    const response = await axiosInstance.get<SwapDetailsResponse>(
      `/api/v1/swaps/requests/${id}`
    );
    return response.data;
  },

  acceptSwapRequest: async (id: string): Promise<ApiSuccessResponse<SwapRequest>> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<SwapRequest>>(
      `/api/v1/swaps/requests/${id}/accept`
    );
    return response.data;
  },

  declineSwapRequest: async (
    id: string,
    payload: DeclineSwapRequestPayload
  ): Promise<ApiSuccessResponse<SwapRequest>> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<SwapRequest>>(
      `/api/v1/swaps/requests/${id}/decline`,
      payload
    );
    return response.data;
  },

  cancelSwapRequest: async (id: string): Promise<ApiSuccessResponse<SwapRequest>> => {
    const response = await axiosInstance.patch<ApiSuccessResponse<SwapRequest>>(
      `/api/v1/swaps/requests/${id}/cancel`
    );
    return response.data;
  },

  getSwapStats: async (): Promise<SwapStatsResponse> => {
    const response = await axiosInstance.get<SwapStatsResponse>('/api/v1/swaps/stats');
    return response.data;
  },
};
