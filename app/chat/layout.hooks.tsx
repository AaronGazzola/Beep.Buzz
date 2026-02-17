"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/app/layout.stores";
import { supabase } from "@/supabase/browser-client";
import { getContactsAction } from "./layout.actions";

export function useContacts() {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["contacts", user?.id],
    queryFn: getContactsAction,
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 30,
  });
}

export function useDirectMatchmaking({ enabled }: { enabled: boolean }) {
  const { user } = useAuthStore();
  const [partnerUserId, setPartnerUserId] = useState<string | null>(null);
  const partnerIdRef = useRef<string | null>(null);
  const matchingInProgressRef = useRef(false);

  useEffect(() => {
    if (!enabled || !user) return;

    const channel = supabase.channel("matchmaking:queue", {
      config: {
        presence: { key: user.id },
        broadcast: { self: false },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state);

        if (users.length >= 2 && !partnerIdRef.current && !matchingInProgressRef.current) {
          const otherUsers = users.filter((id) => id !== user.id);

          if (otherUsers.length > 0) {
            const partner = otherUsers[0];
            partnerIdRef.current = partner;
            matchingInProgressRef.current = true;

            const sortedIds = [user.id, partner].sort();
            if (sortedIds[0] === user.id) {
              channel.send({
                type: "broadcast",
                event: "match_found",
                payload: { userId: user.id, partnerId: partner },
              });
            }

            setPartnerUserId(partner);
          }
        }
      })
      .on("broadcast", { event: "match_found" }, ({ payload }) => {
        if (payload.partnerId === user.id && !partnerIdRef.current) {
          partnerIdRef.current = payload.userId;
          matchingInProgressRef.current = true;
          setPartnerUserId(payload.userId);
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ status: "searching" });
        }
      });

    return () => {
      partnerIdRef.current = null;
      matchingInProgressRef.current = false;
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [enabled, user]);

  const cancel = () => {
    partnerIdRef.current = null;
    matchingInProgressRef.current = false;
    setPartnerUserId(null);
  };

  return { partnerUserId, cancel };
}
