document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("camera");
  const photoContainer = document.getElementById("photo-container");

  window.capture = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1)
      );

      // Request access to the file system
      const fileHandle = await window.showSaveFilePicker({
        types: [
          {
            description: "PNG Files",
            accept: {
              "image/png": [".png"],
            },
          },
        ],
      });

      // Create a WritableStream from the file handle
      const writableStream = await fileHandle.createWritable();

      // Write the image data to the file
      await writableStream.write(blob);

      // Close the stream to save the file
      await writableStream.close();

      // Display success message
      alert("Image saved successfully!");

      // Display the saved photo in the photo container
      const savedImg = document.createElement("img");
      savedImg.src = URL.createObjectURL(blob);

      const card = document.createElement("div");
      card.className = "card";
      card.appendChild(savedImg);

      photoContainer.appendChild(card);
    } catch (error) {
      console.error("Error saving the image:", error);
    }
  };

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error("Error accessing the camera:", error);
    });
});
