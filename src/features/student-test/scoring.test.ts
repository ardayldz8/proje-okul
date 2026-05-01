import { describe, expect, it } from "vitest";

import { calculateTestResult } from "@/features/student-test/scoring";

describe("calculateTestResult", () => {
  it("dogru, yanlis, bos ve puani hesaplar", () => {
    const result = calculateTestResult([
      { questionId: "q1", correctOption: "A", selectedOption: "A" },
      { questionId: "q2", correctOption: "B", selectedOption: "C" },
      { questionId: "q3", correctOption: "D", selectedOption: null },
    ]);

    expect(result.correctCount).toBe(1);
    expect(result.wrongCount).toBe(1);
    expect(result.emptyCount).toBe(1);
    expect(result.score).toBeCloseTo(33.3333);
    expect(result.answerResults).toEqual([
      { questionId: "q1", selectedOption: "A", isCorrect: true },
      { questionId: "q2", selectedOption: "C", isCorrect: false },
      { questionId: "q3", selectedOption: null, isCorrect: false },
    ]);
  });

  it("soru yoksa puani 0 dondurur", () => {
    const result = calculateTestResult([]);

    expect(result.correctCount).toBe(0);
    expect(result.wrongCount).toBe(0);
    expect(result.emptyCount).toBe(0);
    expect(result.score).toBe(0);
    expect(result.answerResults).toEqual([]);
  });
});
