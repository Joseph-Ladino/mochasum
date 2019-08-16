var catImg = document.getElementById("mousetrail"),
    catCoords=[0, 0];
    mouseCoords = [document.documentElement.clientWidth/2, document.documentElement.clientHeight/2],
    cancelframe=false;
    starttime = false,
    colors = ["red", "orange", "yellow", "green", "aqua"],
    prevColor = colors[colors.length-1],
    // Yeah I'm hotlinking to discord, sue me
    goodnoms = ["https://cdn.discordapp.com/attachments/292072220518383616/612024103762919465/nom0.wav", "https://cdn.discordapp.com/attachments/292072220518383616/612024103125385226/nom1.wav", "https://cdn.discordapp.com/attachments/292072220518383616/612024087560192072/nom2.wav", "https://cdn.discordapp.com/attachments/292072220518383616/612024083647037450/nom3.wav", "https://cdn.discordapp.com/attachments/292072220518383616/612024081126129706/nom4.wav"],
    evilnoms = ["https://cdn.discordapp.com/attachments/292072220518383616/612024141544947890/evilnom0.wav", "https://cdn.discordapp.com/attachments/292072220518383616/612024117415378945/evilnom1.wav", "https://cdn.discordapp.com/attachments/292072220518383616/612024109273972746/evilnom2.wav", "https://cdn.discordapp.com/attachments/292072220518383616/612024104744255603/evilnom3.wav"],
    isevil = false,
    colorswap = false,
    framecount = 0,
    colorswapdelay = 5,
    assets = goodnoms.concat(evilnoms, "evilbackground");
    
    assets.forEach((val) => {
      var tempLink = document.createElement("link");
      tempLink.rel = "preload";
      tempLink.href = val;
      tempLink.as = "audio";
      document.head.append(tempLink);
    });


/* ***************** MISC_FUNCTIONS ***************** */


// Don't kill me but this function has been borrowed and modified

function angle(mouse, cat) {
  var dy = mouse[1] - cat[1];
  var dx = mouse[0] - cat[0];
  var theta = Math.atan2(dy, dx); // range (-PI, PI)
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180)
  return theta;
}

function distance(pos1, pos2, xy = false) {
  var distx = (pos2[0] - pos1[0]),
      disty = (pos2[1] - pos1[1]);
  if(!xy) return Math.sqrt(Math.pow(Math.abs(distx), 2) + Math.pow(Math.abs(disty), 2));
  else return [distx, disty];
}

function playSound(src, loop = false, id=false) {
  var audioElm;
  
  if(document.getElementById(id)) audioElm = document.getElementById(id);
  else if(id !== false) {audioElm =  new Audio(); audioElm.id = id; document.body.append(audioElm); audioELm = document.getElementById(id)}
  else audioElm = new Audio();
  
  audioElm.addEventListener("loadeddata", ()=>{
    
    if(loop !== false) {
      audioElm.addEventListener('ended', function() {
        audioElm.currentTime = 0;
        audioElm.play();
      }, false);
    } else {
      audioElm.addEventListener("ended", function() {
        audioElm.remove();
      });
    }
    
    audioElm.play().then(()=>{
      setTimeout(()=>{
        audioElm.play();
      }, 50);
    });
  });
  
  audioElm.src = src;
}

function choose(arr) {
  return arr[Math.round(Math.random() * (arr.length-1))];
}

function colorizeText(elm) {
  var charSplat = (elm.innerText).split("");
  var outstring = "";
  
  charSplat.forEach((letter) => {
    
    var index = colors.indexOf(prevColor);
    index = (index == colors.length-1) ? 0 : index+1;
    color = colors[index];
    outstring += "<span style='color: " + color + "'>" + letter + "</span>";
    prevColor = (letter == " ") ? prevColor : color;
  });
  
  elm.innerHTML = outstring;
}

/* ***************** CAT_FUNCTIONS ***************** */

function catRotate(mouseEvent) {
  catCoords = [(parseInt((catImg.style.left).slice(0, -2)) + (0)), (parseInt((catImg.style.top).slice(0, -2)) + (0))],
  mouseCoords = [mouseEvent.screenX - parseInt(catImg.style.width.slice(0,-2))/1.5, mouseEvent.screenY - parseInt(catImg.style.height.slice(0,-2))],
  flip = (mouseCoords[0] <= catCoords[0]) ? 180 : 0;
  
  catImg.style.position = "absolute";
  catImg.style.boxSizing = "border-box";
  catImg.style.transform = "rotate(" + (angle(mouseCoords, catCoords) + 180) + "deg) rotateX(" + (flip + 180) + "deg) ";
}

function catMove() {
  var speed = 25,
  difference = distance(mouseCoords, catCoords, true),
  moveby = [difference[0]/speed, difference[1]/speed];
  
  catImg.style.left = (catCoords[0] + moveby[0]*-1) + "px";
  catImg.style.top = (catCoords[1] + moveby[1]*-1) + "px";
}

function catClick() {
  playSound(((!isevil) ? "https://cdn.discordapp.com/attachments/292072220518383616/612024145332666379/catpurr.wav" : "https://cdn.discordapp.com/attachments/292072220518383616/612024103385301035/evilpurr.wav"), false, "fx");
  
  var imageSize = [parseInt((catImg.style.width).slice(0, -2)), parseInt((catImg.style.height).slice(0, -2))];
  
  var newSize = (imageSize[1] * 1.05 <= document.documentElement.clientHeight/0.92) ? [imageSize[0]*1.05, imageSize[1]*1.05] : imageSize;
  
  catImg.style.width = newSize[0] + "px";
  catImg.style.height = newSize[1] + "px";
  
  if(newSize[1] >= document.documentElement.clientHeight / 2) {
    var tempEl = document.querySelector("h1");
    colorswap = true;
    isevil = true;
    tempEl.innerHTML = "Happy Birthday Mom! \n Also, Mocha\'s evil now :3";
    colorizeText(tempEl);
    tempEl.style.zIndex = 100;
    catImg.style.zIndex = 99;
    if(document.getElementById("background").src != window.location.origin + "./evilbackground.wav") playSound("./evilbackground.wav", true, "background");
  }
}

function catCaught() {
  playSound(choose(goodnoms));
  if(isevil) playSound(choose(evilnoms));
}

/* ***************** MAIN_LOOP ***************** */

function loop(timestamp) {
    if(!starttime) starttime = (new Date()).getTime();
    var now = (new Date()).getTime(),
        progress = now - starttime;
        
    catMove();
    
    if(colorswap && framecount >= colorswapdelay) {
      colorizeText(document.querySelector("h1"));
      framecount = 0;
    } else {
      framecount++;
    }

    if(!cancelframe) {
      requestAnimationFrame(loop);
    }
}


  setTimeout(()=>{
    playSound("./background.wav", true, "background");
  }, 500);
  
window.onload = function() {
  catImg.style.width = catImg.width + "px";
  catImg.style.height = catImg.height + "px";
  catMove();
  document.addEventListener("mousemove", catRotate);
  catImg.addEventListener("mouseover", catCaught);
  catImg.addEventListener("mousedown", catClick);
  requestAnimationFrame(loop);
  colorizeText(document.querySelector("h1"));
};
