"use client";

import { useEffect } from "react";
import { institutionCopy } from "./content.ts";
import { CaseGlossary } from "./CaseGlossary.tsx";
import { getAvailableTransitions, getOrderedActionChoices } from "./engine.ts";
import type {
  CaseProgress,
  CaseTransition,
  CivicCase,
} from "./types.ts";

interface CaseBoardProps {
  civicCase: CivicCase;
  caseNumber: number;
  progress: CaseProgress;
  selectedTransition: CaseTransition | null;
  attemptedActionId: string | null;
  predictionChoice: string | null;
  feedback: string;
  onSelectAction: (actionId: string) => void;
  onSelectPrediction: (predictionId: string) => void;
  onApply: () => void;
  onUndo: () => void;
}

export function CaseBoard({
  civicCase,
  caseNumber,
  progress,
  selectedTransition,
  attemptedActionId,
  predictionChoice,
  feedback,
  onSelectAction,
  onSelectPrediction,
  onApply,
  onUndo,
}: CaseBoardProps) {
  useEffect(() => {
    if (!attemptedActionId) return;

    const attemptedFeedback = document.getElementById(`choice-feedback-${attemptedActionId}`);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    attemptedFeedback?.scrollIntoView({
      block: "center",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [attemptedActionId, feedback]);

  const currentState = civicCase.states.find(
    (state) => state.id === progress.currentStateId,
  );
  if (!currentState) return null;

  const validTransitions = getAvailableTransitions(progress.currentStateId, civicCase);
  const isBranch = validTransitions.length > 1;
  const choices = getOrderedActionChoices(progress.currentStateId, civicCase);

  const prediction = selectedTransition?.prediction;
  const canApply = Boolean(
    selectedTransition && (!prediction || predictionChoice),
  );
  const continueHint = !selectedTransition
    ? "먼저 위에서 행동 하나를 골라 주세요."
    : prediction && !predictionChoice
      ? "행동의 결과를 하나 예상하면 계속할 수 있어요."
      : "준비됐어요. 선택한 행동으로 다음 상태를 확인해 보세요.";

  return (
    <section className="case-board" aria-labelledby="case-board-title">
      <div className="case-kicker-row">
        <p>가상 사건 {caseNumber}/3 · {civicCase.shortTitle}</p>
        <span>실제 사건이 아니라 공부를 위해 만든 사건이에요</span>
      </div>
      <h1 id="case-board-title">{civicCase.title}</h1>
      <CaseGlossary caseId={civicCase.id} compact />

      <details className="timeline-wrap">
        <summary>사건 처리 기록 {progress.history.length + 1}단계 보기</summary>
        <ol className="timeline">
          <li className="timeline-item timeline-initial">
            <span>시작</span>
            <strong>{civicCase.states[0].title}</strong>
          </li>
          {progress.history.map((record) => {
            const state = civicCase.states.find((item) => item.id === record.toStateId);
            return (
              <li className="timeline-item" key={record.transitionId}>
                <span>{record.relationLabel}</span>
                <strong>{state?.title}</strong>
              </li>
            );
          })}
        </ol>
      </details>

      <article className="current-state-card" aria-label={`현재 상태: ${currentState.title}`}>
        <div className="state-document">
          <span>{currentState.documentType}</span>
          <strong>{currentState.actor}</strong>
        </div>
        <div className="state-copy">
          <p>현재 상태</p>
          <h2>{currentState.title}</h2>
          <p>{currentState.effect}</p>
          <div className="next-need"><strong>다음에 할 일</strong>{currentState.nextNeed}</div>
        </div>
      </article>

      <div className="action-section">
        <div className="action-heading">
          <div>
            <p>{isBranch ? "가능한 두 절차" : "이번 단계의 행동"}</p>
            <h2>{isBranch ? "어느 쪽도 점수나 실패가 아니에요." : "지금 가능한 행동을 골라 보세요."}</h2>
          </div>
          {!isBranch && <span>누가 무엇을 하는지 함께 확인해요.</span>}
        </div>
        <div className={`action-grid ${isBranch ? "branch-grid" : ""}`}>
          {choices.map((choice) => {
            const institution = institutionCopy[choice.institutionId];
            const selected = selectedTransition?.actionId === choice.id;
            const attempted = attemptedActionId === choice.id && !selected;
            const attemptedFeedbackId = `choice-feedback-${choice.id}`;
            const isParticipant = choice.actorKind === "participant";
            const actorLabel = isParticipant
              ? `행동 주체 · ${choice.actor}`
              : institution.name === choice.actor
                ? choice.actor
                : `${institution.name} · ${choice.actor}`;
            return (
              <button
                key={choice.id}
                type="button"
                className={`action-card ${isParticipant ? "actor-participant" : `institution-${choice.institutionId}`} ${selected ? "selected" : ""} ${attempted ? "needs-review" : ""}`}
                onClick={() => onSelectAction(choice.id)}
                aria-pressed={selected}
                aria-label={`${actorLabel}. ${choice.text}`}
                aria-describedby={attempted ? attemptedFeedbackId : undefined}
              >
                <span className="action-mark" aria-hidden="true">{isParticipant ? "당" : institution.mark}</span>
                <span className="action-body">
                  <span className="actor-line">{actorLabel}</span>
                  <strong>{choice.text}</strong>
                  {selected && <span className="choice-status" aria-hidden="true">✓ 선택됨</span>}
                  {attempted && (
                    <span className="choice-feedback" id={attemptedFeedbackId}>
                      <span className="choice-feedback-label">다시 생각해요</span>
                      <span>{feedback}</span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`feedback-area ${selectedTransition && feedback ? "is-ready" : ""}`}
        aria-live="polite"
      >
        {selectedTransition && feedback && <p>{feedback}</p>}
        {attemptedActionId && feedback && (
          <span className="screen-reader-only">다시 생각해요. {feedback}</span>
        )}
      </div>

      {prediction && (
        <fieldset className="prediction-panel">
          <legend>{prediction.question}</legend>
          <div className="prediction-options">
            {prediction.options.map((option) => (
              <label key={option.id}>
                <input
                  type="radio"
                  name="prediction"
                  value={option.id}
                  checked={predictionChoice === option.id}
                  onChange={() => onSelectPrediction(option.id)}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
          {predictionChoice && (
            <p className="prediction-explanation">
              {predictionChoice === prediction.correctId ? "맞게 예상했어요. " : "실제 효과를 확인해 볼게요. "}
              {prediction.explanation}
            </p>
          )}
        </fieldset>
      )}

      {selectedTransition && (
        <aside className="transition-preview">
          <div>
            <p>이 기관이 할 수 있는 일</p>
            <strong>{selectedTransition.effectText}</strong>
          </div>
          <div>
            <p>이 기관이 여기서 하지 않는 일</p>
            <strong>{selectedTransition.limitText}</strong>
          </div>
        </aside>
      )}

      <div className="board-footer">
        <p id="continue-hint" className={canApply ? "ready-hint" : ""} aria-live="polite">
          {continueHint}
        </p>
        <div className="board-footer-actions">
          {progress.history.length > 0 && (
            <button className="secondary-button" type="button" onClick={onUndo}>
              직전 단계로 돌아가기
            </button>
          )}
          <button
            className="primary-button"
            type="button"
            disabled={!canApply}
            onClick={onApply}
            aria-describedby="continue-hint"
          >
            선택한 행동으로 진행하기
          </button>
        </div>
      </div>
    </section>
  );
}
