import { caseGlossaries } from "./content.ts";

export function CaseGlossary({
  caseId,
  compact = false,
}: {
  caseId: string;
  compact?: boolean;
}) {
  const terms = caseGlossaries[caseId] ?? [];
  if (terms.length === 0) return null;

  return (
    <details className={`term-help ${compact ? "compact" : ""}`}>
      <summary>어려운 말 쉽게 보기</summary>
      <dl className="term-help-list">
        {terms.map((item) => (
          <div key={item.term}>
            <dt>{item.term}</dt>
            <dd>{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
