import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("교육용 사건 처리실의 시작 화면을 서버 렌더링한다", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ko"/i);
  assert.match(html, /<title>삼권분립 사건 처리실/);
  assert.match(html, /국가기관의 역할을 골라 사건이 어떻게 달라지는지/);
  assert.match(html, /이름이나 학번은 쓰지 않아요/);
  assert.doesNotMatch(html, /사건 상태가|받지 않으며/);
  assert.match(html, /가상 사건/);
  assert.match(html, /시작하기/);
  assert.match(html, /업데이트 내역/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("학생 안전 범위와 구조 규칙을 지킨다", async () => {
  const [page, layout, caseRoom, caseBoard, introScreens, summaryScreens, content, files] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-room/CaseRoom.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-room/CaseBoard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-room/IntroScreens.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-room/SummaryScreens.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-room/content.ts", import.meta.url), "utf8"),
    readdir(new URL("../app/case-room/", import.meta.url)),
  ]);

  assert.match(page, /CaseRoom/);
  assert.match(layout, /lang="ko"/);
  assert.match(layout, /icons:[\s\S]*favicon\.svg/);
  assert.ok(files.includes("cases.ts"));
  assert.ok(files.includes("engine.ts"));
  assert.match(caseRoom, /aria-current=\{isCurrent \? "step"/);
  assert.match(caseRoom, /label: "안내"/);
  assert.match(caseRoom, /attemptedActionId/);
  assert.match(introScreens, /사건이 어떻게 달라지는지/);
  assert.match(caseBoard, /먼저 위에서 행동 하나를 골라 주세요/);
  assert.match(caseBoard, /✓ 선택됨/);
  assert.match(caseBoard, /choice-feedback/);
  assert.match(caseBoard, /aria-describedby=\{attempted/);
  assert.match(caseBoard, /scrollIntoView/);
  assert.match(caseBoard, /두 가지 중 하나를 골라 보세요/);
  assert.match(caseBoard, /이 행동 뒤 달라지는 점/);
  assert.match(caseRoom, /previousStageRef/);
  assert.match(caseRoom, /tabIndex = -1/);
  assert.match(content, /term: "효력"/);
  assert.match(summaryScreens, /reason-progress/);
  assert.match(summaryScreens, /세 가지 모두 맞는 설명이에요/);
  assert.match(content, /date: "2026\. 7\. 18\."/);
  assert.match(content, /진행 안내와 모바일 화면 개선/);

  const sourceFiles = await Promise.all(
    files
      .filter((file) => /\.(ts|tsx|css)$/.test(file))
      .map(async (file) => ({
        file,
        content: await readFile(new URL(`../app/case-room/${file}`, import.meta.url), "utf8"),
      })),
  );

  for (const source of sourceFiles) {
    assert.ok(
      source.content.split("\n").length < 500,
      `${source.file}은 500줄 미만이어야 합니다.`,
    );
    assert.doesNotMatch(source.content, /localStorage|sessionStorage|indexedDB/i);
  }
});
