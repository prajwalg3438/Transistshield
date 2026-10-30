import {
  BusStop,
  RouteOption,
  ProfileWeights,
  CommuterProfileType,
  HourlyBusyData,
  CommunityReport,
  QRFeedbackSubmission,
  BacktestTripResult,
  BacktestSummary
} from './types.ts';

// PROFILE WEIGHTS (from Slide 6)
export const COMMUTER_PROFILE_WEIGHTS: Record<CommuterProfileType, ProfileWeights> = {
  default: {
    reliability: 0.40,
    crowding: 0.25,
    accessibility: 0.10,
    disruption: 0.25,
  },
  wheelchair: {
    reliability: 0.20,
    crowding: 0.15,
    accessibility: 0.50,
    disruption: 0.15,
  },
  elderly: {
    reliability: 0.25,
    crowding: 0.30,
    accessibility: 0.30,
    disruption: 0.15,
  },
  time_critical: {
    reliability: 0.60,
    crowding: 0.10,
    accessibility: 0.05,
    disruption: 0.25,
  },
};

// BUS STOPS WITH ACCESSIBILITY STATUS (Green: step-free, Amber: barrier, Red: path blocked)
export const INITIAL_STOPS: BusStop[] = [
  {
    id: 'stop-1',
    name: 'Silk Board Junction',
    code: 'QR-SLK-01',
    area: 'Central Interchange',
    lat: 12.9176,
    lng: 77.6234,
    accessibilityStatus: 'barrier', // Amber
    knownBarriers: ['Pedestrian footbridge has 28 steep steps', 'Elevator under maintenance'],
    stepFreeAccess: false,
    elevatorWorking: false,
    audioTactilePaving: true,
    busLines: ['500D', '335E', 'MF-102', '500A'],
    recentReportsCount: 4,
  },
  {
    id: 'stop-2',
    name: 'HSR Layout 14th Main',
    code: 'QR-HSR-02',
    area: 'Residential Hub',
    lat: 12.9116,
    lng: 77.6389,
    accessibilityStatus: 'step-free', // Green
    knownBarriers: ['Smooth curb cut ramp installed', 'Level tactile paving available'],
    stepFreeAccess: true,
    elevatorWorking: true,
    audioTactilePaving: true,
    busLines: ['500D', 'MF-102'],
    recentReportsCount: 1,
  },
  {
    id: 'stop-3',
    name: 'Bellandur EcoSpace Gate',
    code: 'QR-BLR-03',
    area: 'Tech Corridor',
    lat: 12.9260,
    lng: 77.6762,
    accessibilityStatus: 'blocked', // Red
    knownBarriers: ['Water pipeline construction blocked footway', 'Muddy detour with broken curb'],
    stepFreeAccess: false,
    elevatorWorking: false,
    audioTactilePaving: false,
    busLines: ['500D', 'MF-102'],
    recentReportsCount: 7,
  },
  {
    id: 'stop-4',
    name: 'Indiranagar Metro Station (Concourse & Feeder)',
    code: 'QR-IDN-04',
    area: 'Metro Interchange',
    lat: 12.9784,
    lng: 77.6408,
    accessibilityStatus: 'step-free', // Green
    knownBarriers: ['Dual hydraulic elevators operational', 'Tactile paving from ticket gate to bus bay'],
    stepFreeAccess: true,
    elevatorWorking: true,
    audioTactilePaving: true,
    busLines: ['Metro Purple', 'MF-102', '335E'],
    recentReportsCount: 0,
  },
  {
    id: 'stop-5',
    name: 'Old Airport Road Manipal Hospital',
    code: 'QR-OAR-05',
    area: 'Medical District',
    lat: 12.9592,
    lng: 77.6496,
    accessibilityStatus: 'step-free', // Green
    knownBarriers: ['Dedicated wheelchair boarding bay', 'Audio announcements at shelter'],
    stepFreeAccess: true,
    elevatorWorking: true,
    audioTactilePaving: true,
    busLines: ['335E', '335D'],
    recentReportsCount: 2,
  },
  {
    id: 'stop-6',
    name: 'Kadubeesanahalli Overbridge',
    code: 'QR-KDH-06',
    area: 'Outer Ring Road',
    lat: 12.9366,
    lng: 77.6912,
    accessibilityStatus: 'barrier', // Amber
    knownBarriers: ['No ramp on East bus shelter', '30cm curb height without dip'],
    stepFreeAccess: false,
    elevatorWorking: false,
    audioTactilePaving: false,
    busLines: ['500D'],
    recentReportsCount: 3,
  },
  {
    id: 'stop-7',
    name: 'Whitefield TTMC Terminal',
    code: 'QR-WFD-07',
    area: 'Transit Hub',
    lat: 12.9698,
    lng: 77.7499,
    accessibilityStatus: 'step-free', // Green
    knownBarriers: ['Full accessibility audited', 'Braille maps & low-counter ticket booths'],
    stepFreeAccess: true,
    elevatorWorking: true,
    audioTactilePaving: true,
    busLines: ['500D', 'Metro Purple', '335E', 'MF-102'],
    recentReportsCount: 1,
  },
];

// BUSY TIMES OCCUPANCY DATA (from Slide 4)
export const HOURLY_BUSY_DATA: HourlyBusyData[] = [
  { timeSlot: '6-8', seatsTakenPercent: 55, isPeak: false, label: 'Early Morning Build-up' },
  { timeSlot: '8-10', seatsTakenPercent: 95, isPeak: true, label: 'Morning Rush Hour Peak' },
  { timeSlot: '10-12', seatsTakenPercent: 50, isPeak: false, label: 'Mid-Morning Slack' },
  { timeSlot: '12-14', seatsTakenPercent: 45, isPeak: false, label: 'Early Afternoon Low' },
  { timeSlot: '14-16', seatsTakenPercent: 55, isPeak: false, label: 'Pre-Evening Build-up' },
  { timeSlot: '16-18', seatsTakenPercent: 92, isPeak: true, label: 'Evening Commute Peak' },
  { timeSlot: '18-20', seatsTakenPercent: 60, isPeak: false, label: 'Night Ramp-down' },
];

// ROUTE DEFINITIONS INCLUDING THE 3 SPOTLIGHT OPTIONS FROM SLIDE 6
export const INITIAL_ROUTES: RouteOption[] = [
  {
    id: 'route-500d',
    routeNumber: 'Bus 500D',
    routeName: 'Outer Ring Road SuperFast Express',
    mode: 'bus_express',
    origin: 'Silk Board Junction',
    destination: 'Whitefield TTMC Terminal',
    stops: ['stop-1', 'stop-2', 'stop-3', 'stop-6', 'stop-7'],
    nominalTravelTimeMins: 35, // Marketed as fastest trip!
    arrivalEstimateMins: 14,
    uncertaintyRangeMins: 8, // 14 ± 8 mins = high arrival uncertainty
    dataSource: 'historical_reports',
    reliabilityConfidencePercent: 62,
    dataSourceLabel: 'Historical + 4 Commuter Reports',
    predictedOccupancyPercent: 92, // High crowding
    seatsLikelihood: 'standing_only',
    hasStepFreeAccess: false,
    isWheelchairAccessible: false,
    accessibilityNotes: 'Stop 3 (Bellandur) has path blocked by pipeline work; Stop 1 has 28 steep stairs.',
    stopsWithBarriers: ['stop-1', 'stop-3', 'stop-6'],
    hasActiveDisruption: true,
    disruptionDescription: 'Heavy congestion at Bellandur + construction bottleneck adding 15 min random delay.',
    delayMins: 16,
  },
  {
    id: 'route-metro-feeder',
    routeNumber: 'Metro + Feeder',
    routeName: 'Purple Line Metro + Dedicated Feeder MF-102',
    mode: 'metro_feeder',
    origin: 'Silk Board Junction',
    destination: 'Whitefield TTMC Terminal',
    stops: ['stop-1', 'stop-2', 'stop-4', 'stop-7'],
    nominalTravelTimeMins: 42,
    arrivalEstimateMins: 4,
    uncertaintyRangeMins: 1, // 4 ± 1 min = high precision
    dataSource: 'live_gps',
    reliabilityConfidencePercent: 96,
    dataSourceLabel: 'Live Metro Signaling GPS Feed',
    predictedOccupancyPercent: 45,
    seatsLikelihood: 'few',
    hasStepFreeAccess: true,
    isWheelchairAccessible: true,
    accessibilityNotes: 'All stations have working lifts, platform screen doors, and tactile guide paving.',
    stopsWithBarriers: [],
    hasActiveDisruption: false,
    delayMins: 2,
  },
  {
    id: 'route-335e',
    routeNumber: 'Bus 335E',
    routeName: 'Old Airport Road AC Low-Floor Transit',
    mode: 'bus_lowfloor',
    origin: 'Silk Board Junction',
    destination: 'Whitefield TTMC Terminal',
    stops: ['stop-1', 'stop-4', 'stop-5', 'stop-7'],
    nominalTravelTimeMins: 46, // 11 mins slower than 500D on timetable
    arrivalEstimateMins: 7,
    uncertaintyRangeMins: 2, // 7 ± 2 mins
    dataSource: 'live_gps',
    reliabilityConfidencePercent: 91,
    dataSourceLabel: 'Live Fleet GPS Telematics',
    predictedOccupancyPercent: 35, // Low crowding
    seatsLikelihood: 'plenty',
    hasStepFreeAccess: true,
    isWheelchairAccessible: true,
    accessibilityNotes: 'Fold-out ramp with kneeling suspension; priority wheelchair bays reserved.',
    stopsWithBarriers: [],
    hasActiveDisruption: false,
    delayMins: 0,
  },
  {
    id: 'route-alt-bypass',
    routeNumber: 'Feeder F-201A Alt',
    routeName: 'Indiranagar - Marathahalli Clean Feeder',
    mode: 'bus',
    origin: 'Silk Board Junction',
    destination: 'Whitefield TTMC Terminal',
    stops: ['stop-1', 'stop-2', 'stop-5', 'stop-7'],
    nominalTravelTimeMins: 48,
    arrivalEstimateMins: 8,
    uncertaintyRangeMins: 2,
    dataSource: 'historical_reports',
    reliabilityConfidencePercent: 84,
    dataSourceLabel: 'Historical + 6 Verified Rider Reports',
    predictedOccupancyPercent: 40,
    seatsLikelihood: 'plenty',
    hasStepFreeAccess: true,
    isWheelchairAccessible: true,
    accessibilityNotes: 'Step-free boarding at hospital bay and terminal.',
    stopsWithBarriers: [],
    hasActiveDisruption: false,
    delayMins: 3,
    isRecommendedAlternative: true,
    alternativeTriggerReason: 'Suggested bypass around Bellandur corridor obstruction on Bus 500D.',
  },
];

// INITIAL COMMUNITY REPORTS (Expiring in 60 mins from start)
const now = Date.now();
export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-01',
    stopId: 'stop-3',
    stopName: 'Bellandur EcoSpace Gate',
    busRoute: 'Bus 500D',
    type: 'blocked_path',
    severity: 'high',
    description: 'Fresh construction trench opened across footpath; wheelchairs and strollers cannot pass.',
    timestamp: now - 12 * 60 * 1000,
    expiresAt: now + 48 * 60 * 1000,
    upvotes: 14,
  },
  {
    id: 'rep-02',
    stopId: 'stop-3',
    stopName: 'Bellandur EcoSpace Gate',
    busRoute: 'Bus 500D',
    type: 'overcrowding',
    severity: 'high',
    description: 'Bus 500D arrived packed to the doors, did not let anyone board at gate 2.',
    timestamp: now - 8 * 60 * 1000,
    expiresAt: now + 52 * 60 * 1000,
    upvotes: 9,
  },
  {
    id: 'rep-03',
    stopId: 'stop-1',
    stopName: 'Silk Board Junction',
    busRoute: 'Bus 335E',
    type: 'delay',
    severity: 'low',
    description: 'Minor traffic signal delay of 3 mins; bus is running with plenty of empty seats.',
    timestamp: now - 18 * 60 * 1000,
    expiresAt: now + 42 * 60 * 1000,
    upvotes: 5,
  },
  {
    id: 'rep-04',
    stopId: 'stop-6',
    stopName: 'Kadubeesanahalli Overbridge',
    busRoute: 'Bus 500D',
    type: 'barrier_broken',
    severity: 'medium',
    description: 'Temporary gravel pile on zebra crossing, difficult for walking sticks.',
    timestamp: now - 25 * 60 * 1000,
    expiresAt: now + 35 * 60 * 1000,
    upvotes: 7,
  },
];

// BACKTEST HISTORICAL DATA (250 trips analyzed)
export const BACKTEST_SUMMARY_DATA: BacktestSummary = {
  totalTrips: 250,
  onTimeArrivalRate: {
    timeBasedMethod: 68.4,
    transitShield: 94.2,
  },
  averageWaitingTimeMins: {
    timeBasedMethod: 22.8,
    transitShield: 7.6,
  },
  crowdingExperiencedHighPercent: {
    timeBasedMethod: 86.5,
    transitShield: 29.4,
  },
  accessibilityNeedsViolatedPercent: {
    timeBasedMethod: 41.2,
    transitShield: 0.0, // Hard constraints prevent any violation
  },
};

export const SAMPLE_BACKTEST_TRIPS: BacktestTripResult[] = [
  {
    tripId: 'TRIP-1082',
    date: '2026-10-24',
    time: '08:45 AM',
    routeChosenTimeBased: 'Bus 500D (Nominal 35 min)',
    routeChosenTransitShield: 'Metro + Feeder MF-102 (Risk Score 24)',
    timeBasedOutcome: {
      travelTimeMins: 63, // severe delay
      waitingTimeMins: 26,
      onTime: false,
      crowdingExperienced: 'standing_only',
      accessibilityViolated: true,
      riskScore: 56,
    },
    transitShieldOutcome: {
      travelTimeMins: 41,
      waitingTimeMins: 5,
      onTime: true,
      crowdingExperienced: 'few',
      accessibilityViolated: false,
      riskScore: 24,
    },
  },
  {
    tripId: 'TRIP-1083',
    date: '2026-10-25',
    time: '09:15 AM',
    routeChosenTimeBased: 'Bus 500D (Nominal 35 min)',
    routeChosenTransitShield: 'Bus 335E (Risk Score 18)',
    timeBasedOutcome: {
      travelTimeMins: 58,
      waitingTimeMins: 21,
      onTime: false,
      crowdingExperienced: 'standing_only',
      accessibilityViolated: true,
      riskScore: 54,
    },
    transitShieldOutcome: {
      travelTimeMins: 47,
      waitingTimeMins: 6,
      onTime: true,
      crowdingExperienced: 'plenty',
      accessibilityViolated: false,
      riskScore: 18,
    },
  },
  {
    tripId: 'TRIP-1084',
    date: '2026-10-26',
    time: '17:30 PM',
    routeChosenTimeBased: 'Bus 500D (Nominal 35 min)',
    routeChosenTransitShield: 'Metro + Feeder MF-102 (Risk Score 24)',
    timeBasedOutcome: {
      travelTimeMins: 74,
      waitingTimeMins: 32,
      onTime: false,
      crowdingExperienced: 'standing_only',
      accessibilityViolated: false,
      riskScore: 68,
    },
    transitShieldOutcome: {
      travelTimeMins: 43,
      waitingTimeMins: 4,
      onTime: true,
      crowdingExperienced: 'few',
      accessibilityViolated: false,
      riskScore: 24,
    },
  },
  {
    tripId: 'TRIP-1085',
    date: '2026-10-27',
    time: '11:10 AM',
    routeChosenTimeBased: 'Bus 500D (Nominal 35 min)',
    routeChosenTransitShield: 'Bus 335E (Risk Score 18)',
    timeBasedOutcome: {
      travelTimeMins: 49,
      waitingTimeMins: 14,
      onTime: true,
      crowdingExperienced: 'few',
      accessibilityViolated: false,
      riskScore: 44,
    },
    transitShieldOutcome: {
      travelTimeMins: 45,
      waitingTimeMins: 8,
      onTime: true,
      crowdingExperienced: 'plenty',
      accessibilityViolated: false,
      riskScore: 18,
    },
  },
  {
    tripId: 'TRIP-1086',
    date: '2026-10-28',
    time: '16:45 PM',
    routeChosenTimeBased: 'Bus 500D (Nominal 35 min)',
    routeChosenTransitShield: 'Bus 335E (Risk Score 18)',
    timeBasedOutcome: {
      travelTimeMins: 67,
      waitingTimeMins: 28,
      onTime: false,
      crowdingExperienced: 'standing_only',
      accessibilityViolated: true,
      riskScore: 61,
    },
    transitShieldOutcome: {
      travelTimeMins: 46,
      waitingTimeMins: 7,
      onTime: true,
      crowdingExperienced: 'plenty',
      accessibilityViolated: false,
      riskScore: 18,
    },
  },
];

// SINGLE MASTER PLAIN-TEXT DOCUMENT (Compilation of Slides, Problem, Solution, Features, Script & Judge Q&As)
export const MASTER_REVIEW_DOCUMENT = `================================================================================
TRANSITSHIELD – SMART AND ACCESSIBLE PUBLIC TRANSPORTATION SYSTEM
MASTER PROJECT REVIEW DOCUMENT, SLIDE TRANSCRIPT, SPOKEN SCRIPT & JUDGE Q&A
Compiled for Final Review
================================================================================

PROJECT TITLE:
TRANSITSHIELD: Smart and Accessible Public Transportation System
Tagline: "Choose journeys by risk, not just travel time."

--------------------------------------------------------------------------------
1. PROBLEM STATEMENT
--------------------------------------------------------------------------------
Public transportation commuters face several challenges, including:
1. Unpredictable bus arrival times: Timetables do not reflect real street delays.
2. Overcrowding: Packed buses are discovered only after they reach the stop.
3. Long waiting periods & missed connections: Short trips turn into long journeys.
4. Inaccessible bus stops: Steps, steep footbridges, and broken paths block elderly
   passengers and persons with disabilities.
5. Insufficient information about service disruptions: Incident alerts reach
   commuters too late to take alternatives.

Existing apps only optimize for nominal travel time. A route advertised at 35 minutes
can routinely take 75 minutes due to delay volatility, missed boardings from overcrowding,
and insurmountable physical barriers. Commuters lack an intelligent, accessible
system that weighs risk against pure speed.

--------------------------------------------------------------------------------
2. PROPOSED SOLUTION
--------------------------------------------------------------------------------
TRANSITSHIELD calculates a composite "Journey Risk Score" (0 to 100, where lower is safer)
combining four critical real-world dimensions:
1. Arrival Uncertainty: Confidence intervals (e.g., 14 ± 8 min vs 4 ± 1 min).
2. Crowding Forecast: Seating likelihood (Plenty, Few, Standing Only) based on hourly
   profiles and live passenger counts.
3. Accessibility Barriers: Audit of stops, step-free access, and working lifts.
4. Active Disruptions: Real-time road blockages, breakdowns, and feeder bottlenecks.

When live GPS is unavailable, TransitShield gracefully falls back to historical
data combined with commuter crowdsourced reports, clearly labeling every estimate
with its confidence score (e.g., "Live GPS (96%)", "Historical + 4 Reports (62%)",
or "Timetable Fallback (45%)").

Alternative feasible routes are dynamically triggered whenever delays, crowding,
or disruptions surge.

--------------------------------------------------------------------------------
3. SEVEN KEY FEATURES
--------------------------------------------------------------------------------
1. SMART ARRIVAL PREDICTION:
   Arrival estimates with an explicit uncertainty range (e.g., "12 ± 4 mins" at 90% confidence).
2. CROWDING PREDICTION:
   Hourly bus seat utilization models allowing commuters to pick a calmer bus before leaving.
3. ACCESSIBILITY ASSISTANCE:
   Known barriers flagged per stop; step-free access enforced as a hard non-negotiable rule.
4. ALTERNATIVE ROUTE RECOMMENDATION:
   Instant feasible rerouting when unexpected delays or full buses strike.
5. VOICE AND MULTILINGUAL SUPPORT:
   Spoken guidance in English, Hindi (हिन्दी), and Kannada (ಕನ್ನಡ) via Web Speech API.
6. COMMUNITY REPORTING & 2-TAP QR FEEDBACK:
   Stop QR scanning with zero typing. Two quick taps: "Has the bus arrived?" and
   "Seats status". Reports automatically expire after 60 minutes.
7. JOURNEY RISK SCORE:
   Personalized route comparison scoring based on customized commuter profiles.

--------------------------------------------------------------------------------
4. SLIDE PRESENTATION CONTENT (SLIDES 1 TO 7)
--------------------------------------------------------------------------------

[SLIDE 1: TITLE]
TRANSITSHIELD
Smart and Accessible Public Transportation System
"Choose journeys by risk, not just travel time."

[SLIDE 2: FROM HIDDEN RISK TO ONE CLEAR SCORE]
The Problem:
- Unpredictable arrivals: Buses rarely arrive when the timetable says.
- Overcrowding: Full buses are only discovered at the stop.
- Long waits, missed connections: Short trips turn into long ones.
- Inaccessible stops: Steps and broken paths block many riders.
- Poor disruption information: Delays and closures reach commuters too late.

Our Solution:
- Inputs: Bus arrival uncertainty, predicted crowding, accessibility barriers, service disruptions.
- Engine: Feeds into the Journey Risk Score (lower is safer).
- Outcome: Ranked, personalised recommendations. Alternatives appear when disruptions hit.
- Reliability Graceful Fallback: When no live feed exists, the system relies on historical
  patterns and commuter reports, explicitly labeling estimate reliability.

[SLIDE 3: SEVEN FEATURES, ONE DECISION]
1. Smart arrival prediction: Arrival estimates with an uncertainty range.
2. Crowding prediction: Choose the less crowded bus before you go.
3. Accessibility assistance: Known barriers flagged, routes matched to needs.
4. Alternative routes: Feasible options when delays or disruptions occur.
5. Voice and multilingual: Simple spoken guidance in local languages.
6. Community reporting: Report delays, crowding and blocked paths.
7. Journey Risk Score: Routes compared on reliability, crowding, access, and disruption.
All seven draw on one shared dataset of routes, stops, and commuter reports.

[SLIDE 4: QR FEEDBACK, ACCESS AND BUSY TIMES]
- QR Feedback:
  * Scan the stop's QR code: One code per stop. No typing, no location hassle.
  * Tap two answers: Has the bus arrived? (Yes/No/Late), Seats (Plenty, Few, Standing only).
  * Everyone sees it: Estimates update instantly; reports expire after 60 minutes.
- Bus Stop Map:
  * Color status: Green = step-free, Amber = barrier, Red = path blocked.
- Busy Times Chart (Seats Taken %):
  * 6-8: 55% | 8-10: 95% | 10-12: 50% | 12-14: 45% | 14-16: 55% | 16-18: 92% | 18-20: 60%
  * Morning and evening peaks help commuters choose a quieter, stress-free vehicle.
- Accessibility Assistance:
  * Known barriers listed per stop, routes matched to commuter needs, step-free access as a hard rule.
- Voice Assistant:
  * Spoken arrival, seat, and route guidance in English, Hindi, and Kannada.

[SLIDE 5: WHAT THE PROTOTYPE IS BUILT WITH]
- HTML5 and CSS3: Page structure, responsive design, dark/light theme display.
- JavaScript / TypeScript & Express: Journey Risk Score engine, route search, and API endpoints.
- SVG Graphics: Schematic transit map dynamically highlighting the chosen route and stop conditions.
- Web Speech API: Spoken guidance in English, Hindi, and Kannada.
- Browser localStorage & TTL Queue: Keeps verified reports active for 60 minutes.
- VS Code & Node/Vite: Rapid development, cross-platform local execution, full test suite.
- Next Roadmap: Direct GTFS-Realtime ingestion and municipal transit API federation.

[SLIDE 6: FASTEST IS NOT ALWAYS SAFEST]
Comparative Journey Risk Score Chart (Lower is safer):
- Bus 500D (Nominal fastest: 35 mins): Risk Score = 52
- Metro + Feeder (Nominal: 42 mins): Risk Score = 24
- Bus 335E (Nominal: 46 mins): Risk Score = 18 (RECOMMENDED SAFEST)

Weights by Commuter Profile:
- Default Commuter:       Reliability 40% | Crowding 25% | Access 10% | Disruption 25%
- Wheelchair User:        Reliability 20% | Crowding 15% | Access 50% | Disruption 15% (Hard constraint: step-free)
- Elderly / Low Mobility: Reliability 25% | Crowding 30% | Access 30% | Disruption 15%
- Time-Critical Trip:     Reliability 60% | Crowding 10% | Access 05% | Disruption 25%

Hard constraints override the score: A wheelchair user is never offered a route lacking
step-free access, preventing strandings regardless of nominal travel speed.

[SLIDE 7: WHAT WE DELIVER AND HOW WE TEST IT]
Expected Outcome:
- A working prototype that empowers informed, risk-aware travel decisions.
- Fewer unsuitable routes chosen by vulnerable commuters.
- Drastic reduction in wasted waiting time at unsafe or crowded stops.
- Transportation information made universally accessible across languages and abilities.

How We Tested It (Back-test on 250 Historical Trips):
- On-Time Arrival Rate: Travel-Time Method 68.4% -> TransitShield 94.2% (+25.8% gain)
- Average Waiting Time: Travel-Time Method 22.8 mins -> TransitShield 7.6 mins (66% reduction)
- Crowding Experienced (High): Travel-Time Method 86.5% -> TransitShield 29.4%
- Accessibility Needs Violated: Travel-Time Method 41.2% -> TransitShield 0.0% (Zero tolerance achieved)

--------------------------------------------------------------------------------
5. VERBATIM SPOKEN SCRIPT (FOR PRESENTERS / DEMO)
--------------------------------------------------------------------------------
"Good morning, judges and colleagues.

Today, every major mapping app optimizes for one single metric: theoretical travel time.
They tell you Bus 500D takes 35 minutes. What they do not tell you is that at this exact hour,
Bus 500D has a 14-minute arrival uncertainty window, a 95% standing-room-only crowding index,
and a 28-step footbridge with a broken elevator at the transit junction. In reality, that
35-minute trip leaves you stranded for 65 minutes.

This is why we built TRANSITSHIELD. Our philosophy is simple: Choose journeys by risk,
not just travel time.

TransitShield introduces the Journey Risk Score, a single, calibrated metric scaled from 0
to 100, where lower is safer. Our risk engine continuously synthesizes four live pillars:
arrival uncertainty, seat occupancy forecast, physical access barriers, and service disruptions.

Crucially, our system adapts to the commuter. If you are a wheelchair user, accessibility
weight jumps to 50%, and step-free access acts as an uncompromising hard constraint.
Bus 500D is automatically discarded, and Bus 335E—a low-floor, kneeling bus with an 18 risk
score—is recommended instead.

To solve the blind-spot problem where transit GPS feeds fail, TransitShield implements a
two-tap QR feedback mechanism at every stop. A commuter simply scans the stop code—no typing,
no geolocation latency—and taps two answers: 'Has the bus arrived?' and 'Seat status'.
The estimate updates instantly for all riders and automatically expires after 60 minutes
to keep data fresh.

To ensure universal inclusion, TransitShield integrates voice guidance across three languages:
English, Hindi, and Kannada.

When we back-tested TransitShield against 250 historical peak-hour trips, on-time arrivals
jumped from 68% to 94%, average waiting dropped from 23 minutes to under 8 minutes, and
accessibility violations fell to absolute zero.

Fastest is not always safest. With TransitShield, public transit becomes predictable,
dignified, and accessible for everyone. Thank you."

--------------------------------------------------------------------------------
6. JUDGES' QUESTIONS AND PREPARED ANSWERS
--------------------------------------------------------------------------------
Q1: How does TransitShield prevent malicious or false community reports?
A1: TransitShield employs a multi-tiered validation architecture:
    1. Geofenced physical QR codes ensure reports can only be initiated at the stop.
    2. Reports have a strict 60-minute Time-To-Live (TTL), preventing stale accumulation.
    3. Consensus thresholding: A single outlier report requires secondary upvoting or
       matching historical time-slot distributions before heavily skewing the Journey
       Risk Score.
    4. Transparency labeling: Every estimate is marked with its provenance ('Live GPS',
       'Historical + 4 Reports', or 'Timetable Fallback') and confidence percentage.

Q2: How does the Journey Risk Score handle conflicting commuter priorities?
A2: We eliminate one-size-fits-all scoring by applying personalized weight matrices:
    - Default commuters balance reliability (40%) and disruptions (25%).
    - Time-critical commuters weight punctuality at 60%.
    - Wheelchair and mobility-impaired commuters elevate accessibility to 50% with hard
      boolean gatekeeping: if any leg of a route contains an unpassable barrier, the route
      is disqualified regardless of travel time.

Q3: Can this system function in cities without modern GTFS-Realtime infrastructure?
A3: Yes. TransitShield was engineered specifically for low-infrastructure transit systems.
    When live GTFS feeds are missing, the risk engine smoothly falls back to time-of-day
    historical models bolstered by high-density QR feedback. The commuter is always informed
    of the fallback confidence score.

Q4: Why provide trilingual audio guidance in English, Hindi, and Kannada?
A4: Public transit is a democratic necessity. Many daily wage earners, domestic workers,
    and elderly citizens cannot parse complex smartphone typography or English terminology.
    Native Web Speech syntheses in Hindi and Kannada with high-contrast color codes ensure
    equitable access for non-English speakers and visually impaired citizens.
================================================================================
`;
