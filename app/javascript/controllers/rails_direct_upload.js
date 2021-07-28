import { DirectUpload } from "@rails/activestorage"

export default class RailsDirectUpload {

  construction() {
  }
  
  uploadFile(file, url) {
    // your form needs the file_field direct_upload: true, which
    //  provides data-direct-upload-url


    const uploader = new DirectUpload(file, url) 
    uploader.create((error, blob) => {
      if (error) {
        console.log(error)
        // Handle the error
      } else {
        console.log(blob)
        // Add an appropriately-named hidden input to the form with a
        //  value of blob.signed_id so that the blob ids will be
        //  transmitted in the normal upload flow
        const hiddenField = document.createElement('input')
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("value", blob.signed_id);
        hiddenField.name = "message[media]"
        document.querySelector('form').appendChild(hiddenField)
      }
    })
  }
}