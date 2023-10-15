// HTML
// <div id="custom_switch"></div>

document.getElementById("custom_switch").innerHTML = `
  <div class="switch_container swc_left">
    <span> Try Beta </span>
    <div class="switch_button swb_left"></div>  
  </div>
`;

document
  .querySelector(".switch_container")
  .addEventListener("click", function cb() {
    this.classList.toggle("swc_left");
    this.classList.toggle("swc_right");

    const btn = document.querySelector(".switch_button");
    btn.classList.toggle("swb_left");
    btn.classList.toggle("swb_right");

    const tc = document.querySelector(".switch_container span").textContent;
    document.querySelector(".switch_container span").textContent = tc.includes(
      "Try"
    )
      ? "Beta v2"
      : "Try Beta";
  });
