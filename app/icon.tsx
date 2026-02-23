import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const svg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 26 6 C 34 2, 44 3, 56 4 C 64 5, 70 12, 68 18 C 66 24, 66 28, 66 30 C 62 34, 60 38, 57 42 C 52 44, 42 36, 38 42 C 36 46, 40 53, 42 57 C 42 61, 32 65, 24 68 C 16 72, 8 64, 2 56 C 2 48, 7 40, 2 28 C 2 18, 1 12, 4 7 C 8 2, 16 8, 26 6 Z" fill="#fd822b"/>
  <line x1="22" y1="20" x2="22" y2="32" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <line x1="36" y1="20" x2="36" y2="32" stroke="white" stroke-width="5" stroke-linecap="round"/>
  <path d="M 68 34 L 81 53 L 96 48 L 94 66 L 98 75 L 91 88 L 87 98 L 75 93 L 51 98 L 55 85 L 30 75 L 49 63 L 43 41 L 61 47 Z" fill="#1e69dc"/>
  <line x1="62" y1="63" x2="62" y2="77" stroke="white" stroke-width="4.5" stroke-linecap="round"/>
  <line x1="78" y1="63" x2="78" y2="77" stroke="white" stroke-width="4.5" stroke-linecap="round"/>
</svg>`;

const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        <img width="32" height="32" src={dataUri} />
      </div>
    ),
    { ...size },
  );
}
