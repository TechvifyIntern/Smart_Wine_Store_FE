"use client";
import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";
import { Thermometer, Droplets, TriangleAlert } from "lucide-react";

interface EnvCardProps {
  title: string;
  value: number | null;
  unit: string;
  type: "temp" | "hum";
  history: any[];
  min: number; // Added min threshold
  max: number; // Added max threshold
}

export const EnvCard = React.memo(
  ({ title, value, unit, type, history, min, max }: EnvCardProps) => {
    const isTemp = type === "temp";
    const color = isTemp ? "var(--chart-1)" : "var(--chart-3)"; // Use CSS variables for chart colors
    const Icon = isTemp ? Thermometer : Droplets;

    const isWarning = value !== null && (value < min || value > max);
    const cardBorderClass = isWarning
      ? "border-destructive ring-2 ring-destructive/20 bg-destructive/5"
      : "border-border";
    const iconColorClass = isWarning ? "text-destructive" : "text-primary";

    return (
      <div
        className={`bg-card rounded-xl border ${cardBorderClass} shadow-sm p-4`}
      >
        <div className="flex items-center justify-between mb-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon size={18} className={iconColorClass} />
            <h3 className="font-semibold text-sm uppercase">{title}</h3>
          </div>
          {isWarning && (
            <TriangleAlert
              size={18}
              className="text-destructive animate-pulse"
            />
          )}
        </div>

        <div className="flex items-end gap-2 mb-2">
          <span
            className={`text-4xl font-bold ${isWarning ? "text-destructive" : "text-foreground"}`}
          >
            {value ?? "--"}
          </span>
          <span className="text-lg text-muted-foreground mb-1">{unit}</span>
        </div>

        <div className="h-[200px]">
          {/* Increased height for axes */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient
                  id={`color-${type}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={1} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                label={{
                  value: unit,
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--muted-foreground)",
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`url(#color-${type})`}
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {isWarning && (
          <p className="text-destructive font-bold text-md mb-2 text-center animate-pulse">
            Warning: Value out of range ({min}-{max} {unit})!
          </p>
        )}
      </div>
    );
  }
);

EnvCard.displayName = "EnvCard";
