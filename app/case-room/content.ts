import type { InstitutionId } from "./types.ts";

export const institutionCopy: Record<
  InstitutionId,
  {
    name: string;
    mark: string;
    role: string;
    example: string;
    limit: string;
  }
> = {
  "national-assembly": {
    name: "국회",
    mark: "국",
    role: "법률안을 함께 살펴 결정하고, 국가 예산안을 확인해 확정해요.",
    example: "법으로 정할 내용을 함께 살펴보고 결정해요.",
    limit: "행정 사업을 직접 운영하거나 개인 사건을 판결하지 않아요.",
  },
  executive: {
    name: "행정부",
    mark: "행",
    role: "정해진 법과 예산에 따라 나라의 일을 실제로 해요.",
    example: "정부는 법률안과 예산안을 만들어 국회에 낼 수 있어요.",
    limit: "법률안과 국가 예산을 혼자 최종 확정하지 않아요.",
  },
  court: {
    name: "법원",
    mark: "법",
    role: "구체적인 다툼을 다른 기관의 지시 없이 법에 따라 재판해요.",
    example: "행정기관의 결정이 법에 맞는지 재판으로 살펴요.",
    limit: "정책을 직접 만들거나 집행하지 않아요.",
  },
};

export const changelog = [
  {
    date: "2026. 9. 7.",
    title: "단계 안내와 법률 용어 풀이 개선",
    detail:
      "단계가 바뀔 때 현재 내용을 바로 읽도록 돕고, 선택 결과를 발견하기 쉽게 했습니다. 참여자와 기관을 구분하는 안내, 핵심 법률 용어 풀이, 자기 말로 정리하는 질문을 추가했습니다.",
  },
  {
    date: "2026. 7. 18.",
    title: "초등학생 실사용 안내 개선",
    detail:
      "오답 설명을 선택지 안에서 바로 보여 주고, 어려운 문장을 쉽게 바꾸며 모바일 보조 글자와 진행표 가독성을 높였습니다.",
  },
  {
    date: "2026. 7. 17.",
    title: "진행 안내와 모바일 화면 개선",
    detail:
      "안내 단계를 포함한 진행표, 선택 상태와 다음 행동 안내, 이유 찾기 개수, 자연스러운 한글 줄바꿈과 모바일 버튼 순서를 추가했습니다.",
  },
  {
    date: "2026. 7. 17.",
    title: "초등학생 사용 흐름 개선",
    detail:
      "어려운 말 도움말, 실제 행동 주체 표시, 이전 단계 이동, 더 쉬운 버튼 문구와 간결한 사건 화면을 추가했습니다.",
  },
  {
    date: "2026. 7. 17.",
    title: "선택지 정답 위치 개선",
    detail:
      "3지선다에서 정답이 한쪽에 몰리지 않도록 왼쪽·가운데·오른쪽에 고르게 배치했습니다.",
  },
  {
    date: "2026. 7. 17.",
    title: "첫 교육용 버전 구현",
    detail:
      "기관 역할 안내, 가상 사건 3개, 권력 분립 이유 정리, 키보드·모바일 접근성을 추가했습니다.",
  },
];

export const caseGlossaries: Record<
  string,
  readonly { term: string; meaning: string }[]
> = {
  "fictional-safety-sign-bill-reconsideration": [
    { term: "효력", meaning: "법률이나 결정이 실제로 영향을 미치는 힘이에요." },
    { term: "심의·의결", meaning: "내용을 살펴보고 토의한 뒤 결정하는 일이에요." },
    { term: "이송", meaning: "다음 절차를 맡을 곳으로 문서를 보내는 일이에요." },
    { term: "공포", meaning: "법이 만들어졌다는 사실을 공식으로 알리는 일이에요." },
    { term: "재의", meaning: "국회가 법률안을 다시 살펴보고 결정하는 일이에요." },
  ],
  "fictional-science-vehicle-budget": [
    { term: "편성", meaning: "어디에 얼마의 돈이 필요한지 계획을 짜는 일이에요." },
    { term: "심의·확정", meaning: "예산안을 살펴보고 나라가 쓸 예산으로 결정하는 일이에요." },
    { term: "집행", meaning: "정해진 예산으로 계획한 일을 실제로 하는 것이에요." },
  ],
  "fictional-mobile-library-administrative-disposition": [
    { term: "행정처분", meaning: "행정기관이 신청에 대해 내리는 공식 결정이에요." },
    { term: "거부처분", meaning: "신청한 일을 받아들이지 않겠다는 행정기관의 공식 결정이에요." },
    { term: "소장", meaning: "어떤 다툼을 재판해 달라고 법원에 내는 문서예요." },
    { term: "행정소송", meaning: "행정기관의 결정이 법에 맞는지 법원에 판단해 달라고 하는 재판이에요." },
    { term: "효력", meaning: "결정이나 법률이 실제로 영향을 미치는 힘이에요." },
    { term: "위법", meaning: "법에 어긋나는 상태를 뜻해요." },
    { term: "심리", meaning: "재판에 필요한 주장과 자료를 자세히 살펴보는 일이에요." },
    { term: "판결 취지", meaning: "판결이 무엇을 뜻하고 왜 그렇게 판단했는지를 말해요." },
  ],
};

export const reasonFragments = [
  {
    id: "share-power",
    title: "권한을 나누어요",
    text: "한 기관이 법 만들기·집행·재판을 모두 맡는 것을 막는 데 도움이 돼요.",
  },
  {
    id: "review",
    title: "다시 살피는 절차가 있어요",
    text: "다른 기관이 다시 살피거나, 법원이 다른 기관의 지시 없이 판단해요.",
  },
  {
    id: "protect-rights",
    title: "국민의 권리를 보호해요",
    text: "권력이 한곳에 지나치게 모이는 것을 막아 자유와 권리를 지켜요.",
  },
] as const;
