import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Donation, Member } from "../backend";
import { useActor } from "./useActor";

// ─── Queries ─────────────────────────────────────────────────────────────────

export function useMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDonations() {
  const { actor, isFetching } = useActor();
  return useQuery<Donation[]>({
    queryKey: ["donations", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDonations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDonationsByMember(memberId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Donation[]>({
    queryKey: ["donations", "member", memberId?.toString()],
    queryFn: async () => {
      if (!actor || memberId === null) return [];
      return actor.getDonationsByMember(memberId);
    },
    enabled: !!actor && !isFetching && memberId !== null,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useAddMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMember(name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useUpdateMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: bigint; name: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateMember(id, name);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useDeleteMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteMember(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
      qc.invalidateQueries({ queryKey: ["donations"] });
    },
  });
}

export function useAddDonation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      memberId,
      amount,
      date,
    }: {
      memberId: bigint;
      amount: number;
      date: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addDonation(memberId, amount, date);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donations"] });
    },
  });
}

export function useDeleteDonation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteDonation(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donations"] });
    },
  });
}
