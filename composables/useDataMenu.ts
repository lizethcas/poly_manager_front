import  {
  interactiveTaskOptions,
  multimediaBlockOptions,
  textBlockOptions,
  galletyLayoutOptions,
  chatGptTaskOptions,
} from "~/data/interactiveTask";

export const useDataMenu = () => {
  const getDataMenu = (label: string) => {
    if (label === "Knowledge check" || label === "Layout block") {
      return interactiveTaskOptions;
    }
    if (label === "Multimedia block") {
      return multimediaBlockOptions;
    }
    if (label === "Text block") {
      return textBlockOptions;
    }
    if (label === "Video layout") {
      const video = [multimediaBlockOptions[0]];
      return video;
    }
    if (label === "Info block" || label === "info_block") {
      const info = [textBlockOptions[1]];
      return info;
    }

    if (label === "Gallery layout") {
      return galletyLayoutOptions;
    }
    if (label === "AI chat") {
      return chatGptTaskOptions;
    }
    return [];
  };

  return {
    getDataMenu,
  };
};