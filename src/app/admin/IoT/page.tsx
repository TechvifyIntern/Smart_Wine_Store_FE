"use client";

import React, { useEffect, useState } from "react";
import {
  getSocket,
  subscribeToRoom,
  unsubscribeFromRoom,
  onConnectStatusChange,
} from "@/lib/iotSocket";
import { format } from "date-fns";
import { LayoutDashboard, Box, Activity, Umbrella } from "lucide-react"; // Icon trang trí

// Import Types & Components
import {
  IncomingSocketData,
  EnvData,
  TrackingData,
  AssetData,
} from "@/types/iot";
import { AssetCard } from "@/components/admin/IoT/AssetCard";
import { EnvCard } from "@/components/admin/IoT/EnvCard";
import { TrackingDeviceCard } from "@/components/admin/IoT/TrackingDeviceCard";

interface TrackingDeviceState {
  latestDistance: number;
  lastUpdated: string;
  firstInTime: string;
  lastOutTime: string;
}

const IotDashboard: React.FC = () => {
  const backendUrl = process.env.BE_API_URL || "http://localhost:3000";

  // --- STATE (Giữ nguyên code cũ của bạn) ---
  const [tempHistory, setTempHistory] = useState<
    { time: string; value: number }[]
  >([]);
  const [humHistory, setHumHistory] = useState<
    { time: string; value: number }[]
  >([]);
  const [latestTemp, setLatestTemp] = useState<number | null>(null);
  const [latestHum, setLatestHum] = useState<number | null>(null);
  const [trackingDevices, setTrackingDevices] = useState<
    Map<string, TrackingDeviceState>
  >(new Map());
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [isSystemOnline, setIsSystemOnline] = useState<boolean>(false); // New state for connection status

  useEffect(() => {
    const roomsToSubscribe = [
      "ibeacon/DC58E46BA799",
      "ibeacon/F37B74E497D4",
      "sensor/simulation",
      "mokoM2/CB:82:B2:93:FC:38",
    ];
    const socket = getSocket(backendUrl);

    // Register callback for connection status changes
    onConnectStatusChange(setIsSystemOnline);

    // Subscribe to rooms
    roomsToSubscribe.forEach((room) => subscribeToRoom(room));

    const handleIotUpdate = (rawData: IncomingSocketData) => {
      const nowTime = new Date().toISOString();
      if ("sensorId" in rawData) {
        const env = rawData as EnvData;
        const newDataPoint = {
          time: format(new Date(), "HH:mm:ss"),
          value: env.value,
        };
        if (env.type === "temperature") {
          setLatestTemp(env.value);
          setTempHistory((prev) => [...prev.slice(-19), newDataPoint]);
        } else if (env.type === "humidity") {
          setLatestHum(env.value);
          setHumHistory((prev) => [...prev.slice(-19), newDataPoint]);
        }
      } else if ("gateway" in rawData) {
        const track = rawData as TrackingData;
        const deviceId = track.device;
        setTrackingDevices((prev) => {
          const newMap = new Map(prev);
          const existing = newMap.get(deviceId);
          newMap.set(deviceId, {
            latestDistance: track.data.distance,
            lastUpdated: nowTime,
            firstInTime: existing?.firstInTime || nowTime,
            lastOutTime: nowTime,
          });
          return newMap;
        });
      } else if ("macAddress" in rawData && "telemetry" in rawData) {
        setAssetData({ ...(rawData as AssetData), lastUpdated: nowTime });
      }
    };
    socket.on("iot-update", handleIotUpdate);

    return () => {
      socket.off("iot-update", handleIotUpdate);
      // Unsubscribe from rooms on cleanup
      roomsToSubscribe.forEach((room) => unsubscribeFromRoom(room));
    };
  }, [backendUrl]);

  // --- RENDER LAYOUT MỚI ---
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <LayoutDashboard className="text-primary" />
              IoT Control Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring system & asset tracking
            </p>
          </div>
          <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-full shadow-sm dark:border-white/20">
            <div className="relative flex h-3 w-3">
              <span
                className={`absolute inline-flex h-full w-full rounded-full ${isSystemOnline ? "bg-emerald-400 opacity-75 animate-ping" : "bg-destructive/75"}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${isSystemOnline ? "bg-emerald-500" : "bg-destructive"}`}
              ></span>
            </div>
            <span className="text-sm font-medium text-foreground">
              System {isSystemOnline ? "Online" : "Offline"}
            </span>
            <span className="text-xs text-muted-foreground border-l border-border pl-3 ml-1 font-mono">
              {backendUrl.replace("http://", "")}
            </span>
            <div className="lg:col-span-1">
              <AssetCard data={assetData} />
            </div>
          </div>
        </header>

        {/* 2. Main Metrics Grid (Environment + Asset) */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
            <Umbrella size={18} /> Environment
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hàng dưới: 2 Biểu đồ môi trường */}
            <div className="lg:col-span-3 h-full">
              <EnvCard
                title="Temperature"
                value={latestTemp}
                unit="°C"
                type="temp"
                history={tempHistory}
                min={16}
                max={18}
              />
            </div>
            <div className="lg:col-span-3 h-full">
              <EnvCard
                title="Humidity"
                value={latestHum}
                unit="%"
                type="hum"
                history={humHistory}
                min={60}
                max={80}
              />
            </div>
          </div>
        </section>

        {/* 3. Tracking Grid Section (Lưới riêng cho thẻ vuông) */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground/80">
              <Box size={18} /> Active Tracking Devices
              <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                {trackingDevices.size} Active
              </span>
            </h2>
          </div>

          {/* GRID TỰ ĐỘNG CO GIÃN CHO THẺ VUÔNG */}
          {trackingDevices.size > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...trackingDevices.entries()].map(([deviceId, data]) => (
                <div key={deviceId} className="flex justify-center">
                  {/* flex justify-center để thẻ nằm giữa ô grid nếu ô lớn hơn thẻ */}
                  <TrackingDeviceCard
                    deviceId={deviceId}
                    latestDistance={data.latestDistance}
                    lastUpdated={data.lastUpdated}
                    firstInTime={data.firstInTime}
                    lastOutTime={data.lastOutTime}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border/50 rounded-xl bg-muted/20 text-muted-foreground">
              <Activity size={32} className="mb-2 opacity-50" />
              <p>No tracking devices detected</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default IotDashboard;
