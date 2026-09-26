import { Page, User, BetaRole } from '../types';

export type AccessDecision = 
  | 'ALLOW'
  | 'REQUIRE_AUTHENTICATION'
  | 'REQUIRE_APPROVAL'
  | 'FORBIDDEN_ROLE';

export interface MiddlewareResult {
  decision: AccessDecision;
  isAllowed: boolean;
  redirectPage?: Page;
  reason?: string;
  auditLog: {
    timestamp: string;
    targetPage: Page;
    userId: string | null;
    userRole: BetaRole | null;
    decision: AccessDecision;
  };
}

export interface RoutePolicy {
  requiresAuth: boolean;
  requiresApprovedBetaStatus?: boolean;
  allowedRoles?: BetaRole[];
  friendlyName: string;
}

// Route Access Matrix
export const ROUTE_POLICIES: Record<Page, RoutePolicy> = {
  home: {
    requiresAuth: false,
    friendlyName: 'Overview & World Models Foundation'
  },
  aakashavani: {
    requiresAuth: false, // Page is viewable, but beta features require auth
    friendlyName: 'Aakashavani Financial Intelligence Model'
  },
  approach: {
    requiresAuth: false,
    friendlyName: 'The World-Model Approach'
  },
  applications: {
    requiresAuth: false,
    friendlyName: 'Institutional Applications'
  },
  about: {
    requiresAuth: false,
    friendlyName: 'Mission & Philosophy'
  },
  contact: {
    requiresAuth: false,
    friendlyName: 'Institutional Contact & Briefing'
  },
  auth: {
    requiresAuth: false,
    friendlyName: 'Institutional Sign In & Beta Registration'
  }
};

/**
 * Authentication and Authorization Middleware
 * Evaluates route security policies against current session context.
 */
export function executeAuthMiddleware(
  targetPage: Page, 
  currentUser: User | null
): MiddlewareResult {
  const policy = ROUTE_POLICIES[targetPage] || { requiresAuth: false, friendlyName: targetPage };
  const timestamp = new Date().toISOString();

  // 1. Authentication check
  if (policy.requiresAuth && !currentUser) {
    return {
      decision: 'REQUIRE_AUTHENTICATION',
      isAllowed: false,
      redirectPage: 'auth',
      reason: `Authentication required: Access to ${policy.friendlyName} is restricted to authorized Veiron institutional testers.`,
      auditLog: {
        timestamp,
        targetPage,
        userId: null,
        userRole: null,
        decision: 'REQUIRE_AUTHENTICATION'
      }
    };
  }

  // 2. Beta Approval Authorization check
  if (policy.requiresApprovedBetaStatus && currentUser) {
    if (currentUser.approvalStatus !== 'approved') {
      return {
        decision: 'REQUIRE_APPROVAL',
        isAllowed: false,
        redirectPage: 'aakashavani',
        reason: `Beta Approval Pending: Your application for role [${currentUser.role}] is currently under review by the Veiron Access Committee.`,
        auditLog: {
          timestamp,
          targetPage,
          userId: currentUser.id,
          userRole: currentUser.role,
          decision: 'REQUIRE_APPROVAL'
        }
      };
    }
  }

  // 3. Role-Based Access Control (RBAC) check
  if (policy.allowedRoles && policy.allowedRoles.length > 0 && currentUser) {
    if (!policy.allowedRoles.includes(currentUser.role)) {
      return {
        decision: 'FORBIDDEN_ROLE',
        isAllowed: false,
        redirectPage: 'aakashavani',
        reason: `Insufficient Clearance: This module requires one of [${policy.allowedRoles.join(', ')}]. Current clearance: [${currentUser.role}].`,
        auditLog: {
          timestamp,
          targetPage,
          userId: currentUser.id,
          userRole: currentUser.role,
          decision: 'FORBIDDEN_ROLE'
        }
      };
    }
  }

  // Granted
  return {
    decision: 'ALLOW',
    isAllowed: true,
    auditLog: {
      timestamp,
      targetPage,
      userId: currentUser?.id || null,
      userRole: currentUser?.role || null,
      decision: 'ALLOW'
    }
  };
}

/**
 * Feature-level Authorization Guard
 * Use to protect sensitive beta actions (e.g. injecting custom market shocks or exporting audit logs).
 */
export function authorizeBetaAction(
  actionName: string,
  user: User | null,
  requiredRole?: BetaRole
): { allowed: boolean; message?: string } {
  if (!user) {
    return {
      allowed: false,
      message: `Authentication required: Sign in or opt-in for beta testing to execute '${actionName}'.`
    };
  }

  if (user.approvalStatus !== 'approved') {
    return {
      allowed: false,
      message: `Beta approval pending: Role '${user.role}' must be approved before running '${actionName}'.`
    };
  }

  if (requiredRole && user.role !== requiredRole) {
    return {
      allowed: false,
      message: `Role clearance restricted: '${actionName}' requires '${requiredRole}'. Your role: '${user.role}'.`
    };
  }

  return { allowed: true };
}
