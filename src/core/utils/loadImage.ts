import { ChangeEvent } from "react";

export const loadImageFile = async (
  e: ChangeEvent<HTMLInputElement>
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (reader: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = function () {
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error("Error loading image"));
      };
      if (!reader.target) {
        return reject();
      }
      if (!reader.target.result) {
        return reject();
      }
      img.src = reader.target.result as string;
    };
    if (!e.target) {
      return reject(new Error("No file selected"));
    }
    const input = e.target as HTMLInputElement; // Type assertion
    if (!input.files) {
      return reject(new Error("No file selected"));
    }

    if (input.files.length > 0) {
      // Read the file as a Data URL
      reader.readAsDataURL(input.files[0]);
    } else {
      reject(new Error("No file selected"));
    }
  });
};
