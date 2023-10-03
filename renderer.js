// basic event listener for the demo
const element = document.getElementById("myBtn");
element.addEventListener("click", runCommand);

// test function for on click button call back
function runCommand() {
  window.BBB_API.sendToMain("some parameters / data send from renderer");
}
