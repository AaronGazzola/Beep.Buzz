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

    console.log("[matchmaking] hook enabled", { userId: user.id });

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

        console.log("[matchmaking] presence sync", JSON.stringify({ users, myId: user.id, partnerIdRef: partnerIdRef.current, matchingInProgress: matchingInProgressRef.current }));

        if (users.length >= 2 && !partnerIdRef.current && !matchingInProgressRef.current) {
          const otherUsers = users.filter((id) => id !== user.id);

          if (otherUsers.length > 0) {
            const partner = otherUsers[0];
            partnerIdRef.current = partner;
            matchingInProgressRef.current = true;

            const sortedIds = [user.id, partner].sort();
            const isSender = sortedIds[0] === user.id;

            console.log("[matchmaking] attempting match", JSON.stringify({ partner, sortedIds, isSender }));

            if (isSender) {
              channel.send({
                type: "broadcast",
                event: "match_found",
                payload: { userId: user.id, partnerId: partner },
              }).then((res) => console.log("[matchmaking] broadcast sent", JSON.stringify(res)));
            }

            setPartnerUserId(partner);
          } else {
            console.log("[matchmaking] no other users after filter");
          }
        } else {
          console.log("[matchmaking] sync skipped", JSON.stringify({ usersCount: users.length, hasPartner: !!partnerIdRef.current, matchingInProgress: matchingInProgressRef.current }));
        }
      })
      .on("broadcast", { event: "match_found" }, ({ payload }) => {
        console.log("[matchmaking] broadcast received", JSON.stringify({ payload, myId: user.id, hasPartner: !!partnerIdRef.current }));

        if (payload.partnerId === user.id && !partnerIdRef.current) {
          console.log("[matchmaking] matched via broadcast", JSON.stringify({ partner: payload.userId }));
          partnerIdRef.current = payload.userId;
          matchingInProgressRef.current = true;
          setPartnerUserId(payload.userId);
        }
      })
      .subscribe(async (status) => {
        console.log("[matchmaking] channel status", status);
        if (status === "SUBSCRIBED") {
          const trackRes = await channel.track({ status: "searching" });
          console.log("[matchmaking] track result", JSON.stringify(trackRes));
        }
      });

    return () => {
      console.log("[matchmaking] cleanup", { userId: user.id });
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
