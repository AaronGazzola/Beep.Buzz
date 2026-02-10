export const MORSE_ALPHABET: Record<string, string> = {
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

export const MORSE_TO_TEXT = Object.fromEntries(
  Object.entries(MORSE_ALPHABET).map(([k, v]) => [v, k])
);

export const DIFFICULTY_WORDS = {
  beginner: [
    "CAT",
    "DOG",
    "SUN",
    "RUN",
    "HAT",
    "BAT",
    "RAT",
    "BIG",
    "HOT",
    "WET",
    "RED",
    "BED",
    "PEN",
    "TEN",
    "YES",
    "NO",
    "GO",
    "DO",
    "ME",
    "WE",
  ],
  intermediate: [
    "HELLO",
    "WORLD",
    "QUICK",
    "BROWN",
    "JUMPS",
    "LEARN",
    "MORSE",
    "SIGNAL",
    "BEACON",
    "RADIO",
    "SOUND",
    "LETTER",
    "PATTERN",
    "RHYTHM",
    "TEMPO",
  ],
  advanced: [
    "COMMUNICATION",
    "TRANSMISSION",
    "ELECTROMAGNETIC",
    "INTERNATIONAL",
    "TELECOMMUNICATION",
    "RADIOTELEGRAPH",
    "SYNCHRONIZATION",
    "DISTRESS",
    "EMERGENCY",
    "NAVIGATION",
  ],
};

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((char) => MORSE_ALPHABET[char] || "")
    .filter((morse) => morse !== "")
    .join(" ");
}

export function morseToText(morse: string): string {
  return morse
    .split(" / ")
    .map((word) =>
      word
        .split(" ")
        .map((code) => MORSE_TO_TEXT[code] || "")
        .join("")
    )
    .join(" ");
}

export function validateMorse(morse: string): boolean {
  const validChars = /^[.\-\s/]+$/;
  return validChars.test(morse);
}

export type AudioSettings = {
  volume: number;
  wpm: number;
  frequency: number;
};

export function playMorseAudio(
  morseCode: string,
  settings: AudioSettings = { volume: 0.5, wpm: 20, frequency: 600 }
): Promise<void> {
  return new Promise((resolve) => {
    const audioContext = new AudioContext();
    const dotDuration = 1200 / settings.wpm;
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration;
    const letterGap = dotDuration * 3;
    const wordGap = dotDuration * 7;

    let currentTime = audioContext.currentTime;

    const createBeep = (duration: number, startTime: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = settings.frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(settings.volume, startTime + 0.01);
      gainNode.gain.setValueAtTime(
        settings.volume,
        startTime + duration / 1000 - 0.01
      );
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration / 1000);
    };

    const symbols = morseCode.split("");

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      if (symbol === ".") {
        createBeep(dotDuration, currentTime);
        currentTime += (dotDuration + symbolGap) / 1000;
      } else if (symbol === "-") {
        createBeep(dashDuration, currentTime);
        currentTime += (dashDuration + symbolGap) / 1000;
      } else if (symbol === " ") {
        currentTime += letterGap / 1000;
      } else if (symbol === "/") {
        currentTime += wordGap / 1000;
      }
    }

    setTimeout(() => resolve(), currentTime * 1000);
  });
}

export function generateRandomWord(
  difficulty: "beginner" | "intermediate" | "advanced"
): string {
  const words = DIFFICULTY_WORDS[difficulty];
  return words[Math.floor(Math.random() * words.length)];
}

export function generateRandomCharacter(excludeChars: string[] = []): string {
  const chars = Object.keys(MORSE_ALPHABET).filter(
    (char) => char !== " " && !excludeChars.includes(char)
  );
  if (chars.length === 0) {
    return Object.keys(MORSE_ALPHABET).filter((char) => char !== " ")[0];
  }
  return chars[Math.floor(Math.random() * chars.length)];
}

export function calculateAccuracy(
  correct: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function calculateWPM(
  charactersTyped: number,
  timeInSeconds: number
): number {
  if (timeInSeconds === 0) return 0;
  return Math.round((charactersTyped / 5) / (timeInSeconds / 60));
}
