export const image2Canvas = (
  img: HTMLImageElement
): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0, img.width, img.height);
  return Promise.resolve(canvas);
};

export const canvas2Image = (
  canvas: HTMLCanvasElement
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return reject();
      }
      const newImage = new Image();
      const url = URL.createObjectURL(blob);
      newImage.onload = () => {
        // URL.revokeObjectURL(url); // Free memory when done
        resolve(newImage);
      };
      newImage.src = url;
    }, "image/png");
  });
};

export const createCanvas = () => {
  const canvas = document.createElement("canvas");
  return canvas;
};
