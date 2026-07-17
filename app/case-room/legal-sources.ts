export const legalSources = {
  "constitution-40": {
    label: "대한민국헌법 제40조",
    summary: "입법권은 국회에 속합니다.",
    href: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=61603",
  },
  "constitution-52-53": {
    label: "대한민국헌법 제52~53조",
    summary: "정부의 법률안 제출, 국회의 의결, 대통령의 공포와 재의 요구 절차를 정합니다.",
    href: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=61603",
  },
  "constitution-54": {
    label: "대한민국헌법 제54조",
    summary: "국회는 국가의 예산안을 심의·확정하고, 정부는 예산안을 편성하여 제출합니다.",
    href: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=61603",
  },
  "constitution-66": {
    label: "대한민국헌법 제66조 제4항",
    summary: "행정권은 대통령을 수반으로 하는 정부에 속합니다.",
    href: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=61603",
  },
  "constitution-101-103": {
    label: "대한민국헌법 제101조·제103조",
    summary: "사법권은 법원에 속하며 법관은 헌법과 법률에 따라 독립하여 심판합니다.",
    href: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=61603",
  },
  "constitution-107": {
    label: "대한민국헌법 제107조",
    summary: "법률의 위헌 심판과 명령·규칙·처분의 위법 심사는 서로 다른 절차입니다.",
    href: "https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=001100000&languageType=KO&lsNm=%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD%ED%97%95%EB%B2%95&paras=1",
  },
  "supreme-court-administrative": {
    label: "대법원 행정재판 안내",
    summary: "행정재판은 행정청 처분의 위법 여부에 관한 다툼을 다룹니다.",
    href: "https://www.scourt.go.kr/judiciary/duty/administrative/index.html",
  },
} as const;

export type LegalSourceId = keyof typeof legalSources;
