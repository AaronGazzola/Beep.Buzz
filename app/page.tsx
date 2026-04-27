"use client";

import dynamic from "next/dynamic";

const GameWorld = dynamic(() => import("./game/world/GameWorld"), { ssr: false });

export default function Home() {
  return <GameWorld />;
}
