

// 엘리먼트 취득
const $audioEl = document.querySelector("audio");
const $btn = document.querySelector("#startBtn");

// 녹음중 상태 변수
let isRecording = false;

// MediaRecorder 변수 생성
let mediaRecorder = null;

// 녹음 데이터 저장 배열
const audioArray = [];

$btn.onclick = async function (event) {
    if (!isRecording) {

        // 마이크 mediaStream 생성: Promise를 반환하므로 async/await 사용
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // MediaRecorder 생성
        mediaRecorder = new MediaRecorder(mediaStream);

        // 이벤트핸들러: 녹음 데이터 취득 처리
        mediaRecorder.ondataavailable = (event) => {
            audioArray.push(event.data); // 오디오 데이터가 취득될 때마다 배열에 담아둔다.
        }

        // 이벤트핸들러: 녹음 종료 처리 & 재생하기
        mediaRecorder.onstop = (event) => {

            // 녹음이 종료되면, 배열에 담긴 오디오 데이터(Blob)들을 합친다: 코덱도 설정해준다.
            const blob = new Blob(audioArray, { "type": "audio/ogg  codecs=opus" });
            //const blob = new Blob(audioArray, { "type": "audio/wav" });
            //const blob = new Blob(audioArray, { "type": "audio/wav; codecs=MS_PCM" });
            audioArray.splice(0); // 기존 오디오 데이터들은 모두 비워 초기화한다.

            // Blob 데이터에 접근할 수 있는 주소를 생성한다.
            const blobURL = window.URL.createObjectURL(blob);

            // audio엘리먼트로 재생한다.
            $audioEl.src = blobURL;
            $audioEl.play();

            var fData = new FormData()
            fData.append('file', blob, 'a.wav')
            fetch(`http://127.0.0.1:5000/predict`, {method:"POST", body:fData})
            .then(response => {
                if (response.ok) return response;
                else throw Error(`Server returned ${response.status}: ${response.statusText}`)
            })
            .then((response) => response.json())
            .then((data) => {
                document.querySelector("#result").innerHTML = data.result == 1 ? `경상도 사투리 입니다.` : `경상도 사투리가 아닙니다.`;
            })
            .catch(err => {
                alert(err);
            });
        }

        // 녹음 시작
        mediaRecorder.start();
        isRecording = true;

        mediaRecorder.addEventListener("dataavailable", handleVideoData);


    } else {
        // 녹음 종료
        mediaRecorder.stop();
        isRecording = false;
    }
}

const handleVideoData = (e) => {
    // blob 이벤트에서 data 추출
    const { data } = e;

    // console.log( data )

    // // 다운로드를 위해 a 태그를 만들어주고 href로 해당 data를 다운로드 받을 수 있게 url을 만듭시다
    const audioDownloadLink = document.createElement("a");
    audioDownloadLink.href = URL.createObjectURL(data);
    audioDownloadLink.download = "Audio.wav";
    document.body.appendChild(audioDownloadLink);
    audioDownloadLink.click();

    //const audioUrl = URL.createObjectURL(audioBlob);
    /*
    var fData = new FormData()
    fData.append('file', data, 'a.wav')
    //fData.append('file', audioUrl)    


    fetch(`http://127.0.0.1:5000/predict`, {method:"POST", body:fData})
        .then(response => {
            if (response.ok) return response;
            else throw Error(`Server returned ${response.status}: ${response.statusText}`)
        })
        .then(response => console.log(response.text()))
        .catch(err => {
            alert(err);
        });
    */

};

