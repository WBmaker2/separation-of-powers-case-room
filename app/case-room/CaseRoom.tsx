"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "./AppHeader.tsx";
import { CaseBoard } from "./CaseBoard.tsx";
import { CaseGlossary } from "./CaseGlossary.tsx";
import { caseBank } from "./cases.ts";
import { changelog } from "./content.ts";
import { applyTransition, getAvailableTransitions, undoLastTransition } from "./engine.ts";
import { InfoDialog } from "./InfoDialog.tsx";
import { InstitutionPrimer, StartScreen } from "./IntroScreens.tsx";
import { legalSources } from "./legal-sources.ts";
import {
  CaseSummary,
  ConstitutionalCourtNote,
  ReasoningScreen,
  SessionSummary,
} from "./SummaryScreens.tsx";
import type { CaseProgress, CaseTransition } from "./types.ts";
import "./case-room-base.css";
import "./case-room-board.css";
import "./case-room-summary.css";
import "./case-room-responsive.css";

type Phase =
  | "start"
  | "primer"
  | "case-intro"
  | "case-board"
  | "case-summary"
  | "constitutional-note"
  | "reasoning"
  | "session-summary";

function createInitialProgress(): CaseProgress[] {
  return caseBank.map((civicCase) => ({
    currentStateId: civicCase.initialStateId,
    history: [],
    completed: false,
  }));
}

export function CaseRoom() {
  const [phase, setPhase] = useState<Phase>("start");
  const [primerIndex, setPrimerIndex] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);
  const [progresses, setProgresses] = useState<CaseProgress[]>(createInitialProgress);
  const [selectedTransition, setSelectedTransition] = useState<CaseTransition | null>(null);
  const [attemptedActionId, setAttemptedActionId] = useState<string | null>(null);
  const [predictionChoice, setPredictionChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [reasonIds, setReasonIds] = useState<string[]>([]);
  const [dialog, setDialog] = useState<"sources" | "changelog" | null>(null);
  const previousStageRef = useRef<string | null>(null);

  const civicCase = caseBank[caseIndex];
  const progress = progresses[caseIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [phase, caseIndex, primerIndex, progress.currentStateId]);

  useEffect(() => {
    const stageKey = `${phase}:${caseIndex}:${primerIndex}:${progress.currentStateId}`;
    if (previousStageRef.current === null) {
      previousStageRef.current = stageKey;
      return;
    }
    if (previousStageRef.current === stageKey) return;
    previousStageRef.current = stageKey;
    const heading = phase === "case-board"
      ? document.getElementById("current-state-title")
      : document.querySelector<HTMLElement>("main h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus();
  }, [phase, caseIndex, primerIndex, progress.currentStateId]);

  const phaseLabel = useMemo(() => {
    if (phase === "start") return "가상 사건으로 배우는 국가기관의 역할";
    if (phase === "primer") return "기관 역할 안내";
    if (phase === "constitutional-note") return "법원과 헌법재판소 구분";
    if (phase === "reasoning" || phase === "session-summary") return "권력 분립 이유 정리";
    return `가상 사건 ${caseIndex + 1} · ${civicCase.shortTitle}`;
  }, [phase, caseIndex, civicCase.shortTitle]);

  const currentProgressStep = phase === "primer"
    ? "primer"
    : phase === "constitutional-note" || phase === "reasoning" || phase === "session-summary"
      ? "reasoning"
      : `case-${caseIndex}`;

  const progressSteps = [
    { id: "primer", label: "안내", complete: currentProgressStep !== "primer" },
    ...caseBank.map((item, index) => ({
      id: `case-${index}`,
      label: `사건 ${index + 1}`,
      complete: progresses[index].completed && currentProgressStep !== `case-${index}`,
    })),
    { id: "reasoning", label: "정리", complete: phase === "session-summary" },
  ];

  function clearSelection() {
    setSelectedTransition(null);
    setAttemptedActionId(null);
    setPredictionChoice(null);
    setFeedback("");
  }

  function handleAction(actionId: string) {
    const transition = getAvailableTransitions(progress.currentStateId, civicCase).find(
      (item) => item.actionId === actionId,
    );

    if (transition) {
      setSelectedTransition(transition);
      setAttemptedActionId(null);
      setPredictionChoice(null);
      setFeedback(
        transition.prediction
          ? "좋아요. 아래에서 이 행동의 결과를 하나 예상해 보세요."
          : "좋아요. 아래에서 이 행동의 결과와 주의할 점을 읽어 보세요.",
      );
      return;
    }

    const misconception = civicCase.misconceptions.find(
      (item) => item.id === actionId && item.stateId === progress.currentStateId,
    );
    setSelectedTransition(null);
    setAttemptedActionId(actionId);
    setPredictionChoice(null);
    setFeedback(misconception?.feedback ?? "이번 사건에서는 다루지 않는 절차예요.");
  }

  function handleApply() {
    if (!selectedTransition) return;

    const nextProgress = applyTransition(progress, selectedTransition);
    setProgresses((items) =>
      items.map((item, index) => (index === caseIndex ? nextProgress : item)),
    );
    clearSelection();
    if (nextProgress.completed) setPhase("case-summary");
  }

  function handleUndoCaseStep() {
    if (progress.history.length === 0) return;

    setProgresses((items) =>
      items.map((item, index) =>
        index === caseIndex ? undoLastTransition(item) : item,
      ),
    );
    setPhase("case-board");
    clearSelection();
  }

  function handleNextCase() {
    if (caseIndex === caseBank.length - 1) {
      setPhase("constitutional-note");
      return;
    }
    setCaseIndex((index) => index + 1);
    setPhase("case-intro");
    clearSelection();
  }

  function handleReset() {
    setPhase("start");
    setPrimerIndex(0);
    setCaseIndex(0);
    setProgresses(createInitialProgress());
    setReasonIds([]);
    clearSelection();
  }

  return (
    <div className="case-room-app">
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <AppHeader
        phaseLabel={phaseLabel}
        onOpenSources={() => setDialog("sources")}
        onOpenChangelog={() => setDialog("changelog")}
      />

      <main id="main-content" className="main-shell">
        {phase === "start" && <StartScreen onStart={() => setPhase("primer")} />}
        {phase === "primer" && (
          <InstitutionPrimer
            index={primerIndex}
            onBack={() => {
              if (primerIndex > 0) setPrimerIndex((index) => index - 1);
              else setPhase("start");
            }}
            onNext={() => {
              if (primerIndex < 2) setPrimerIndex((index) => index + 1);
              else setPhase("case-intro");
            }}
          />
        )}
        {phase === "case-intro" && (
          <section className="case-intro" aria-labelledby="case-intro-title">
            <p>가상 사건 {caseIndex + 1}/3 · {civicCase.shortTitle}</p>
            <h1 id="case-intro-title">{civicCase.title}</h1>
            <p className="case-description">{civicCase.description}</p>
            <div className="learning-focus">
              <strong>이번 사건에서 살펴볼 점</strong>
              <p>{civicCase.learningFocus}</p>
            </div>
            <CaseGlossary caseId={civicCase.id} />
            <div className="fictional-notice">
              <span aria-hidden="true">!</span>
              <p>실제로 일어난 일이 아니라 공부를 위해 만든 사건이에요. 어떤 생각이 맞는지, 어느 기관이 이겼는지를 묻지 않아요.</p>
            </div>
            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setPrimerIndex(0);
                  setPhase("primer");
                }}
              >
                기관 안내 다시 보기
              </button>
              <button className="primary-button" type="button" onClick={() => setPhase("case-board")}>
                현재 상태 확인하기
              </button>
            </div>
          </section>
        )}
        {phase === "case-board" && (
          <CaseBoard
            civicCase={civicCase}
            caseNumber={caseIndex + 1}
            progress={progress}
            selectedTransition={selectedTransition}
            attemptedActionId={attemptedActionId}
            predictionChoice={predictionChoice}
            feedback={feedback}
            onSelectAction={handleAction}
            onSelectPrediction={setPredictionChoice}
            onApply={handleApply}
            onUndo={handleUndoCaseStep}
          />
        )}
        {phase === "case-summary" && (
          <CaseSummary
            civicCase={civicCase}
            progress={progress}
            isLast={caseIndex === caseBank.length - 1}
            onReview={handleUndoCaseStep}
            onNext={handleNextCase}
          />
        )}
        {phase === "constitutional-note" && (
          <ConstitutionalCourtNote onNext={() => setPhase("reasoning")} />
        )}
        {phase === "reasoning" && (
          <ReasoningScreen
            selected={reasonIds}
            onToggle={(id) =>
              setReasonIds((ids) =>
                ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
              )
            }
            onComplete={() => setPhase("session-summary")}
          />
        )}
        {phase === "session-summary" && <SessionSummary onReset={handleReset} />}
      </main>

      {phase !== "start" && (
        <nav className="progress-nav" aria-label="학습 진행">
          {progressSteps.map((step) => {
            const isCurrent = step.id === currentProgressStep;
            return (
              <span
                key={step.id}
                className={isCurrent ? "current" : step.complete ? "done" : ""}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${step.label}${isCurrent ? " · 현재 단계" : step.complete ? " · 완료" : ""}`}
              >
                {step.complete && <span className="step-check" aria-hidden="true">✓</span>}
                {step.label}
              </span>
            );
          })}
        </nav>
      )}

      <InfoDialog open={dialog === "changelog"} title="업데이트 내역" onClose={() => setDialog(null)}>
        <div className="changelog-list">
          {changelog.map((entry) => (
            <article key={`${entry.date}-${entry.title}`}>
              <time>{entry.date}</time><div><h3>{entry.title}</h3><p>{entry.detail}</p></div>
            </article>
          ))}
        </div>
      </InfoDialog>

      <InfoDialog open={dialog === "sources"} title="공식 근거와 검수 정보" onClose={() => setDialog(null)}>
        <p className="source-intro">
          헌법과 공식 기관 안내를 2026년 7월 17일에 확인해 학생용 문장으로 바꾸었습니다.
          실제 사건의 법률 판단에는 사용할 수 없습니다.
        </p>
        <ul className="source-list">
          {Object.values(legalSources).map((source) => (
            <li key={source.label}>
              <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
              <p>{source.summary}</p>
            </li>
          ))}
        </ul>
      </InfoDialog>
    </div>
  );
}
