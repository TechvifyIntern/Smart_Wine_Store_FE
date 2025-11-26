"use client";

import React from "react";
import {
  Navigation,
  LogIn,
  LogOut,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";

interface TrackingDeviceCardProps {
  deviceId: string;
  latestDistance: number;
  lastUpdated: string | null;
  firstInTime: string | null;
  lastOutTime: string | null;
}

export const TrackingDeviceCard = React.memo(
  ({
    deviceId,
    latestDistance,
    lastUpdated,
    firstInTime,
    lastOutTime,
  }: TrackingDeviceCardProps) => {
    const isLastOutOld = lastOutTime
      ? (new Date().getTime() - new Date(lastOutTime).getTime()) / (1000 * 60) >
        10
      : false;

    const isDistanceWarning = latestDistance < 10;

    const formatShortDate = (dateString: string | null) => {
      if (!dateString) return "--:--";
      const date = new Date(dateString);
      return (
        <div className="flex flex-col leading-tight">
          {/* tabular-nums: giúp các con số có độ rộng bằng nhau */}
          <span className="font-bold tabular-nums">
            {date.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className="text-[10px] text-muted-foreground opacity-80 tabular-nums">
            {date.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
        </div>
      );
    };

    return (
      <div
        title={
          lastUpdated
            ? `Last updated: ${new Date(lastUpdated).toLocaleString()}`
            : "No update info"
        }
        className={`
        group relative flex flex-col justify-between 
        aspect-square w-60 h-48
        rounded-2xl border bg-card p-3 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-help
        ${
          isLastOutOld
            ? "border-destructive ring-2 ring-destructive/20 bg-destructive/5"
            : isDistanceWarning
            ? "border-yellow-500 ring-2 ring-yellow-500/20 bg-yellow-500/5"
            : "border-border dark:border-white/10"
        }
      `}
      >
        {/* --- HEADER: Device ID & Status --- */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 bg-background/50 rounded-full px-2 py-1 border border-border/50">
            <Navigation size={14} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wide truncate">
              {deviceId}
            </span>
          </div>

          {/* Status Indicator */}
          <div
            className={`p-1.5 rounded-full ${
              isLastOutOld
                ? "bg-destructive text-white animate-pulse"
                : "bg-emerald-500/10 text-emerald-600"
            }`}
          >
            {isLastOutOld ? <WifiOff size={14} /> : <Wifi size={14} />}
          </div>
        </div>

        {/* --- BODY: Main Metric (Distance) --- */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* tabular-nums cũng quan trọng ở đây để số đo không bị nhảy qua lại */}
          <span className="text-3xl font-black text-foreground tracking-tighter tabular-nums flex items-center gap-2">
            {latestDistance.toFixed(1)}
            {isDistanceWarning && (
              <AlertTriangle size={24} className="text-yellow-500" />
            )}
          </span>
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Centimeters
          </span>
        </div>

        {/* --- FOOTER: Timestamps --- */}
        <div className="z-10 grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-border/40 bg-card/30 backdrop-blur-[1px]">
          {/* First In */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/10 p-1.5 rounded-md text-blue-600 shrink-0">
              <LogIn size={14} />
            </div>
            <div className="text-xs overflow-hidden">
              {formatShortDate(firstInTime)}
            </div>
          </div>

          {/* Last Out */}
          <div className="flex items-center gap-2 justify-end text-right">
            <div className="text-xs overflow-hidden">
              {formatShortDate(lastOutTime)}
            </div>
            <div
              className={`p-1.5 rounded-md shrink-0 ${
                isLastOutOld
                  ? "bg-destructive text-white"
                  : "bg-orange-500/10 text-orange-600"
              }`}
            >
              {isLastOutOld ? (
                <AlertTriangle size={14} />
              ) : (
                <LogOut size={14} />
              )}
            </div>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl z-0 pointer-events-none group-hover:bg-primary/10 transition-colors" />
      </div>
    );
  }
);

TrackingDeviceCard.displayName = "TrackingDeviceCard";
