"use client";
import React from "react";
import { Battery, Compass, Activity, Clock, Loader2 } from "lucide-react";
import { AssetData } from "@/types/iot";

interface AssetCardProps {
  data: AssetData | null;
}

export const AssetCard = React.memo(({ data }: AssetCardProps) => {
  // --- LOADING STATE (Gọn gàng hơn) ---
  if (!data)
    return (
      <div className="h-full w-full flex items-center justify-center gap-3 bg-muted/20 border border-dashed border-border rounded-xl p-4 dark:border-white/20">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
        <span className="text-sm font-medium text-muted-foreground">
          Waiting for Asset Signal...
        </span>
      </div>
    );

  const voltage = data.telemetry.battery.voltage_v;
  const isMoving = data.analysis.is_moving;

  // Logic màu sắc
  const batteryColor = voltage < 2.8 ? "text-red-500" : "text-emerald-500";
  const motionColor = isMoving ? "text-destructive" : "text-blue-500";
  const motionBg = isMoving ? "bg-destructive/10" : "bg-blue-500/10";

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4 ">
      {/* 1. BATTERY STATUS */}
      <div className="flex items-center gap-3 bg-card border border-border/50 rounded-xl p-3 shadow-sm ">
        <div className={`p-2 rounded-lg bg-muted/50 ${batteryColor}`}>
          <Battery size={24} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Battery
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">{voltage}</span>
            <span className="text-xs font-medium text-muted-foreground">V</span>
          </div>
        </div>
      </div>

      {/* 2. MOTION & ORIENTATION (Gộp chung trạng thái vật lý) */}
      <div
        className={`flex items-center justify-between gap-3 border border-border/50 rounded-xl p-3 shadow-sm ${motionBg}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-background/60 ${motionColor}`}>
            {isMoving ? (
              <Activity size={24} className="animate-pulse" />
            ) : (
              <Compass size={24} />
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Status
            </p>
            <p className={`font-bold text-sm ${motionColor}`}>
              {isMoving ? "MOVING" : "STATIONARY"}
            </p>
          </div>
        </div>
        {/* Orientation nhỏ bên cạnh */}
        <div className="text-right px-2 border-l border-border/20">
          <span className="block text-[10px] text-muted-foreground">
            Orient.
          </span>
          <span className="text-xs font-semibold text-foreground/80">
            {data.analysis.orientation_status}
          </span>
        </div>
      </div>

      {/* 3. LAST UPDATE (Thông tin thời gian) */}
      <div className="flex items-center gap-3 bg-card border border-border/50 rounded-xl p-3 shadow-sm">
        <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground">
          <Clock size={24} />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Last Sync
          </p>
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {new Date(data.lastUpdated).toLocaleTimeString("vi-VN")}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {new Date(data.lastUpdated).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>
    </div>
  );
});

AssetCard.displayName = "AssetCard";
