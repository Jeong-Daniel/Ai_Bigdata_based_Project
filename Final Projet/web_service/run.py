from flask import Flask, render_template, request, jsonify
from predict import main
import os

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    files = request.files
    file  = files.get('file')
    # file.save('upload0.wav')

    # audio = file.stream.read()

    # with open(os.path.abspath(f'upload.wav'), 'wb') as f:
    #     #f.write(file.content)
    #     f.write(audio)

    res = main()
    print( res, {'code':1, 'result':f"{res[0][0]}" } )    
    return jsonify( {'code':1, 'result':f"{res[0][0]}" } )

if __name__ == '__main__':
    app.run(debug=True)