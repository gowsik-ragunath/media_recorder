import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "cameraRecordBtn", "screenRecordBtn", "stopBtn", "preview" ]

  connect() {
  }

  start_camera_recording() {
    var preview = this.previewTarget;

    var constraints = { audio: true, video: { width: 1280, height: 720 } };

    var result = navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      window.mediaStream = mediaStream;
      var video = preview;
      console.log(video);
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    }).then(() => {
      this.record_media();
    }).catch(err => {})
  }

  start_screen_recording() {
    var preview = this.previewTarget;

    const constraints = {
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    }

    var result = navigator.mediaDevices.getDisplayMedia(constraints)
    .then(function(mediaStream) {
      window.mediaStream = mediaStream;
      var video = preview;
      console.log(video);
      video.srcObject = mediaStream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    }).then(() => {
      this.record_media();
    }).catch(err => {})
  }

  record_media() {
      var options = { mimeType: "video/webm" };
      var recordedChunks = [];
      var mediaRecorder = new MediaRecorder(window.mediaStream, options);
      mediaRecorder.start(); // create a video chunk every 15 seconds

      mediaRecorder.ondataavailable = handleDataAvailable;

      function handleDataAvailable(event) {
        console.log("data-available");
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
          console.log(recordedChunks);
          download();
        } else {
          // ...
        }
      }
      function download() {
        var blob = new Blob(recordedChunks, {
          type: "video/webm"
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "test.webm";
        a.click();
        window.URL.revokeObjectURL(url);
      }

      this.stopBtnTarget.addEventListener("click", function() {
        console.log("------")
        mediaRecorder.stop();
      })

      // demo: to download after 9sec
      setTimeout(event => {
        console.log("stopping");
        mediaRecorder.stop();
      }, 9000);
    }

}
