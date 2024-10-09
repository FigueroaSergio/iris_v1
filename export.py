import os

import tensorflow as tf
from tensorflow import keras

output_dir = 'keras_model'
load_model = tf.keras.models.load_model('j1.keras')
load_model.summary()
load_model.export('keras_m')
