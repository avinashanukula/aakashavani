export type Page = 
  | 'home' 
  | 'aakashavani' 
  | 'approach' 
  | 'architecture' 
  | 'applications' 
  | 'about' 
  | 'contact';

export interface ArchitectureNodeData {
  id: string;
  number: string;
  name: string;
  layer: string;
  shortDesc: string;
  detailedDesc: string;
  inputs: string[];
  outputs: string[];
  metrics: {
    latency: string;
    certaintyType: string;
    invalidationTrigger: string;
  };
  asciiDiagram?: string;
  codeSnippet?: string;
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
