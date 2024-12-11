export function useDescription() {
  const getTaskDescription = (title: string): string => {
    switch (title) {
      case "Drag the words":
        return "[ ] - to add a gap";
      case "Fill in the gaps":
        return "[ ] - to add a gap, / - to add options";

      default:
        return "";
    }
  };
  return { getTaskDescription };
}
