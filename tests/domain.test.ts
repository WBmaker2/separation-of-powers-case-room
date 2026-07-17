import assert from "node:assert/strict";
import test from "node:test";

import { caseBank } from "../app/case-room/cases.ts";
import { caseGlossaries } from "../app/case-room/content.ts";
import {
  applyTransition,
  getAvailableTransitions,
  getOrderedActionChoices,
  undoLastTransition,
  validateCaseBank,
} from "../app/case-room/engine.ts";

test("사건 은행은 법률안·예산·행정처분 사건을 하나씩 제공한다", () => {
  assert.deepEqual(
    caseBank.map((item) => item.kind),
    ["bill", "budget", "administrative-disposition"],
  );
});

test("모든 전이는 정의된 상태와 공식 근거를 참조한다", () => {
  assert.deepEqual(validateCaseBank(caseBank), []);
});

test("재의 요구는 법률안 폐기가 아니라 국회 재의 대기 상태가 된다", () => {
  const billCase = caseBank[0];
  const transition = billCase.transitions.find(
    (item) => item.actionId === "president-requests-reconsideration",
  );

  assert.ok(transition);
  assert.equal(transition.toStateId, "returned-for-reconsideration");
  assert.doesNotMatch(transition.effectText, /폐기|삭제/);
});

test("재의 뒤 두 합법적 경로는 모두 점수 없이 완료된다", () => {
  const billCase = caseBank[0];
  const options = getAvailableTransitions(
    "returned-for-reconsideration",
    billCase,
  );

  assert.deepEqual(
    options.map((item) => item.toStateId).sort(),
    ["bill-closed-without-repassage", "promulgated-after-repassage"],
  );
  assert.ok(options.every((item) => item.completesCase && item.score == null));
});

test("국회 심의·확정 전에는 예산을 집행할 수 없다", () => {
  const budgetCase = caseBank[1];

  assert.equal(
    getAvailableTransitions("budget-submitted-to-assembly", budgetCase).some(
      (item) => item.actionId === "executive-runs-program",
    ),
    false,
  );
});

test("처분 취소의 다음 효과는 자동 승인이 아니라 행정기관 재처리다", () => {
  const courtCase = caseBank[2];
  const transition = courtCase.transitions.find(
    (item) => item.actionId === "agency-reprocesses-application",
  );

  assert.ok(transition);
  const progress = applyTransition(
    {
      currentStateId: "disposition-cancelled",
      history: [],
      completed: false,
    },
    transition,
  );

  assert.equal(progress.currentStateId, "returned-for-administrative-reprocessing");
  assert.doesNotMatch(transition.effectText, /자동 승인/);
});

test("헌법재판소는 세 기관 ID에 포함되지 않는다", () => {
  const ids = new Set(caseBank.flatMap((item) => item.institutions));

  assert.deepEqual([...ids].sort(), ["court", "executive", "national-assembly"]);
  assert.equal(ids.has("constitutional-court" as never), false);
});

test("3지선다 정답은 왼쪽·가운데·오른쪽에 네 번씩 배치된다", () => {
  const answerPositions = caseBank.flatMap((civicCase) =>
    civicCase.states.flatMap((state) => {
      const transitions = getAvailableTransitions(state.id, civicCase);
      if (transitions.length !== 1) return [];

      const choices = getOrderedActionChoices(state.id, civicCase);
      assert.equal(choices.length, 3);
      return [choices.findIndex((choice) => choice.lawful)];
    }),
  );

  assert.deepEqual(
    [0, 1, 2].map(
      (position) => answerPositions.filter((item) => item === position).length,
    ),
    [4, 4, 4],
  );
});

test("직전 단계로 돌아가면 상태와 기록이 함께 복원된다", () => {
  const billCase = caseBank[0];
  const transition = billCase.transitions[0];
  const progressed = applyTransition(
    { currentStateId: billCase.initialStateId, history: [], completed: false },
    transition,
  );

  assert.equal(progressed.history[0].specificActor, "정부");
  assert.deepEqual(undoLastTransition(progressed), {
    currentStateId: billCase.initialStateId,
    history: [],
    completed: false,
  });
});

test("소송을 내는 가상 단체는 법원 소속이 아닌 행동 주체로 표시된다", () => {
  const courtCase = caseBank[2];
  const transition = courtCase.transitions.find(
    (item) => item.actionId === "group-files-lawsuit",
  );
  const choice = getOrderedActionChoices(
    "application-denied-by-disposition",
    courtCase,
  ).find((item) => item.id === "group-files-lawsuit");

  assert.equal(transition?.actorKind, "participant");
  assert.equal(choice?.actorKind, "participant");
  assert.equal(choice?.actor, "영향을 받은 가상 단체");
});

test("모든 사건에 학생용 어려운 말 풀이가 있다", () => {
  for (const civicCase of caseBank) {
    assert.ok(caseGlossaries[civicCase.id]?.length >= 3);
  }
});
