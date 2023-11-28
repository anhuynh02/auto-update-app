document.addEventListener("DOMContentLoaded", function () {
  window.bridge.updateMessage(updateMessage);
});

function updateMessage(event, message) {
  console.log("message logged in view");
  let messageCtn = document.getElementById("message");
  messageCtn.innerHTML = message;
}