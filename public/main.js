
let userData = [
      "Women",
      "Accessories",
      "Men"
]

userData.forEach(popList);

 function popList(item) {
  var o = document.createElement("option");
  o.value = item;
  document.getElementById("itemsList").appendChild(o).textContent = item;
} 


function handleClickEvent(e) {  
    var userChoice = document.getElementById('itemsList').value;

    console.log("test");

    fetch('/lookup?preference=' + userChoice)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(JSON.stringify(myJson));
    });



    //document.getElementById('output').innerHTML = output;
  }