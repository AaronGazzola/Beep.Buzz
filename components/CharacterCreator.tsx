"use client";

import { HexColorPicker } from "react-colorful";
import { Slider } from "@/components/ui/slider";
import { CustomCharacter } from "@/components/CustomCharacter";
import { cn } from "@/lib/utils";
import type { CharacterSettings } from "@/app/profile/page.types";

interface CharacterCreatorProps {
  value: CharacterSettings;
  onChange: (settings: CharacterSettings) => void;
  className?: string;
}

const EYE_LABELS = ["Default", "Round", "Star", "Cross", "Arc"];
const HAT_LABELS = ["None", "Party Hat", "Top Hat", "Bow"];
const GLASSES_LABELS = ["None", "Round", "Square", "Visor"];
const MAKEUP_LABELS = ["None", "Blush", "Stars", "Freckles"];
const SHOES_LABELS = ["None", "Sneakers", "Boots", "Heels"];

function AccessorySlider({
  label,
  value,
  max,
  labels,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  labels: string[];
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{labels[value]}</span>
      </div>
      <Slider
        min={0}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

export function CharacterCreator({ value, onChange, className }: CharacterCreatorProps) {
  const update = (partial: Partial<CharacterSettings>) => {
    onChange({ ...value, ...partial });
  };

  return (
    <div className={cn("flex flex-col lg:flex-row gap-8", className)}>
      <div className="flex flex-col items-center justify-center gap-3 lg:w-56 shrink-0">
        <div className="w-48 h-48">
          <CustomCharacter
            color={value.color}
            numPoints={value.numPoints}
            spikeyness={value.spikeyness}
            eyeStyle={value.eyeStyle}
            hat={value.hat}
            glasses={value.glasses}
            makeup={value.makeup}
            shoes={value.shoes}
          />
        </div>
        <span className="text-sm text-muted-foreground">Live Preview</span>
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Shape</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Anchor Points</span>
              <span className="text-xs text-muted-foreground">{value.numPoints}</span>
            </div>
            <Slider
              min={4}
              max={16}
              step={1}
              value={[value.numPoints]}
              onValueChange={([v]) => update({ numPoints: v })}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Style</span>
              <span className="text-xs text-muted-foreground">
                {value.spikeyness === 0 ? "Blobby" : value.spikeyness === 100 ? "Spikey" : value.spikeyness < 50 ? "Smooth" : "Jagged"}
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[value.spikeyness]}
              onValueChange={([v]) => update({ spikeyness: v })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Blobby</span>
              <span>Spikey</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Accessories</h3>

          <AccessorySlider
            label="Eyes"
            value={value.eyeStyle}
            max={4}
            labels={EYE_LABELS}
            onChange={(v) => update({ eyeStyle: v })}
          />
          <AccessorySlider
            label="Hat"
            value={value.hat}
            max={3}
            labels={HAT_LABELS}
            onChange={(v) => update({ hat: v })}
          />
          <AccessorySlider
            label="Glasses"
            value={value.glasses}
            max={3}
            labels={GLASSES_LABELS}
            onChange={(v) => update({ glasses: v })}
          />
          <AccessorySlider
            label="Makeup"
            value={value.makeup}
            max={3}
            labels={MAKEUP_LABELS}
            onChange={(v) => update({ makeup: v })}
          />
          <AccessorySlider
            label="Shoes"
            value={value.shoes}
            max={3}
            labels={SHOES_LABELS}
            onChange={(v) => update({ shoes: v })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Color</h3>
          <div className="space-y-3">
            <HexColorPicker
              color={value.color}
              onChange={(c) => update({ color: c })}
              style={{ width: "100%" }}
            />
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md border border-border shrink-0"
                style={{ backgroundColor: value.color }}
              />
              <span className="text-sm font-mono text-muted-foreground">{value.color}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
