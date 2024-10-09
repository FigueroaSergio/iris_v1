import os
import pandas as pd
import re
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

def create_image_dataframe(root_folder):
    data = []
    for folder_name in os.listdir(root_folder):
        folder_path = os.path.join(root_folder, folder_name)
        if not os.path.isdir(folder_path):
            continue
        for image_name in os.listdir(folder_path):
            image_path = os.path.join(folder_path, image_name)
   
            if os.path.isfile(image_path) and  image_name.lower().endswith('.jpg'):
                data.append({ 'image_name':image_name,'path': image_path, "label": root_folder.lower(), "internal_id":folder_name})
    
    df = pd.DataFrame(data)
    return df
control = create_image_dataframe('Control')
diabetes = create_image_dataframe('Diabetes')
merged_df = pd.concat([diabetes, control])

df_train, df_test = train_test_split(merged_df, test_size=0.3)



# All images will be rescaled by 1./255
train_datagen = ImageDataGenerator(rescale=1/255)

train_generator = train_datagen.flow_from_dataframe(
  df_train,
  target_size=(300, 300),
  x_col='path',
  y_col='label',
  class_mode='binary'
)

validation_datagen = ImageDataGenerator(rescale=1/255)

validation_generator = train_datagen.flow_from_dataframe(
  df_test,
  target_size=(300, 300),
  x_col='path',
  y_col='label',
  class_mode='binary'
)

model = tf.keras.Sequential([
    
  tf.keras.layers.Conv2D(16, (3,3), activation='relu', input_shape=(300, 300, 3)),
  tf.keras.layers.MaxPool2D(2, 2),
  tf.keras.layers.Conv2D(32, (3,3), activation='relu'),
  tf.keras.layers.MaxPool2D(2,2),
  tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
  tf.keras.layers.MaxPool2D(2,2),
  tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
  tf.keras.layers.MaxPool2D(2,2),
  tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
  tf.keras.layers.MaxPool2D(2,2),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(512, activation='relu'),
  tf.keras.layers.Dense(1, activation='sigmoid')
])
model.summary()
model.compile(loss='binary_crossentropy',
       optimizer='adam',
       metrics=['accuracy'])
history = model.fit(
  train_generator,
  epochs=15,
  validation_data=validation_generator
)
# better export
model.export('classifier')