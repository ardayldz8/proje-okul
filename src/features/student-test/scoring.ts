type QuestionAnswer = {
  questionId: string;
  correctOption: string;
  selectedOption?: string | null;
};

export function calculateTestResult(answers: QuestionAnswer[]) {
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;

  const answerResults = answers.map((answer) => {
    const selectedOption = answer.selectedOption || null;
    const isCorrect = selectedOption === answer.correctOption;

    if (!selectedOption) {
      emptyCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }

    return {
      questionId: answer.questionId,
      selectedOption,
      isCorrect,
    };
  });

  const totalQuestionCount = answers.length;
  const score = totalQuestionCount === 0 ? 0 : (correctCount / totalQuestionCount) * 100;

  return {
    correctCount,
    wrongCount,
    emptyCount,
    score,
    answerResults,
  };
}
