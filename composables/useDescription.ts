interface Extra {
  subtitle: string;
  description: string;
}


export function useDescription() {
  const getTaskDescription = (
    title: string
  ):
    | { description: string[]; instructions: string; subtitle?: string; extra?: Extra; example?: string }
    | undefined => {
    let data;
    switch (title) {
      case "Word bank":
        data = {
          description: ["[ ]"],
          instructions:
            "Add a text. Put the words and phrases [in brackets]. They will be shuffled and appear in the box. Students will need to put them into the gaps.",
          extra: {
            subtitle: "Add extra words: ",
            description: "Those words will be considered as extra. Use / to devide options ",
          },
          example: "I like [walking] in the park in the morning",
        };
        break;
      case "Fill in the gaps":
        data = {
          description: ["[ ]", "/", "/"],
          instructions:
            "Use brackets for gaps: []. Separate a hint from the correct answer by */: [a hint*/the answer]. Use multiple / for multiple correct answers: [a hint/correct answer 1/correct answer 2]. Leave the space before the first / empty for multiple correct answers without a hint: [/correct answer 1/correct answer 2].",
        };
        break;

      default:
        data = {
          description: [],
          instructions: "",
        };
    }
    return data;
  };
  return { getTaskDescription };
}
