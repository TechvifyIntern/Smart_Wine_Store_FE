// Dữ liệu chung
export type BaseIotData = {
  timestamp: number | string;
};

// 1. Dữ liệu Môi trường (Sensor)
export interface EnvData extends BaseIotData {
  sensorId: string;
  type: "temperature" | "humidity";
  value: number;
  unit: string;
}

// 2. Dữ liệu Tracking (Beacon)
export interface TrackingData extends BaseIotData {
  gateway: string;
  device: string;
  rssi: number;
  data: {
    uuid: string;
    major: number;
    minor: number;
    txPower: number;
    rssi_smooth: number;
    distance: number;
  };
}

// 3. Dữ liệu Asset (MokoSmart)
export interface AssetData extends BaseIotData {
  macAddress: string;
  device_info: {
    model: string;
  };
  telemetry: {
    battery: { voltage_v: number; voltage_mv: number };
    accelerometer: {
      x_axis: number;
      y_axis: number;
      z_axis: number;
      unit: string;
    };
  };
  analysis: {
    orientation_status: string;
    is_moving: boolean;
  };
  lastUpdated: string;
}

// Union Type để Socket nhận diện
export type IncomingSocketData = EnvData | TrackingData | AssetData;
