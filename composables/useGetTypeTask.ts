export const useGetTypeTask = () => {
  const getType = (typeTask: string) => {
    switch (typeTask) {
      case "sorting":
        return "file";
      case "correctAnswer":
        return "checkbox";
      case "true_false":
        return "select";
      case "category" || "order":
      default:
        return undefined; // Si no coincide con ningún caso, puedes devolver undefined o algún valor por defecto
    }
  };
  return { getType };
};
