export type CommuterProfileType = 
  | 'default'
  | 'wheelchair'
  | 'elderly'
  | 'time_critical';

export interface ProfileWeights {
  reliability: number;
  crowding: number;
  accessibility: number;
  disruption: number;
}

export type AccessibilityStatus = 'step-free' | 'barrier' | 'blocked'; // Green, Amber, Red

export interface BusStop {
  id: string;
  name: string;
  code: string; // e.g. QR-MG-ROAD-01
  area: string;
  lat: number;
  lng: number;
  accessibilityStatus: AccessibilityStatus;
  knownBarriers: string[];
  stepFreeAccess: boolean;
  elevatorWorking: boolean;
  audioTactilePaving: boolean;
  busLines: string[];
  qrCodeUrl?: string;
  recentReportsCount: number;
}

export type DataSourceType = 'live_gps' | 'historical_reports' | 'timetable_fallback';

export interface RouteOption {
  id: string;
  routeNumber: string; // e.g. "Bus 500D", "Metro + feeder", "Bus 335E"
  routeName: string;
  mode: 'bus' | 'metro_feeder' | 'bus_express' | 'bus_lowfloor';
  origin: string;
  destination: string;
  stops: string[];
  nominalTravelTimeMins: number;
  
  // Smart arrival prediction with uncertainty
  arrivalEstimateMins: number;
  uncertaintyRangeMins: number; // e.g. ±4 mins (confidence 90%)
  dataSource: DataSourceType;
  reliabilityConfidencePercent: number; // e.g. 95% for Live, 80% for Historical, 45% for Timetable
  dataSourceLabel: string; // e.g. "Live GPS Feed", "Historical + 4 Commuter Reports", "Timetable Fallback"
  
  // Crowding prediction
  predictedOccupancyPercent: number; // e.g. 95%
  seatsLikelihood: 'plenty' | 'few' | 'standing_only';
  
  // Accessibility
  hasStepFreeAccess: boolean;
  isWheelchairAccessible: boolean;
  accessibilityNotes: string;
  stopsWithBarriers: string[];
  
  // Disruption status
  hasActiveDisruption: boolean;
  disruptionDescription?: string;
  delayMins: number;
  
  // Calculated Risk Score & Components
  riskScore?: number; // 0 (safest) to 100 (highest risk)
  riskBreakdown?: {
    reliabilityRisk: number;
    crowdingRisk: number;
    accessibilityRisk: number;
    disruptionRisk: number;
    isHardConstraintViolated: boolean;
    violationReason?: string;
  };
  
  isRecommendedAlternative?: boolean;
  alternativeTriggerReason?: string;
}

export interface QRFeedbackSubmission {
  id: string;
  stopId: string;
  stopName: string;
  busLine?: string;
  hasBusArrived: 'yes' | 'no' | 'running_late';
  seatsStatus: 'plenty' | 'few' | 'standing_only';
  barrierStatus?: AccessibilityStatus;
  barrierNotes?: string;
  timestamp: number; // epoch ms
  expiresAt: number; // epoch ms (60 mins after submission)
}

export interface CommunityReport {
  id: string;
  stopId: string;
  stopName: string;
  busRoute?: string;
  type: 'delay' | 'overcrowding' | 'blocked_path' | 'barrier_broken' | 'bus_cancelled';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: number;
  expiresAt: number; // 60-min TTL
  upvotes: number;
}

export interface HourlyBusyData {
  timeSlot: string; // e.g. "6-8", "8-10"
  seatsTakenPercent: number; // e.g. 55, 95
  isPeak: boolean;
  label: string;
}

export interface BacktestTripResult {
  tripId: string;
  date: string;
  time: string;
  routeChosenTimeBased: string;
  routeChosenTransitShield: string;
  timeBasedOutcome: {
    travelTimeMins: number;
    waitingTimeMins: number;
    onTime: boolean;
    crowdingExperienced: 'plenty' | 'few' | 'standing_only';
    accessibilityViolated: boolean;
    riskScore: number;
  };
  transitShieldOutcome: {
    travelTimeMins: number;
    waitingTimeMins: number;
    onTime: boolean;
    crowdingExperienced: 'plenty' | 'few' | 'standing_only';
    accessibilityViolated: boolean;
    riskScore: number;
  };
}

export interface BacktestSummary {
  totalTrips: number;
  onTimeArrivalRate: {
    timeBasedMethod: number; // e.g. 68.4%
    transitShield: number; // e.g. 94.2%
  };
  averageWaitingTimeMins: {
    timeBasedMethod: number; // e.g. 22.8
    transitShield: number; // e.g. 7.6
  };
  crowdingExperiencedHighPercent: {
    timeBasedMethod: number; // e.g. 86.5%
    transitShield: number; // e.g. 29.4%
  };
  accessibilityNeedsViolatedPercent: {
    timeBasedMethod: number; // e.g. 41.2%
    transitShield: number; // e.g. 0.0%
  };
}

export interface VoiceGuidanceResponse {
  language: 'en' | 'hi' | 'kn';
  audioText: string;
  title: string;
  routeSummary: string;
  details: {
    arrival: string;
    crowding: string;
    accessibility: string;
    risk: string;
  };
}
