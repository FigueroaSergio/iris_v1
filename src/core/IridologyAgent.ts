import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { IrisAgent } from "./model/IrisModel";
import { canvas2Buffer, image2Canvas } from "./utils/canvas";

export class IrideAgent implements IrisAgent {
  model: GenerativeModel;
  genAI: GoogleGenerativeAI;

  constructor() {
    console.log(import.meta.env.VITE_GEMINI_API_KEY);

    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  load(): Promise<void> {
    return Promise.resolve();
  }

  onReady(cb: () => void): void {
    cb();
  }
  private async fileToGenerativePart(img: HTMLImageElement) {
    const canvas = await image2Canvas(img);
    const buffer = await canvas2Buffer(canvas);

    return {
      inlineData: {
        data: buffer.split("data:image/png;base64,")[1],
        mimeType: "image/png",
      },
    };
  }

  async infer(img: HTMLImageElement) {
    const prompt =
      "Analizza questa immagine dell'occhio e realizza un report .";
    const file = await this.fileToGenerativePart(img);
    const result = await this.model.generateContent([file, prompt]);
    return { text: result.response.text() };
  }
}
