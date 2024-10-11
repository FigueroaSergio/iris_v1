import * as tf from "@tensorflow/tfjs";

export async function rescaleCanvasImage(
  canvas: HTMLCanvasElement,
  targetSize: [number, number]
) {
  // Get the canvas context

  // Create a new image element
  const image = new Image();
  image.src = canvas.toDataURL();

  // Wait for the image to load
  await new Promise((resolve) => {
    image.onload = resolve;
  });

  // Decode the image into a TensorFlow tensor
  const imageTensor = await tf.browser.fromPixels(image);

  // Resize the tensor
  const resizedTensor = tf.image.resizeBilinear(imageTensor, targetSize);

  // Normalize the pixel values
  const rescaledTensor = resizedTensor.div(tf.scalar(255)).expandDims();

  return rescaledTensor;
}
