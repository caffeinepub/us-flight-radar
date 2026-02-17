import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, PositionData } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetApiUrl() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['apiUrl'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getApiUrl();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetApiUrl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApiUrl(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiUrl'] });
    },
  });
}

export function useGetAllTrackHistories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[string, Array<PositionData>]>>({
    queryKey: ['trackHistories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllTrackHistories();
    },
    enabled: !!actor && !actorFetching,
  });
}
