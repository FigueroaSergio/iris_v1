import cv from "@techstark/opencv-js";

export async function loadCascade(cvFilePath: string, url: string) {
  return fetch(url)
    .then(
      (response) => response.arrayBuffer() // Similar to responseType 'arraybuffer'
    )
    .then((arrayBuffer) => {
      const data = new Uint8Array(arrayBuffer);
      try {
        cv.FS_createDataFile("/", cvFilePath, data, true, false, false);
        return Promise.resolve();
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "FS error") {
            return Promise.resolve();
          }
        }
        throw e;
      }
    });
}
