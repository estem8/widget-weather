import type {
  PluginSnapshots,
  PluginWidgetProps,
  PublicChannelPayloads,
} from '@irdashies/plugin-api';
import type { ReactNode } from 'react';
import './weather.css';

type WeatherConfig = {
  layout: 'vertical' | 'horizontal';
  units: 'auto' | 'Metric' | 'Imperial';
  opacity: number;
  showTrackTemp: boolean;
  showAirTemp: boolean;
  showWind: boolean;
  showHumidity: boolean;
  showPrecipitation: boolean;
  showWetness: boolean;
  showOnlyWhenOnTrack: boolean;
};

type WeatherSnapshots = PluginSnapshots<
  'session-bar.snapshot' | 'track-state.snapshot'
>;

interface WeatherColumn {
  key: string;
  icon: ReactNode;
  label: string;
  value: string;
  direction?: number;
  yaw?: number;
}

const WETNESS = [
  '',
  'Dry',
  'Mostly dry',
  'Very lightly wet',
  'Lightly wet',
  'Moderately wet',
  'Very wet',
  'Extremely wet',
];

const numberValue = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const displayTemp = (
  value: unknown,
  units: WeatherConfig['units'],
  displayUnits: number | undefined
) => {
  const celsius = numberValue(value);
  if (celsius === undefined) return '—';
  const metric = units === 'auto' ? displayUnits === 1 : units === 'Metric';
  const temperature = metric ? celsius : (celsius * 9) / 5 + 32;
  return `${Math.round(temperature)}°${metric ? 'C' : 'F'}`;
};

const WindIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 16h7a2 2 0 1 1-2 2" />
  </svg>
);

const ThermometerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z" />
    <path d="M11 13V5" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3s7 7.2 7 12a7 7 0 1 1-14 0c0-4.8 7-12 7-12Z" />
  </svg>
);

const WeatherWidget = ({
  config,
  snapshots,
}: PluginWidgetProps<WeatherConfig, WeatherSnapshots>) => {
  const session = snapshots['session-bar.snapshot'] as
    | PublicChannelPayloads['session-bar.snapshot']
    | undefined;
  const track = snapshots['track-state.snapshot'];

  if (config.showOnlyWhenOnTrack && track?.isOnTrack === false) return null;

  const displayUnits = numberValue(session?.displayUnits);
  const wetness = numberValue(session?.trackWetness);
  const windMps = numberValue(session?.windVelocity);
  const metric = config.units === 'auto' ? displayUnits === 1 : config.units === 'Metric';
  const windSpeed =
    windMps === undefined
      ? '—'
      : `${Math.round(windMps * (metric ? 3.6 : 2.23694))} ${metric ? 'km/h' : 'mph'}`;
  const direction = numberValue(session?.windDirection);
  const yaw = numberValue(session?.windYaw);
  const wetnessLevel = wetness === undefined ? undefined : Math.round(wetness);
  const wetnessPercent =
    wetnessLevel === undefined
      ? 0
      : Math.max(0, Math.min(100, ((wetnessLevel - 1) / 6) * 100));

  const columns: WeatherColumn[] = [];
  if (config.showTrackTemp) {
    columns.push({
      key: 'track-temp',
      icon: <ThermometerIcon />,
      label: 'Track',
      value: displayTemp(session?.trackTemp, config.units, displayUnits),
    });
  }
  if (config.showAirTemp) {
    columns.push({
      key: 'air-temp',
      icon: <ThermometerIcon />,
      label: 'Air',
      value: displayTemp(session?.airTemp, config.units, displayUnits),
    });
  }
  if (config.showWind) {
    columns.push({
      key: 'wind',
      icon: <WindIcon />,
      label: 'Wind',
      value: windSpeed,
      direction,
      yaw,
    });
  }
  if (config.showHumidity) {
    columns.push({
      key: 'humidity',
      icon: <DropletIcon />,
      label: 'Humidity',
      value:
        numberValue(session?.relativeHumidity) === undefined
          ? '—'
          : `${Math.round((session?.relativeHumidity ?? 0) * 100)}%`,
    });
  }
  if (config.showPrecipitation) {
    columns.push({
      key: 'precipitation',
      icon: <DropletIcon />,
      label: 'Precipitation',
      value:
        numberValue(session?.precipitation) === undefined
          ? '—'
          : `${Math.round((session?.precipitation ?? 0) * 100)}%`,
    });
  }
  if (config.showWetness) {
    columns.push({
      key: 'wetness',
      icon: <DropletIcon />,
      label: 'Wetness',
      value:
        wetnessLevel === undefined
          ? '—'
          : (WETNESS[wetnessLevel] ?? 'Unknown'),
    });
  }

  return (
    <section
      className={`weather-plugin ${config.layout === 'horizontal' ? 'weather-plugin--horizontal' : ''}`}
      style={{ '--weather-opacity': `${config.opacity}%` } as React.CSSProperties}
      aria-label="Weather"
    >
      <div className="weather-plugin__grid">
        {columns.map((column) => (
          <div className="weather-plugin__cell" key={column.key}>
            <div className="weather-plugin__cell-heading">
              <span className="weather-plugin__icon">{column.icon}</span>
              <span className="weather-plugin__label">{column.label}</span>
              <span className="weather-plugin__value">{column.value}</span>
              {column.key === 'wind' &&
                column.direction !== undefined &&
                column.yaw !== undefined && (
                  <span
                    className="weather-plugin__wind-direction"
                    style={{
                      transform: `rotate(${column.direction - column.yaw}rad)`,
                    }}
                    aria-label="Wind direction"
                  >
                    ↑
                  </span>
                )}
            </div>
            {column.key === 'wetness' && (
              <div
                className="weather-plugin__wetness-track"
                role="progressbar"
                aria-label="Track wetness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={wetnessPercent}
              >
                <span style={{ width: `${wetnessPercent}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeatherWidget;
