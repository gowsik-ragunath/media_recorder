import { Controller } from "stimulus"

import RailsDirectUpload from './rails_direct_upload'

export default class extends Controller {
  static targets = [ "cameraRecordBtn", "screenRecordBtn", "stopBtn", "preview", "media" ]

  connect() {
  }

  start_camera_recording() {
    var preview = this.previewTarget;

    var constraints = { 
      audio: true, 
      video: { 
        width: 1280, 
        height: 720 
      } 
    };

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
      var preview = this.previewTarget;
      var blob, url;
      url = this.mediaTarget.dataset.directUploadUrl;

      
      var mediaRecorder = new MediaRecorder(window.mediaStream, options);
      mediaRecorder.start(); // create a video chunk every 15 seconds

      mediaRecorder.ondataavailable = handleDataAvailable;

      function handleDataAvailable(event) {
        if (event.data.size > 0) { 
          recordedChunks.push(event.data); // push the recoder chunk to final the chunk array
          
          blob = new Blob(recordedChunks, { type: "video/webm" }) // convert recorder chunk to a blob

          blob.lastModifiedDate = new Date();
          blob.name = "recording.webm"

          var initialize_upload = new RailsDirectUpload();
          initialize_upload.uploadFile(blob, url);
        }
      }

      this.stopBtnTarget.addEventListener("click", function() {
        mediaRecorder.stop();
        if(preview) preview.stop();
      })
    }

}
