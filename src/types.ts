export type Page = 
  | 'home' 
  | 'aakashavani' 
  | 'approach' 
  | 'applications' 
  | 'about' 
  | 'contact';

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
