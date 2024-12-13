export const useAnimation = () => {
  const beforeEnter = (el: Element) => {
    (el as HTMLElement).style.transform = "translateY(100%)";
    (el as HTMLElement).style.transition = "transform 0.5s ease";
  };

  const enter = (el: Element) => {
    (el as HTMLElement).offsetHeight;
    (el as HTMLElement).style.transform = "translateY(0)";
  };

  const leave = (el: Element) => {
    (el as HTMLElement).style.transform = "translateY(100%)";
  };

  return {
    beforeEnter,
    enter,
    leave,
  };
};
