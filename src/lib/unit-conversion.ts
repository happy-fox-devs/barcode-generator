export const convertToPixels = (value: number, unit: string): number => {
  switch (unit) {
    case "px":
      return value;
    case "in":
      return value * 96;
    case "cm":
      return value * 37.795;
    default:
      return value;
  }
};

export const convertFromPixels = (pixels: number, unit: string): number => {
  switch (unit) {
    case "px":
      return pixels;
    case "in":
      return pixels / 96;
    case "cm":
      return pixels / 37.795;
    default:
      return pixels;
  }
};
