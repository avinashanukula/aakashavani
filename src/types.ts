export type Page = 
  | 'home' 
  | 'aakashavani' 
  | 'beta-dashboard'
  | 'admin-ops'
  | 'approach' 
  | 'applications' 
  | 'about' 
  | 'contact'
  | 'auth';

export interface BetaReview {
  id: string;
  tester_id?: string;
  tester_name: string;
  tester_email: string;
  tester_institution?: string;
  tester_role: string;
  rating: number;
  category: 'world-model' | 'adaptation' | 'latency' | 'ui' | 'bug' | string;
  title: string;
  commentary: string;
  tested_scenario?: string;
  created_at: string;
}

export interface AdminUserRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  institution: string;
  role: BetaRole;
  approval_status: 'approved' | 'pending' | 'rejected';
  clearance_code: string;
  tester_tier: string;
  created_at: string;
  two_factor_expires_at?: string;
}

export type BetaRole = 
  | 'quant-researcher'
  | 'macro-strategist'
  | 'fx-rates-trader'
  | 'dialectic-evaluator'
  | 'compliance-officer';

export interface BetaRoleInfo {
  id: BetaRole;
  title: string;
  badge: string;
  clearanceLevel: string;
  description: string;
  permissions: string[];
  focusArea: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  role: BetaRole;
  approvalStatus: 'approved' | 'pending' | 'reviewing';
  joinedAt: string;
  clearanceCode: string;
  notificationsEnabled: boolean;
  testerTier: string;
}

export interface InboxMessage {
  id: string;
  sender: string;
  title: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  category: 'approval' | 'system' | 'regime_alert';
  roleGranted?: BetaRole;
  clearanceCode?: string;
  actionLabel?: string;
  actionPage?: Page;
}

export interface SimulationScenario {
  id: string;
  title: string;
  domain: string;
  timestamp: string;
  initialRegime: string;
  shockEvent: string;
  hypotheses: {
    label: string;
    probability: number;
    evidence: string;
    counterClaim: string;
  }[];
  beliefState: {
    regime: string;
    epistemicUncertainty: number;
    volatilitySurface: string;
    liquidityStress: string;
    invalidationConditions: string[];
  };
  orchestrationDispatched: string[];
  adversarialResolution: string;
  verifiedAction: string;
}
