
let userData = [
      "Women",
      "Accessories",
      "Men",
      "None"
]

userData.forEach(popList);

 function popList(item) {
  var o = document.createElement("option");
  o.value = item;
  document.getElementById("preference").appendChild(o).textContent = item;
} 