export const normalizeImageUrl = (imageUrl: string | undefined, baseUrl: string): string => {
  let url = imageUrl || "";
  if (url && !url.startsWith("http")) {
    url = url.replace(/^\.\.\//, "").replace(/^kepek\//, "");
    url = `${baseUrl}/kepek/${url}`;
  }
  return url;
};
