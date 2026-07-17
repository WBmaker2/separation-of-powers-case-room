export type InstitutionId = "national-assembly" | "executive" | "court";

export type CaseKind = "bill" | "budget" | "administrative-disposition";

export interface CaseState {
  id: string;
  title: string;
  documentType: string;
  actor: string;
  effect: string;
  nextNeed: string;
  answerPosition?: 0 | 1 | 2;
  terminal?: boolean;
}

export interface EffectPrediction {
  question: string;
  options: readonly { id: string; text: string }[];
  correctId: string;
  explanation: string;
}

export interface CaseTransition {
  id: string;
  fromStateId: string;
  actionId: string;
  institutionId: InstitutionId;
  specificActor: string;
  actorKind?: "institution" | "participant";
  actionText: string;
  toStateId: string;
  relationLabel: string;
  effectText: string;
  limitText: string;
  legalSourceIds: readonly string[];
  prediction?: EffectPrediction;
  completesCase?: boolean;
  score?: never;
}

export interface MisconceptionAction {
  id: string;
  stateId: string;
  institutionId: InstitutionId;
  specificActor: string;
  actionText: string;
  feedback: string;
}

export interface CivicCase {
  id: string;
  kind: CaseKind;
  title: string;
  shortTitle: string;
  description: string;
  learningFocus: string;
  initialStateId: string;
  institutions: readonly InstitutionId[];
  states: readonly CaseState[];
  transitions: readonly CaseTransition[];
  misconceptions: readonly MisconceptionAction[];
  legalSourceIds: readonly string[];
}

export interface TransitionRecord {
  transitionId: string;
  fromStateId: string;
  toStateId: string;
  actionText: string;
  relationLabel: string;
  institutionId: InstitutionId;
  specificActor: string;
}

export interface CaseProgress {
  currentStateId: string;
  history: readonly TransitionRecord[];
  completed: boolean;
}
