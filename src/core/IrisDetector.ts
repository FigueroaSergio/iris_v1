import cv from "@techstark/opencv-js";
import { IrisExtractor, ModelLoadError } from "./model/IrisModel";
import { loadCascade } from "./utils/loadCascade";
import { canvas2Image, createCanvas } from "./utils/Canvas";

export class IrisDetector implements IrisExtractor {
  model: cv.CascadeClassifier | null = null;
  cascade = "haarcascade_eye.xml";

  async load() {
    loadCascade(this.cascade, this.cascade, () => {
      this.model = new cv.CascadeClassifier();
      this.model.load(this.cascade);
    });
  }
  onReady(cb: () => void): void {
    cb();
  }

  infer(img: HTMLImageElement): Promise<HTMLImageElement | null> {
    if (!this.model) {
      throw new ModelLoadError();
    }
    const src = cv.imread(img);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const eyes = new cv.RectVector();
    const msize = new cv.Size(120, 120); // Minimum size of detected eyes
    // Detect eyes in the image
    this.model.detectMultiScale(gray, eyes, 1.1, 3, 0, msize);
    if (eyes.size() > 0) {
      // Crop the first detected eye
      const eye = eyes.get(0);
      const croppedEye = src.roi(eye);
      const result = createCanvas();
      cv.imshow(result, croppedEye);

      src.delete();
      gray.delete();
      eyes.delete();
      return canvas2Image(result);
    }
    return Promise.resolve(null);
  }
}
