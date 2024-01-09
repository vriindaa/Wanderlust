let dropdown = document.getElementById("dropdown");
console.log(dropdown);
let previous = dropdown.getAttribute("data-previous-value");

for (let i = 0; i < dropdown.options.length; i++) {
  if (dropdown.options[i].value === previous) {
            dropdown.options[i].selected = true;
            break;
  }
}