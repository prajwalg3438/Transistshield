export type CommuterProfileType = 'default' | 'wheelchair' | 'elderly' | 'time_critical';

export interface RouteItem {
  id: string;
  routeNumber: string;
  routeName: string;
  mode: 'bus' | 'metro_feeder' | 'bus_express' | 'bus_lowfloor';
  origin: string;
  destination: string;
  stops: string[];
  nominalTravelTimeMins: number;
  arrivalEstimateMins: number;
  uncertaintyRangeMins: number;
  dataSource: 'live_gps' | 'historical_reports' | 'timetable_fallback';
  reliabilityConfidencePercent: number;
  dataSourceLabel: string;
  predictedOccupancyPercent: number;
  seatsLikelihood: 'plenty' | 'few' | 'standing_only';
  hasStepFreeAccess: boolean;
  isWheelchairAccessible: boolean;
  accessibilityNotes: string;
  stopsWithBarriers: string[];
  hasActiveDisruption: boolean;
  disruptionDescription?: string;
  delayMins: number;
  riskScore: number;
  riskBreakdown: {
    reliabilityRisk: number;
    crowdingRisk: number;
    accessibilityRisk: number;
    disruptionRisk: number;
    isHardConstraintViolated: boolean;
    violationReason?: string;
  };
  rank: number;
  isRecommendedAlternative?: boolean;
  alternativeTriggerReason?: string;
}

export interface BusStopItem {
  id: string;
  name: string;
  code: string;
  area: string;
  lat: number;
  lng: number;
  accessibilityStatus: 'step-free' | 'barrier' | 'blocked';
  knownBarriers: string[];
  stepFreeAccess: boolean;
  elevatorWorking: boolean;
  audioTactilePaving: boolean;
  busLines: string[];
  recentReportsCount: number;
}

export interface CommunityReportItem {
  id: string;
  stopId: string;
  stopName: string;
  busRoute?: string;
  type: 'delay' | 'overcrowding' | 'blocked_path' | 'barrier_broken' | 'bus_cancelled';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: number;
  expiresAt: number;
  upvotes: number;
}

export interface HourlyData {
  timeSlot: string;
  seatsTakenPercent: number;
  isPeak: boolean;
  label: string;
}

export interface BacktestSummaryItem {
  totalTrips: number;
  onTimeArrivalRate: {
    timeBasedMethod: number;
    transitShield: number;
  };
  averageWaitingTimeMins: {
    timeBasedMethod: number;
    transitShield: number;
  };
  crowdingExperiencedHighPercent: {
    timeBasedMethod: number;
    transitShield: number;
  };
  accessibilityNeedsViolatedPercent: {
    timeBasedMethod: number;
    transitShield: number;
  };
}
