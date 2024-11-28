export const useGetUrl = () => {
  const getCoverUrl = (cover: string | File) => {
    if (typeof cover === "string") return cover;
    return typeof window !== "undefined" ? URL.createObjectURL(cover) : "";
  };
  return { getCoverUrl };
};
