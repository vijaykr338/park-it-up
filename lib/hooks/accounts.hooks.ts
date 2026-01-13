"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "../api/accounts";

export function useMe() {
  return useQuery({
    queryKey: ["accounts", "me"],
    queryFn: accountsApi.me,
    refetchInterval: false, // profile usually doesn't need polling
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: accountsApi.updateMe,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["accounts", "me"] });
    },
  });
}
