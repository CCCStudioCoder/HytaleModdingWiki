"use client";
import { FaDiscord } from "react-icons/fa6";
import { CircleUserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getDiscordStats } from "./actions";

export function DiscordButton() {
  const [stats, setStats] = useState<{
    active_members: number;
    total_members: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDiscordStats()
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch Discord stats:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Button className="relative" asChild>
      <a 
        href="https://discord.gg/hytalemodding" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <FaDiscord />
        Join The Community
        <div className="absolute top-full mt-2 flex">
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : stats ? (
            <p className="text-muted-foreground flex items-center gap-1 text-sm">
              <span className="flex gap-1 text-green-400">
                <CircleUserIcon className="my-auto" />
                {stats.total_members} Members 
              </span>
            </p>
          ) : null}
        </div>
      </a>
    </Button>
  );
}