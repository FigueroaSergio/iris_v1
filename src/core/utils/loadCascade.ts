import cv from "@techstark/opencv-js";

export async function loadCascade(
  cvFilePath: string,
  url: string,
  callback: () => void
) {
  return fetch(url)
    .then(
      (response) => response.arrayBuffer() // Similar to responseType 'arraybuffer'
    )
    .then((arrayBuffer) => {
      const data = new Uint8Array(arrayBuffer);

      cv.FS_createDataFile("/", cvFilePath, data, true, false, false);
      callback(); // Call the callback after the data is processed
    });
}
