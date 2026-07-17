"use client";

import { institutionCopy } from "./content.ts";
import type { InstitutionId } from "./types.ts";

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="start-screen" aria-labelledby="start-title">
      <div className="start-copy">
        <p className="fictional-label">학습용 가상 사건</p>
        <h1 id="start-title">한 기관이 모든 일을 맡지 않는 이유를 찾아봐요.</h1>
        <p className="start-lead">
          국가기관의 역할을 골라 사건이 어떻게 달라지는지 살펴보고,
          국회·행정부·법원이 서로 다른 일을 맡는 까닭을 정리해요.
        </p>
        <button className="primary-button" type="button" onClick={onStart}>
          시작하기
        </button>
        <p className="privacy-note">
          이름이나 학번은 쓰지 않아요. 새로고침하면 지금까지 한 내용이 사라져요.
        </p>
      </div>
      <ol className="process-preview" aria-label="활동 순서">
        <li>
          <span>01</span>
          <div><strong>현재 상태 읽기</strong><p>지금 어떤 문서와 절차가 있는지 확인해요.</p></div>
        </li>
        <li>
          <span>02</span>
          <div><strong>기관 행동 선택</strong><p>누가 지금 행동할 수 있는지 골라요.</p></div>
        </li>
        <li>
          <span>03</span>
          <div><strong>사건 변화 확인</strong><p>선택 뒤에 사건이 어떻게 달라지는지 살펴봐요.</p></div>
        </li>
      </ol>
    </section>
  );
}

const primerOrder: InstitutionId[] = [
  "national-assembly",
  "executive",
  "court",
];

export function InstitutionPrimer({
  index,
  onBack,
  onNext,
}: {
  index: number;
  onBack: () => void;
  onNext: () => void;
}) {
  const institutionId = primerOrder[index];
  const item = institutionCopy[institutionId];
  const isLast = index === primerOrder.length - 1;

  return (
    <section className="primer-screen" aria-labelledby="primer-title">
      <div className="section-heading">
        <p>기관 역할 안내 · {index + 1}/3</p>
        <h1 id="primer-title">하는 일과 하지 않는 일을 함께 읽어요.</h1>
      </div>
      <div className={`primer-card institution-${institutionId}`}>
        <span className="institution-mark" aria-hidden="true">{item.mark}</span>
        <div>
          <h2>{item.name}</h2>
          <p className="role-sentence">{item.role}</p>
          <dl className="role-details">
            <div><dt>하는 일</dt><dd>{item.example}</dd></div>
            <div><dt>하지 않는 일</dt><dd>{item.limit}</dd></div>
          </dl>
        </div>
      </div>
      <div className="button-row">
        <button className="secondary-button" type="button" onClick={onBack}>
          {index === 0 ? "시작 화면으로" : "이전 기관 보기"}
        </button>
        <button className="primary-button" type="button" onClick={onNext}>
          {isLast ? "첫 사건으로 가기" : "다음 기관 보기"}
        </button>
      </div>
    </section>
  );
}
