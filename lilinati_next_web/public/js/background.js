var counter = 0;

function changeBG() {
  var img = [
        'url()',
        'url()',
        'url()'       
      ];

  if (counter === img.length) {
    counter = 0;
  }
  document.body.style.backgroundImage = img[counter];

  counter++;
}

setInterval(changeBG, 3500);