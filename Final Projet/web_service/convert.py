m4a_file = 'C:\\Users\\pusan\\Desktop\\tmp\\a.m4a'
wav_filename = r"data.wav"
from pydub import AudioSegment
track = AudioSegment.from_file(m4a_file,  format= 'm4a')
file_handle = track.export(wav_filename, format='wav')