function showDate() {
  document.getElementById('demo').innerHTML = Date();
}

function myFunction() {
  var elements = document.getElementsByClassName('cancer');
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = 'none';
  }
}

function light(state) {
  var image = document.getElementById('myImage');
  if (state == 1) {
    image.src = 'image/pic_bulbon.gif';
  } else {
    image.src = 'image/pic_bulboff.gif';
  }
}

window.onload = function() {
  alert("Welcome to the Cancer Support Hub!");
};