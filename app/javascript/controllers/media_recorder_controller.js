import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "recordBtn", "stopBtn", "preview" ]

  connect() {
  }

  start_recording() {
    var preview = this.previewTarget;


    function get_recording() {
      // Prefer camera resolution nearest to 1280x720.
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

        return Promise.resolve('Success')
      }
      )
      .catch(function(err) { 
        console.log(err.name + ": " + err.message); 
        return Promise.reject('error')
      });


      console.log(result);
      return result;
      }

    get_recording().then(() => {
      var options = { mimeType: "video/webm" };
      var recordedChunks = [];
      var mediaRecorder = new MediaRecorder(window.mediaStream, options);

      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();

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

      // demo: to download after 9sec
      setTimeout(event => {
        console.log("stopping");
        mediaRecorder.stop();
      }, 9000);
    }).
    catch({

    })
  }

}
