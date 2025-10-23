import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60 * 1000,
  },
  mutations: {
    retry: 1,
  },
};

export const createQueryClient = () => new QueryClient({ defaultOptions });
