"use client";

import { institutionCopy, reasonFragments } from "./content.ts";
import type { CaseProgress, CivicCase } from "./types.ts";

export function CaseSummary({
  civicCase,
  progress,
  isLast,
  onReview,
  onNext,
}: {
  civicCase: CivicCase;
  progress: CaseProgress;
  isLast: boolean;
  onReview: () => void;
  onNext: () => void;
}) {
  return (
    <section className="summary-screen" aria-labelledby="case-summary-title">
      <p className="completion-label">사건 처리 기록 완성</p>
      <h1 id="case-summary-title">{civicCase.title}</h1>
      <p className="summary-lead">{civicCase.learningFocus}</p>
      <ol className="receipt-list">
        {progress.history.map((record, index) => {
          return (
            <li key={record.transitionId}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><strong>{record.actionText}</strong><p>{record.specificActor} · {record.relationLabel}</p></div>
            </li>
          );
        })}
      </ol>
      <div className="no-score-note">
        <strong>점수 없이 각 기관의 역할을 확인해요.</strong>
        <p>누가 이겼는지가 아니라 어느 기관이 무엇을 하고, 무엇을 하지 않는지 살펴봤어요.</p>
      </div>
      <div className="button-row">
        <button className="secondary-button" type="button" onClick={onReview}>
          마지막 선택 다시 보기
        </button>
        <button className="primary-button" type="button" onClick={onNext}>
          {isLast ? "법원과 헌법재판소 구분하기" : "다음 가상 사건 열기"}
        </button>
      </div>
    </section>
  );
}

export function ConstitutionalCourtNote({ onNext }: { onNext: () => void }) {
  return (
    <section className="constitutional-note" aria-labelledby="constitutional-title">
      <div className="section-heading">
        <p>꼭 구분해요</p>
        <h1 id="constitutional-title">법원과 헌법재판소는 서로 다른 기관이에요.</h1>
      </div>
      <div className="institution-compare">
        <article>
          <span className="institution-mark">법</span>
          <h2>법원</h2>
          <p>사람이나 단체의 다툼, 행정기관의 결정이 법에 맞는지를 재판해요.</p>
        </article>
        <div className="not-equal" aria-label="서로 같은 기관이 아님">≠</div>
        <article>
          <span className="institution-mark constitutional-mark">헌</span>
          <h2>헌법재판소</h2>
          <p>법원이 “이 법이 헌법에 맞는지 살펴봐 주세요”라고 요청하면, 법률이 헌법에 맞는지 판단해요.</p>
        </article>
      </div>
      <p className="boundary-note">
        이번 앱은 법률 자체가 아니라 행정기관의 결정이 법에 맞는지를 살펴본 가상 사건이에요.
      </p>
      <button className="primary-button" type="button" onClick={onNext}>
        권력 분립 이유 정리하기
      </button>
    </section>
  );
}

export function ReasoningScreen({
  selected,
  onToggle,
  onComplete,
}: {
  selected: readonly string[];
  onToggle: (id: string) => void;
  onComplete: () => void;
}) {
  const complete = selected.length === reasonFragments.length;
  const progressMessage = complete
    ? "세 가지 이유를 모두 찾았어요."
    : `${reasonFragments.length - selected.length}가지를 더 선택해 보세요.`;
  return (
    <section className="reasoning-screen" aria-labelledby="reasoning-title">
      <div className="section-heading">
        <p>이유 정리</p>
        <h1 id="reasoning-title">세 사건에서 찾은 까닭을 모두 선택해요.</h1>
        <p className="reasoning-help">세 가지 모두 맞는 설명이에요. 하나씩 눌러 확인해요.</p>
      </div>
      <div className="reason-map" aria-label="권력 분립 이유 지도">
        <div><span>법률안</span><strong>정부 제출 → 국회 의결 → 대통령 재의 요구 → 국회 재의</strong></div>
        <div><span>예산</span><strong>정부 편성·제출 → 국회 심의·확정 → 행정부 집행</strong></div>
        <div><span>행정처분</span><strong>행정기관 처분 → 법원 재판 → 행정기관 재처리</strong></div>
      </div>
      <div className={`reason-progress ${complete ? "complete" : ""}`} id="reason-progress" aria-live="polite">
        <strong>{selected.length}/{reasonFragments.length}</strong>
        <span>{progressMessage}</span>
      </div>
      <div className="reason-choices">
        {reasonFragments.map((fragment) => {
          const isSelected = selected.includes(fragment.id);
          return (
            <button
              key={fragment.id}
              type="button"
              className={isSelected ? "selected" : ""}
              aria-pressed={isSelected}
              onClick={() => onToggle(fragment.id)}
            >
              <span aria-hidden="true">{isSelected ? "✓" : "+"}</span>
              <strong>{fragment.title}</strong>
              <p>{fragment.text}</p>
            </button>
          );
        })}
      </div>
      <button
        className="primary-button"
        type="button"
        disabled={!complete}
        onClick={onComplete}
        aria-describedby="reason-progress"
      >
        최종 처리 기록 보기
      </button>
    </section>
  );
}

export function SessionSummary({ onReset }: { onReset: () => void }) {
  return (
    <section className="session-summary" aria-labelledby="session-summary-title">
      <p className="completion-label">오늘의 사건 처리 완료</p>
      <h1 id="session-summary-title">권력을 나누면 서로 다시 살필 수 있어요.</h1>
      <p className="summary-lead">
        한 기관이 법을 만들고, 집행하고, 다툼까지 모두 결정하지 않도록 권한을 나누어요.
        이는 기관끼리 이기기 위한 것이 아니라 국민의 자유와 권리를 보호하는 데 중요한 까닭이에요.
      </p>
      <div className="final-role-list">
        {Object.entries(institutionCopy).map(([id, item]) => (
          <article key={id} className={`institution-${id}`}>
            <span className="institution-mark">{item.mark}</span>
            <div><h2>{item.name}</h2><p>{item.role}</p><small>{item.limit}</small></div>
          </article>
        ))}
      </div>
      <button className="secondary-button" type="button" onClick={onReset}>
        처음부터 다시 하기
      </button>
    </section>
  );
}
