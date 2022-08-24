import pandas as pd
import numpy as np
import os
import shutil
from glob import glob
import librosa
import warnings
warnings.filterwarnings("ignore")
from keras.models import load_model
import json
import os

def load_data(paths):
    result = []
    for path in paths:
        # sr = 16000이 의미는 1초당 16000개의 데이터를 샘플링
        data, sr = librosa.load(path, sr = 16000)
        result.append(data)
    result = np.array(result) 
    # 메모리가 부족할 때는 데이터 타입을 변경 ex) np.array(data, dtype = np.float32)
    return result

def get_feature(data, sr = 16000, n_fft = 256, win_length = 200, hop_length = 160, n_mels = 64):
    mel = []
    mel_ = librosa.feature.melspectrogram(data, sr = sr, n_fft = n_fft, win_length = win_length, hop_length = hop_length, n_mels = n_mels)
    mel.append(mel_)
    mel = np.array(mel)
    mel = librosa.power_to_db(mel, ref = np.max)
    mel_mean = -67.93278
    mel_std = 17.33855
    mel = (mel - mel_mean) / mel_std
    return mel

#음성들의 길이를 맞춰줌
def set_length(data, d_mini):
    result = []
    for i in data:
        result.append(i[:d_mini])
    result = np.array(result)
    return result


def main():
    voice_path  = glob("./*.wav")
    print( voice_path )
    voice_path  = load_data(voice_path)
    voice_path  = np.array(voice_path)
    mini        = 12320
    voice_path  = set_length(voice_path, mini)
    result      = get_feature(voice_path)
    #result = result.reshape(result.shape[2], result.shape[1],  -1, 1)
    result      = result.reshape(-1, 64, 78, 1)    
    model       = load_model('voice.h5')
    # 파일 삭제
    os.remove("upload0.wav")
    return model.predict(result)

if __name__ == '__main__':
    res = main()