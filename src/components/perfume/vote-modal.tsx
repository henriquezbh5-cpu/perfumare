"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumeId: string;
  perfumeName: string;
  onSubmit: (data: VoteData) => Promise<void>;
}

interface VoteData {
  longevity?: number;
  sillage?: string;
  priceValue?: number;
  season?: string;
  timeOfDay?: string;
}

const sillageOptions = [
  { value: "intimate", label: "Intimate", desc: "Close to skin" },
  { value: "moderate", label: "Moderate", desc: "Arm's length" },
  { value: "strong", label: "Strong", desc: "Room filling" },
  { value: "enormous", label: "Enormous", desc: "Beast mode" },
];

const seasonOptions = [
  { value: "spring", label: "Spring", icon: "🌸" },
  { value: "summer", label: "Summer", icon: "☀️" },
  { value: "fall", label: "Fall", icon: "🍂" },
  { value: "winter", label: "Winter", icon: "❄️" },
];

export function VoteModal({ isOpen, onClose, perfumeName, onSubmit }: VoteModalProps) {
  const [longevity, setLongevity] = useState(5);
  const [sillage, setSillage] = useState("");
  const [priceValue, setPriceValue] = useState(3);
  const [season, setSeason] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data: VoteData = {};
    if (longevity) data.longevity = longevity;
    if (sillage) data.sillage = sillage;
    if (priceValue) data.priceValue = priceValue;
    if (season) data.season = season;
    if (timeOfDay) data.timeOfDay = timeOfDay;

    await onSubmit(data);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vote on Performance" maxWidth="lg">
      <p className="text-sm text-bark-300 mb-5">
        Rate the performance of <strong className="text-bark-500">{perfumeName}</strong>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Longevity */}
        <Slider
          label="Longevity"
          min={1}
          max={10}
          value={longevity}
          onChange={setLongevity}
          labels={{ min: "1 — Poor", max: "10 — Beast" }}
        />

        {/* Sillage */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-bark-400">Sillage</span>
          <div className="grid grid-cols-2 gap-2">
            {sillageOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSillage(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-3 rounded-lg border text-sm transition-all",
                  sillage === opt.value
                    ? "border-gold-500 bg-gold-50 text-gold-600"
                    : "border-cream-300 text-bark-300 hover:border-cream-400"
                )}
              >
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs opacity-70">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Value */}
        <Slider
          label="Price Value"
          min={1}
          max={5}
          value={priceValue}
          onChange={setPriceValue}
          labels={{ min: "1 — Overpriced", max: "5 — Great value" }}
        />

        {/* Season */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-bark-400">Best Season</span>
          <div className="flex gap-2">
            {seasonOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSeason(opt.value)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border text-sm transition-all",
                  season === opt.value
                    ? "border-gold-500 bg-gold-50 text-gold-600"
                    : "border-cream-300 text-bark-300 hover:border-cream-400"
                )}
              >
                <span className="text-lg">{opt.icon}</span>
                <span className="text-xs">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time of Day */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-bark-400">Best Time</span>
          <div className="flex gap-2">
            {[
              { value: "day", label: "Day", icon: "☀️" },
              { value: "night", label: "Night", icon: "🌙" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTimeOfDay(opt.value)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-sm transition-all",
                  timeOfDay === opt.value
                    ? "border-gold-500 bg-gold-50 text-gold-600"
                    : "border-cream-300 text-bark-300 hover:border-cream-400"
                )}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Vote"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
