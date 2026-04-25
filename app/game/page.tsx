"use client";

import dynamic from "next/dynamic";

const GameWorld = dynamic(() => import("./world/GameWorld"), { ssr: false });

export default function GamePage() {
  return <GameWorld />;
}
