import type {
  CaseProgress,
  CaseTransition,
  CivicCase,
  InstitutionId,
} from "./types.ts";

export interface ActionChoice {
  id: string;
  institutionId: InstitutionId;
  actor: string;
  actorKind: "institution" | "participant";
  text: string;
  lawful: boolean;
}

export function getAvailableTransitions(
  stateId: string,
  civicCase: CivicCase,
): readonly CaseTransition[] {
  return civicCase.transitions.filter((item) => item.fromStateId === stateId);
}

export function getOrderedActionChoices(
  stateId: string,
  civicCase: CivicCase,
): readonly ActionChoice[] {
  const lawfulChoices = getAvailableTransitions(stateId, civicCase).map((item) => ({
    id: item.actionId,
    institutionId: item.institutionId,
    actor: item.specificActor,
    actorKind: item.actorKind ?? "institution",
    text: item.actionText,
    lawful: true,
  }));
  const misconceptionChoices = civicCase.misconceptions
    .filter((item) => item.stateId === stateId)
    .map((item) => ({
      id: item.id,
      institutionId: item.institutionId,
      actor: item.specificActor,
      actorKind: "institution" as const,
      text: item.actionText,
      lawful: false,
    }));

  if (lawfulChoices.length !== 1) {
    return [...lawfulChoices, ...misconceptionChoices];
  }

  const state = civicCase.states.find((item) => item.id === stateId);
  const answerPosition = state?.answerPosition ?? 0;
  const orderedChoices = [...misconceptionChoices];
  orderedChoices.splice(answerPosition, 0, lawfulChoices[0]);
  return orderedChoices;
}

export function applyTransition(
  progress: CaseProgress,
  transition: CaseTransition,
): CaseProgress {
  if (transition.fromStateId !== progress.currentStateId) {
    throw new Error("현재 사건 상태에서 사용할 수 없는 행동입니다.");
  }

  return {
    currentStateId: transition.toStateId,
    history: [
      ...progress.history,
      {
        transitionId: transition.id,
        fromStateId: transition.fromStateId,
        toStateId: transition.toStateId,
        actionText: transition.actionText,
        relationLabel: transition.relationLabel,
        institutionId: transition.institutionId,
        specificActor: transition.specificActor,
      },
    ],
    completed: Boolean(transition.completesCase),
  };
}

export function undoLastTransition(progress: CaseProgress): CaseProgress {
  const previousRecord = progress.history.at(-1);
  if (!previousRecord) return progress;

  return {
    currentStateId: previousRecord.fromStateId,
    history: progress.history.slice(0, -1),
    completed: false,
  };
}

export function validateCaseBank(bank: readonly CivicCase[]): string[] {
  const errors: string[] = [];

  if (bank.length !== 3) {
    errors.push("사건은 정확히 3개여야 합니다.");
  }

  for (const civicCase of bank) {
    const stateIds = new Set(civicCase.states.map((state) => state.id));
    const transitionIds = new Set<string>();

    if (!stateIds.has(civicCase.initialStateId)) {
      errors.push(`${civicCase.id}: 시작 상태가 없습니다.`);
    }

    for (const transition of civicCase.transitions) {
      if (transitionIds.has(transition.id)) {
        errors.push(`${civicCase.id}: 중복 전이 ${transition.id}`);
      }
      transitionIds.add(transition.id);

      if (!stateIds.has(transition.fromStateId)) {
        errors.push(`${civicCase.id}: 시작 상태 참조 오류 ${transition.id}`);
      }
      if (!stateIds.has(transition.toStateId)) {
        errors.push(`${civicCase.id}: 도착 상태 참조 오류 ${transition.id}`);
      }
      if (transition.legalSourceIds.length === 0) {
        errors.push(`${civicCase.id}: 공식 근거 없음 ${transition.id}`);
      }
      if (
        transition.institutionId === "court" &&
        /예산.*확정|사업.*운영|법률안.*의결/.test(transition.effectText)
      ) {
        errors.push(`${civicCase.id}: 법원 금지 효과 ${transition.id}`);
      }
    }

    for (const state of civicCase.states) {
      const transitions = getAvailableTransitions(state.id, civicCase);
      if (transitions.length !== 1) continue;

      const misconceptionCount = civicCase.misconceptions.filter(
        (item) => item.stateId === state.id,
      ).length;
      if (state.answerPosition == null) {
        errors.push(`${civicCase.id}: 정답 위치 없음 ${state.id}`);
      }
      if (misconceptionCount !== 2) {
        errors.push(`${civicCase.id}: 3지선다 구성 오류 ${state.id}`);
      }
    }
  }

  return errors;
}
