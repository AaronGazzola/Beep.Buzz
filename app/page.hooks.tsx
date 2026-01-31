import { useQuery } from "@tanstack/react-query";
import {
  getActiveUsersCountAction,
  getOngoingMatchesAction,
} from "./layout.actions";
import { useStatsStore, useMatchStore, useDemoStore } from "./layout.stores";

export function useActiveUsersCount() {
  const setActiveUsers = useStatsStore((state) => state.setActiveUsers);

  return useQuery({
    queryKey: ["activeUsersCount"],
    queryFn: async () => {
      const data = await getActiveUsersCountAction();
      setActiveUsers(data.count, data.change24h);
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useOngoingMatches() {
  const setOngoingMatches = useMatchStore((state) => state.setOngoingMatches);

  return useQuery({
    queryKey: ["ongoingMatches"],
    queryFn: async () => {
      const matches = await getOngoingMatchesAction();
      setOngoingMatches(matches);
      return matches;
    },
    refetchInterval: 10000,
  });
}

export function useMorseDemo() {
  const { setInput, setOutput, setIsPlaying } = useDemoStore();

  const encodeMorse = (text: string): string => {
    const morseCode: Record<string, string> = {
      A: ".-",
      B: "-...",
      C: "-.-.",
      D: "-..",
      E: ".",
      F: "..-.",
      G: "--.",
      H: "....",
      I: "..",
      J: ".---",
      K: "-.-",
      L: ".-..",
      M: "--",
      N: "-.",
      O: "---",
      P: ".--.",
      Q: "--.-",
      R: ".-.",
      S: "...",
      T: "-",
      U: "..-",
      V: "...-",
      W: ".--",
      X: "-..-",
      Y: "-.--",
      Z: "--..",
      "0": "-----",
      "1": ".----",
      "2": "..---",
      "3": "...--",
      "4": "....-",
      "5": ".....",
      "6": "-....",
      "7": "--...",
      "8": "---..",
      "9": "----.",
      " ": "/",
    };

    return text
      .toUpperCase()
      .split("")
      .map((char) => morseCode[char] || "")
      .join(" ");
  };

  const playMorse = async (morseText: string) => {
    setIsPlaying(true);

    const audioContext = new AudioContext();
    const ditDuration = 100;
    const dahDuration = ditDuration * 3;
    const gapDuration = ditDuration;
    let currentTime = audioContext.currentTime;

    for (const char of morseText) {
      if (char === ".") {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;

        oscillator.start(currentTime);
        oscillator.stop(currentTime + ditDuration / 1000);

        currentTime += (ditDuration + gapDuration) / 1000;
      } else if (char === "-") {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.3;

        oscillator.start(currentTime);
        oscillator.stop(currentTime + dahDuration / 1000);

        currentTime += (dahDuration + gapDuration) / 1000;
      } else if (char === " ") {
        currentTime += (ditDuration * 3) / 1000;
      } else if (char === "/") {
        currentTime += (ditDuration * 7) / 1000;
      }
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, (currentTime - audioContext.currentTime) * 1000);
  };

  const handleEncode = (text: string) => {
    setInput(text);
    const morse = encodeMorse(text);
    setOutput(morse);
    return morse;
  };

  const handlePlay = (morseText: string) => {
    playMorse(morseText);
  };

  return {
    handleEncode,
    handlePlay,
  };
}
