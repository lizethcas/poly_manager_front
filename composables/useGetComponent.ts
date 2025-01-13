import OrganisimLayoutBlock from "~/components/organisim/blocks/LayoutBlock.vue";
import VideoBlock from "~/components/organisim/VideoBlock.vue";
import TextBlock from "~/components/organisim/blocks/TextBlock.vue";
import TextBlockModules from "~/components/organisim/TextBlockModules.vue";
import MultimediaBlock from "~/components/organisim/blocks/MultimediaBlock.vue";
import KnowledgeCheckBlock from "~/components/organisim/KnowledgeCheckBlock.vue";
import GalleryLayout from "~/components/organisim/blocks/GalleryLayout.vue";
import IaChatGPT from "~/components/organisim/blocks/IaChatGPT.vue";

export const useGetComponent = () => {
  const getCurrentComponent = (label: string) => {
    console.log("Component requested:", label);
    if (!label) return null;

    switch (label.toLowerCase()) {
      case "layout block":
        return OrganisimLayoutBlock;
      case "video layout":
        return VideoBlock;
      case "text block":
        return TextBlock;
      case "info block":
        return TextBlockModules;
      case "multimedia block":
        return MultimediaBlock;
      case "knowledge check":
        return KnowledgeCheckBlock;
      case "gallery layout":
        return GalleryLayout;
      case "ai chat":
        return IaChatGPT;
      default:
        console.warn(`No component found for label: ${label}`);
        return null;
    }
  };
  return { getCurrentComponent };
};
