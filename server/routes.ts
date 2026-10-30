import { Router, Request, Response } from 'express';
import {
  INITIAL_STOPS,
  INITIAL_ROUTES,
  HOURLY_BUSY_DATA,
  INITIAL_COMMUNITY_REPORTS,
  BACKTEST_SUMMARY_DATA,
  SAMPLE_BACKTEST_TRIPS,
  MASTER_REVIEW_DOCUMENT,
  COMMUTER_PROFILE_WEIGHTS
} from './data.ts';
import {
  calculateJourneyRisk,
  generateVoiceGuidance,
  CalculatedRouteResult
} from './riskEngine.ts';
import {
  BusStop,
  RouteOption,
  CommuterProfileType,
  CommunityReport,
  QRFeedbackSubmission
} from './types.ts';

const router = Router();

// In-memory runtime state for prototype persistence
let stops: BusStop[] = [...INITIAL_STOPS];
let routes: RouteOption[] = [...INITIAL_ROUTES];
let communityReports: CommunityReport[] = [...INITIAL_COMMUNITY_REPORTS];
let qrSubmissions: QRFeedbackSubmission[] = [];

// Helper to filter out expired reports (> 60 minutes)
function cleanExpiredReports() {
  const currentTime = Date.now();
  communityReports = communityReports.filter((rep) => rep.expiresAt > currentTime);
  qrSubmissions = qrSubmissions.filter((sub) => sub.expiresAt > currentTime);
}

// 1. GET /api/routes - Fetch and rank routes by Journey Risk Score
router.get('/routes', (req: Request, res: Response) => {
  cleanExpiredReports();
  const profile = (req.query.profile as CommuterProfileType) || 'default';
  const requireStepFree = req.query.requireStepFree === 'true';

  const scoredRoutes: CalculatedRouteResult[] = routes.map((route) => {
    // Count active reports for stops along this route
    const relevantReports = communityReports.filter((rep) =>
      route.stops.includes(rep.stopId) || rep.busRoute === route.routeNumber
    );
    return calculateJourneyRisk(route, profile, relevantReports.length);
  });

  // Sort: Lower Risk Score is safer / better!
  // If wheelchair profile or requireStepFree is selected, violated routes get pushed to the bottom
  scoredRoutes.sort((a, b) => {
    if (profile === 'wheelchair' || requireStepFree) {
      if (a.riskBreakdown.isHardConstraintViolated && !b.riskBreakdown.isHardConstraintViolated) return 1;
      if (!a.riskBreakdown.isHardConstraintViolated && b.riskBreakdown.isHardConstraintViolated) return -1;
    }
    return a.riskScore - b.riskScore;
  });

  // Assign ranks
  scoredRoutes.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  res.json({
    profile,
    weights: COMMUTER_PROFILE_WEIGHTS[profile] || COMMUTER_PROFILE_WEIGHTS.default,
    totalRoutes: scoredRoutes.length,
    recommendedRoute: scoredRoutes[0],
    routes: scoredRoutes,
  });
});

// 2. POST /api/routes/calculate-risk - Calculate risk score with custom weights or params
router.post('/routes/calculate-risk', (req: Request, res: Response) => {
  const { route, profile } = req.body;
  if (!route) {
    return res.status(400).json({ error: 'Route object is required.' });
  }
  const result = calculateJourneyRisk(route, profile || 'default');
  res.json(result);
});

// 3. GET /api/stops - Get all stops with accessibility status & QR codes
router.get('/stops', (_req: Request, res: Response) => {
  cleanExpiredReports();
  // Enrich stops with live active report counts
  const enrichedStops = stops.map((stop) => {
    const activeCount = communityReports.filter((rep) => rep.stopId === stop.id).length;
    return {
      ...stop,
      recentReportsCount: activeCount,
    };
  });
  res.json(enrichedStops);
});

// 4. GET /api/stops/:stopId - Get single stop details
router.get('/stops/:stopId', (req: Request, res: Response) => {
  const stop = stops.find((s) => s.id === req.params.stopId || s.code === req.params.stopId);
  if (!stop) {
    return res.status(404).json({ error: 'Bus stop not found.' });
  }
  const activeReports = communityReports.filter((r) => r.stopId === stop.id);
  res.json({ ...stop, activeReports });
});

// 5. POST /api/qr-feedback - Instant 2-tap QR feedback from stop
router.post('/qr-feedback', (req: Request, res: Response) => {
  const { stopId, stopCode, hasBusArrived, seatsStatus, barrierStatus, busLine, notes } = req.body;

  let targetStop = stops.find((s) => s.id === stopId || s.code === stopCode);
  if (!targetStop && stopCode) {
    targetStop = stops.find((s) => s.code.toLowerCase() === stopCode.toLowerCase());
  }
  if (!targetStop) {
    targetStop = stops[0]; // fallback
  }

  const submissionTime = Date.now();
  const submission: QRFeedbackSubmission = {
    id: `qr-sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    stopId: targetStop.id,
    stopName: targetStop.name,
    busLine: busLine || 'Bus 500D',
    hasBusArrived: hasBusArrived || 'yes',
    seatsStatus: seatsStatus || 'few',
    barrierStatus: barrierStatus || targetStop.accessibilityStatus,
    barrierNotes: notes,
    timestamp: submissionTime,
    expiresAt: submissionTime + 60 * 60 * 1000, // 60 minutes expiry
  };

  qrSubmissions.unshift(submission);

  // If a barrier status change was indicated, update the stop status
  if (barrierStatus && barrierStatus !== targetStop.accessibilityStatus) {
    targetStop.accessibilityStatus = barrierStatus;
    if (barrierStatus === 'blocked') {
      targetStop.stepFreeAccess = false;
      targetStop.knownBarriers.unshift(`User report: ${notes || 'Pathway blocked near curb.'}`);
    } else if (barrierStatus === 'step-free') {
      targetStop.stepFreeAccess = true;
    }
  }

  // Update associated route crowding & reliability based on instant feedback
  routes = routes.map((r) => {
    if (r.stops.includes(targetStop!.id)) {
      if (seatsStatus === 'standing_only') {
        r.predictedOccupancyPercent = Math.min(98, r.predictedOccupancyPercent + 10);
        r.seatsLikelihood = 'standing_only';
      } else if (seatsStatus === 'plenty') {
        r.predictedOccupancyPercent = Math.max(30, r.predictedOccupancyPercent - 15);
        r.seatsLikelihood = 'plenty';
      }
      r.dataSource = 'historical_reports';
      r.dataSourceLabel = `Live QR Feedback (${targetStop!.code}) + Commuter Reports`;
      r.reliabilityConfidencePercent = Math.min(95, r.reliabilityConfidencePercent + 5);
    }
    return r;
  });

  res.status(201).json({
    success: true,
    message: `QR feedback recorded for ${targetStop.name}. Estimates updated for all commuters. Expires in 60 minutes.`,
    feedback: submission,
    updatedStop: targetStop,
  });
});

// 6. GET /api/community-reports - List active community reports (60-min window)
router.get('/community-reports', (_req: Request, res: Response) => {
  cleanExpiredReports();
  res.json({
    totalActive: communityReports.length,
    reports: communityReports,
  });
});

// 7. POST /api/community-reports - Submit a delay, crowding, or barrier report
router.post('/community-reports', (req: Request, res: Response) => {
  const { stopId, busRoute, type, severity, description } = req.body;
  if (!stopId || !type || !description) {
    return res.status(400).json({ error: 'stopId, type, and description are required.' });
  }

  const stop = stops.find((s) => s.id === stopId) || stops[0];
  const submissionTime = Date.now();

  const newReport: CommunityReport = {
    id: `rep-${Date.now()}`,
    stopId: stop.id,
    stopName: stop.name,
    busRoute: busRoute || 'Bus 500D',
    type,
    severity: severity || 'medium',
    description,
    timestamp: submissionTime,
    expiresAt: submissionTime + 60 * 60 * 1000, // 60 mins
    upvotes: 1,
  };

  communityReports.unshift(newReport);

  // If high severity blocked path, update stop
  if (type === 'blocked_path') {
    stop.accessibilityStatus = 'blocked';
    stop.stepFreeAccess = false;
    if (!stop.knownBarriers.includes(description)) {
      stop.knownBarriers.unshift(description);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Community report successfully recorded. Active for 60 minutes.',
    report: newReport,
  });
});

// 8. POST /api/community-reports/:id/upvote
router.post('/community-reports/:id/upvote', (req: Request, res: Response) => {
  const report = communityReports.find((r) => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found or has expired.' });
  }
  report.upvotes += 1;
  res.json({ success: true, upvotes: report.upvotes });
});

// 9. GET /api/busy-times - Busy times chart: seats taken (%)
router.get('/busy-times', (_req: Request, res: Response) => {
  res.json({
    chartData: HOURLY_BUSY_DATA,
    note: 'Morning (8-10: 95%) and evening (16-18: 92%) peaks help commuters pick a quieter bus.',
  });
});

// 10. GET /api/backtest - Historical back-testing evaluation metrics
router.get('/backtest', (_req: Request, res: Response) => {
  res.json({
    summary: BACKTEST_SUMMARY_DATA,
    sampleTrips: SAMPLE_BACKTEST_TRIPS,
    methodology: 'Compared route chosen by standard travel-time minimization against TransitShield Journey Risk Score across 250 historical peak-hour trips.',
  });
});

// 11. GET /api/voice-guidance - Trilingual speech script
router.get('/voice-guidance', (req: Request, res: Response) => {
  const routeId = (req.query.routeId as string) || 'route-335e';
  const language = (req.query.lang as 'en' | 'hi' | 'kn') || 'en';
  const profile = (req.query.profile as CommuterProfileType) || 'default';

  const route = routes.find((r) => r.id === routeId) || routes[2]; // Default to safest 335E
  const scored = calculateJourneyRisk(route, profile);
  const guidance = generateVoiceGuidance(scored, language);

  res.json(guidance);
});

// 12. GET /api/document/full-review - Single master plain-text document
router.get('/document/full-review', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(MASTER_REVIEW_DOCUMENT);
});

// 13. POST /api/simulate-disruption - Toggle disruption on Bus 500D to test alternative route trigger
router.post('/simulate-disruption', (req: Request, res: Response) => {
  const { routeId = 'route-500d', enable = true } = req.body;
  const target = routes.find((r) => r.id === routeId);
  if (target) {
    target.hasActiveDisruption = enable;
    target.delayMins = enable ? 24 : 0;
    target.uncertaintyRangeMins = enable ? 12 : 3;
    target.predictedOccupancyPercent = enable ? 98 : 65;
    target.seatsLikelihood = enable ? 'standing_only' : 'few';
    if (enable) {
      target.disruptionDescription = 'Severe bottleneck & blocked underpass reported by commuters.';
    } else {
      target.disruptionDescription = undefined;
    }
  }
  res.json({ success: true, route: target });
});

export default router;
