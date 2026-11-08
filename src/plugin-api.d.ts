declare module '@irdashies/plugin-api' {
  export type PublicChannelName =
    | 'blind-spot.snapshot'
    | 'car-speeds.snapshot'
    | 'car-systems.snapshot'
    | 'driver-controls.snapshot'
    | 'fuel.projection'
    | 'lap-times.snapshot'
    | 'lap-log.snapshot'
    | 'lap-history.snapshot'
    | 'reference-laps.snapshot'
    | 'radar.snapshot'
    | 'radio.snapshot'
    | 'relative-gaps.snapshot'
    | 'sector-timing.snapshot'
    | 'session-timing.snapshot'
    | 'session-bar.snapshot'
    | 'standings.snapshot'
    | 'track-state.snapshot'
    | 'lap-trace.sample';

  export interface PublicChannelPayloads {
    'session-bar.snapshot': Readonly<{
      displayUnits: number;
      trackWetness: number;
      trackTemp?: number;
      airTemp?: number;
      windDirection?: number;
      windVelocity?: number;
      windYaw?: number;
      relativeHumidity?: number;
      precipitation?: number;
      [key: string]: unknown;
    }>;
    'track-state.snapshot': Readonly<{
      isOnTrack: boolean;
      speed: number;
      lapDistPct: number;
      [key: string]: unknown;
    }>;
    [channel: string]: Readonly<Record<string, unknown>>;
  }

  export type PluginSnapshots<K extends PublicChannelName> = Partial<{
    [C in K]: PublicChannelPayloads[C];
  }>;

  export interface PluginWidgetProps<
    Config extends object,
    Snapshots extends object,
  > {
    widgetId: string;
    config: Readonly<Config>;
    snapshots: Readonly<Snapshots>;
    theme: Readonly<Record<string, string>>;
    preview: boolean;
    onConfigChange(patch: Partial<Config>): void;
  }
}
