var c = document.querySelector("canvas"),
    ctx = c.getContext("2d"),
    w = c.width = window.innerWidth,
    h = c.height = window.innerHeight;
var micc=false;
var calibrationCountdown=1000;
var BoidBeat = function() {
  this.speed = 1;
  this.directions=6;
  this.turning = true;
  this.lineWidth=1;
  this.song=window.location.hash.slice(1)?"/#"+window.location.hash.slice(1):"/#300%20Violin%20Orchestra";
  this.activateMic=startMicD;
  this.tThreshold=0.3;
  this.calibrate=()=>calibrationCountdown=1000;
  // Define render logic ...
};
var freqCount=256;
function getRMS(spectrum) {var rms = 0;
  for (var i = 0; i < spectrum.length; i++) {
    rms += spectrum[i] * spectrum[i];
  }
  rms /= spectrum.length;
  rms = Math.sqrt(rms);
  return rms;
 }
function Microphone (_fft) {  var FFT_SIZE = _fft || 1024;  this.spectrum = [];
  this.volume = this.vol = 0;
  this.peak_volume = 0;  var self = this;
                            // A more accurate way to get overall volume
this.getRMS = function (spectrum) {var rms = 0;
  for (var i = 0; i < spectrum.length; i++) {
    rms += spectrum[i] * spectrum[i];
  }
  rms /= spectrum.length;
  rms = Math.sqrt(rms);
  return rms;
 }
  var audioContext = new AudioContext();
  var SAMPLE_RATE = audioContext.sampleRate;
  
  // this is just a browser check to see
  // if it supports AudioContext and getUserMedia
  // window.AudioContext = window.AudioContext ||  window.webkitAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;  // now just wait until the microphone is fired up
    function init () {
      try {
        startMic(new AudioContext());
      }
      catch (e) {
        console.error(e);
        alert('Web Audio API could not be called, check that the url starts with https:// and not http://');
      }
  } 
                            this.init=init;
                            function startMic (context) {    navigator.getUserMedia({ audio: true }, processSound, error);    function processSound (stream) {     // analyser extracts frequency, waveform, etc.
     var analyser = context.createAnalyser();
     analyser.smoothingTimeConstant = 0.2;
     analyser.fftSize = FFT_SIZE;     var node = context.createScriptProcessor(FFT_SIZE*2, 1, 1);     node.onaudioprocess = function () {       // bitcount returns array which is half the FFT_SIZE
       self.spectrum = new Uint8Array(analyser.frequencyBinCount);       // getByteFrequencyData returns amplitude for each bin
       analyser.getByteFrequencyData(self.spectrum);
       // getByteTimeDomainData gets volumes over the sample time
       // analyser.getByteTimeDomainData(self.spectrum);

       self.vol = self.getRMS(self.spectrum);
       // get peak - a hack when our volumes are low
       if (self.vol > self.peak_volume) self.peak_volume = self.vol;
       self.volume = self.vol;     };     var input = context.createMediaStreamSource(stream);
     input.connect(analyser);
     analyser.connect(node);
     node.connect(context.destination);  }  function error () {
     console.log(arguments);
  }
                                 }//////// SOUND UTILITIES  ///////////// ..... we going to put more stuff here....return this;};var Mic = new Microphone();
                           }
                            window.Microphone=Microphone;
var audio = document.querySelector('audio');
function songchange(value){
  window.location.hash=value.split("#").pop();
}
function hashchange(){
  audio.src = "https://cdn.glitch.com/7c659aa6-fe5f-4610-bdf3-3fd76117d9a5%2F"+window.location.hash.slice(1)+".mp3";
  audio.classList.add("paused");
}
var controls= new BoidBeat();
window.onload = function() {
  var gui = new dat.GUI();
  gui.add(controls,"song",{"Glorious Morning":"/#Glorious_morning",
    "Jumper":"/#Jumper",
"Stride":"/#Stride-",
"300 Violin Orchestra":"/#300%20Violin%20Orchestra",
"ThunderZone v2":"/#638150_-ThunderZone-v2-",
"Portugal The Man - Feel it Still":"/#Portugal.%20The%20Man%20-%20Feel%20It%20Still",
"The XX - Intro":"/#00%20Intro",
"Hall of the Mountain King":"/#Hall%20of%20the%20Mountain%20King",
"Everybody Wants To Rule The World (7\" Version)":"/#Everybody%20Wants%20To%20Rule%20The%20World%20(7%20Version)",
"Flight":"/#Flight",
"Electroman Adventures V2":"/#Waterflame%20-%20Electroman%20Adventures%20V2",
                          "Rasputin":"/#Rasputin",
                          }).onChange(songchange);
  gui.add(controls, 'speed', 0.125, 2);
  gui.add(controls, 'lineWidth', 1,10);
  gui.add(controls, 'tThreshold', 0.01,0.99);
  
  gui.add(controls, 'directions', 2, 12);
  gui.add(controls, 'turning');
  gui.add(controls, 'activateMic');
  gui.add(controls, 'calibrate');
  
};
var baseRad = Math.max(Math.min(w, h) / 200, 4);

var effectiveF= 16;
var trailSteps=20;
var fastestTurnFreq=10;
var q=0;
var ncount=(w * h) / baseRad / 500;
var M=4;
var scales=Math.log2(freqCount);
function logNt(v){
  return (Math.log(v+1)/Math.log(2))/(Math.log(freqCount+1)/Math.log(2));
}
var nodes = d3.range(ncount).map(function() {
  
  var f=Math.floor(q/ncount*effectiveF);
  
    var m={
      radius: baseRad,
      vx: Math.random() * 12 - 6,
      vy: Math.random() * 12 - 6,
      x: f/effectiveF * w,
      y: Math.random() * h,
      freq:Math.floor(f),//Math.floor((Math.pow(2,q/ncount*freqCount/12)-Math.pow(2,0/12))/(Math.pow(2,freqCount /12)-Math.pow(2,0/12))*freqCount),
      nt:logNt(Math.floor(f)),
      lastTurn:0
    };
  m.axl=[m.x];
  m.ayl=[m.y];
  m.posHist=[{x:m.x,y:m.y+0}];
  m.btr=[0];
  q++;
  return m;
  });
for (i = 1; i < nodes.length; i++) {
  nodes[i].ax = nodes[i].x;
  nodes[i].ay = nodes[i].y;
}



if(window.location.hash) hashchange();
window.addEventListener("hashchange", hashchange);
var Mic;
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
    analyser.connect(audioCtx.destination);

    analyser.fftSize = freqCount * 2;
    analyser.smoothingTimeConstant = 0.2;
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
var bpm=240;

var hM=100;
var historyLength=Math.floor((60*1000/bpm)/(1000/60))*hM;
let musica = [];
let musicmxl = [];
for(var i=0;i<freqCount;i++){
  musica.push(0);
  musicmxl.push(0);
}
var musics=[];
for(var i=0;i<historyLength;i++){
  var music2 = new Uint8Array(freqCount);
  musics.push(music2);
}
 var ll=0; 
let music = new Uint8Array(freqCount);
function main(e) {
  calibrationCountdown-=1000/60;
  ll++;
  if(micc){
    if(Mic.spectrum.length===freqCount){
  music=Mic.spectrum.slice();
    }
  }else{
    analyser.getByteFrequencyData(music);
  }
  for(var i=0;i< 0;i++){
  music=music.map((x,i)=>{
    var l=[ x];
                  if(i<freqCount-1){
    l.push(music[i+1]);
  }
    if(i>0){
    l.push(music[i-1]);
  }
  return Math.max(...l);
})
  }
  musics.unshift(music.slice());
  musics.pop();
  var musicave=[];
  for(var i=0;i<freqCount;i++){
    musica[i]=0;
    musicmxl[i]=0;
    musicave[i]=0;
    for(var j=0;j<historyLength/hM;j++){
      musica[i]=Math.max(musics[j][i],musica[i]);///historyLength;
      
      musicave[i]+=musics[j][i]/historyLength*hM;
    }
    for(var j=0;j<historyLength;j++){
      musicmxl[i]=Math.max(musics[j][i],musicmxl[i]);///historyLength;
    }
  }
  
  if (w != window.innerWidth || h != window.innerHeight) {
    w = window.innerWidth;
    h = window.innerHeight;
  }
  var q = d3.geom.quadtree(nodes),
    i = 0,
    n = nodes.length;
  for (i = 0; i < n; i++) {
    nodes[i].fx = 0;
    nodes[i].fy = 0;
    nodes[i].aveCenterX = 0;
    nodes[i].aveCenterY = 0;
    nodes[i].aveVX = 0;
    nodes[i].aveVY = 0;
    nodes[i].totalNebs = 0;
    var inter=1-Math.pow(Math.random(),1);
    var randF=Math.floor(Math.random()*freqCount*(1-inter)+nodes[i].freq*inter);
     if(musicmxl[randF]/256>musicmxl[nodes[i].freq]/256*10.0){//Math.min(musicmxl[nodes[i].freq]/256,calibrationCountdown>0?1:1-musicmxl[randF]/256)<Math.random()/2.0){//musicave[randF]/256/ 2 +musicmxl[randF]/256/ 2){
      nodes[i].freq=Math.max(Math.min(randF+Math.floor(Math.random()* 0),freqCount-1),0);
       nodes[i].nt=logNt(Math.floor(nodes[i].freq));
     }
    // if(i+1<n && musicave[nodes[i].freq]<musicave[nodes[i+1].freq]){
    //   nodes[i].freq=nodes[i+1].freq;
    // }
  }
  nodes.sort((a,b)=>a.freq-b.freq);
  // var knodes=nodes.map(x=>({freq:x.freq,nt:x.nt}));
  // knodes.sort((a,b)=>a.freq-b.freq);
  // for (i = 0; i < n; i++) {
  //   nodes[i].freq=knodes[i].freq;
  //   nodes[i].nt=knodes[i].nt;
  // }
//   for (i = 0; i < n; i++) {
//     var randF=Math.floor(Math.random()*freqCount);
//     if(i-1>-1 && musicave[nodes[i].freq]<musicave[nodes[i-1].freq]){
//       if(i+1<n && nodes[i].freq==nodes[i+1].freq){
      
//       nodes[i].freq=nodes[i-1].freq;
//       }
//     }
//   }
  i = 0;
  while (++i < n) {
    q.visit(collide(nodes[i]));
  }
  for (i = 1; i < n; i++) {
    nodes[i].fx += nodes[i].vx / 4;
    nodes[i].fy += nodes[i].vy / 4;
    if (nodes[i].totalNebs > 0) {
      nodes[i].fx += nodes[i].aveVX / nodes[i].totalNebs-nodes[i].vx/ nodes[i].totalNebs;
      nodes[i].fy += nodes[i].aveVY / nodes[i].totalNebs-nodes[i].vy/ nodes[i].totalNebs;
      nodes[i].fx +=
        (nodes[i].aveCenterX / nodes[i].totalNebs - nodes[i].x) / 40;
      nodes[i].fy +=
        (nodes[i].aveCenterY / nodes[i].totalNebs - nodes[i].y) / 40;
    }
    var fL = Math.sqrt(nodes[i].fx * nodes[i].fx + nodes[i].fy * nodes[i].fy);
    if (fL === 0) {
      fL = 1;
      var randDir = Math.random() * Math.PI * 2;

      nodes[i].fx = Math.cos(randDir) * 1;
      nodes[i].fy = Math.sin(randDir) * 1;
    }
    var min = nodes[i].radius / 5;
    var max = nodes[i].radius * 1;
    nodes[i].vx = (nodes[i].fx / fL) * Math.min(Math.max(min, fL), max);
    nodes[i].vy = (nodes[i].fy / fL) * Math.min(Math.max(min, fL), max);
    var volume=Math.pow(music[nodes[i].freq]/256,10.0);
    var volume2=Math.pow(musica[nodes[i].freq]/256,10.0);
    
    var spdm=Math.pow(music[nodes[i].freq]/256,4)+0.25;//(volume*0.5+(music[nodes[i].freq]*2.0+16)/(musicave[nodes[i].freq]+128));//1.0;//volume/10+0.9;
    var ddir=controls.directions;
    var spd=Math.sqrt(nodes[i].vx*nodes[i].vx+nodes[i].vy*nodes[i].vy)/3*spdm*controls.speed*2.0;
    var hdir=Math.round(Math.atan2(nodes[i].vy,nodes[i].vx)/Math.PI/2*ddir)/ddir*Math.PI*2;
    if("/#00%20Intro"==controls.song){
    ddir=4;
     spd=Math.sqrt(nodes[i].vx*nodes[i].vx+nodes[i].vy*nodes[i].vy)/3*spdm*controls.speed*2.0;
     hdir=(Math.round(Math.atan2(nodes[i].vy,nodes[i].vx)/Math.PI/2*ddir+0.5)-0.5)/ddir*Math.PI*2;
    }
    var vxh=Math.cos(hdir)*spd;
    var vyh=Math.sin(hdir)*spd;
    nodes[i].x += vxh;
    nodes[i].y += vyh;
    bound(nodes[i]);
    
    var thrrr=controls.tThreshold;
    if(volume>thrrr && musics[5][nodes[i].freq]==musica[nodes[i].freq] && nodes[i].lastTurn>fastestTurnFreq && controls.turning){
      var spdd=Math.sqrt(nodes[i].vx*nodes[i].vx+nodes[i].vy*nodes[i].vy);
    var hdird=Math.atan2(nodes[i].vy,nodes[i].vx)+Math.PI*2/ddir*((ll%2)*2-1);
      
      nodes[i].vx=Math.cos(hdird)*spd;
    nodes[i].vy=Math.sin(hdird)*spd;
    nodes[i].lastTurn=0;
    }
  
    var spd=Math.sqrt(nodes[i].vx*nodes[i].vx+nodes[i].vy*nodes[i].vy)*spdm*controls.speed;
    var hdir=Math.round(Math.atan2(nodes[i].vy,nodes[i].vx)/Math.PI/2*ddir)/ddir*Math.PI*2;
    if("/#00%20Intro"==controls.song){
    ddir=4;
     spd=Math.sqrt(nodes[i].vx*nodes[i].vx+nodes[i].vy*nodes[i].vy)/3*spdm*controls.speed*2.0;
     hdir=(Math.round(Math.atan2(nodes[i].vy,nodes[i].vx)/Math.PI/2*ddir+0.5)-0.5)/ddir*Math.PI*2;
    }
    var vxh=Math.cos(hdir)*spd;
    var vyh=Math.sin(hdir)*spd;
    nodes[i].x += vxh;
    nodes[i].y += vyh;
    nodes[i].ax += (nodes[i].x - nodes[i].ax) * 1.0;
    nodes[i].ay += (nodes[i].y - nodes[i].ay) * 1.0;
  nodes[i].lastTurn+=1;
  
  }
  // if(ll%1==0){
  ctx.globalCompositeOperation="subtract";
  ctx.fillStyle = "rgba(5,5,5,1)";
  ctx.rect(0,0,w,h);
  ctx.fill();
  if("/#00%20Intro"==controls.song){
    c.style.filter="sepia(0.8) hue-rotate(180deg) saturate(2)";
    var v=getRMS(music);
    var sso=Math.min(w,h)/8;
    var ss=v/256*sso/2+sso/2;
    ctx.globalCompositeOperation="lighter";
    ctx.lineWidth=(ss-sso/2)*Math.sqrt(2);
  ctx.strokeStyle = `hsl(0,0%,${v/256*100}%)`;
    ctx.fillStyle = `hsl(0,0%,${0}%)`;
    // console.log(`hsl(0,0,${v})`);
  ctx.beginPath();
    ctx.moveTo(w/2-ss,h/2);
    ctx.lineTo(w/2-ss*3,h/2-ss*2);
    ctx.lineTo(w/2-ss*2,h/2-ss*3);
    ctx.lineTo(w/2-ss*0,h/2-ss*1);
    ctx.lineTo(w/2+ss*2,h/2-ss*3);
    ctx.lineTo(w/2+ss*3,h/2-ss*2);
    ctx.lineTo(w/2+ss*1,h/2-ss*0);
    
    ctx.lineTo(w/2+ss*3,h/2+ss*2);
    ctx.lineTo(w/2+ss*2,h/2+ss*3);
    ctx.lineTo(w/2+ss*0,h/2+ss*1);
    ctx.lineTo(w/2-ss*2,h/2+ss*3);
    ctx.lineTo(w/2-ss*3,h/2+ss*2);
    // ctx.lineTo(w/2-ss,h/2);
    ctx.closePath();
    // ctx.lineTo(w/2-ss*1,h/2-ss*0);
    ctx.stroke();
    ctx.fill();
  }else{
    c.style.filter="";
  }
  ctx.globalCompositeOperation="source-over";
  ctx.fillStyle = "gray";
  for(let i of nodes){
    var volume=Math.pow(music[i.freq]/256,5.0);
    var volume3=Math.pow(musicave[i.freq]/256,5.0);
//     ctx.beginPath();
//     ctx.strokeStyle = `hsl(${i.freq/effectiveF*360},${Math.floor((volume)*100)}%,${Math.floor((volume)*20+30)}%)`;
//     ctx.lineWidth=controls.lineWidth;
//     ctx.lineCap = "round";
//     var lastp={x:i.ax,y:i.ay};
// //       ctx.moveTo(lastp.x, lastp.y);
// //     for(var k=0;k<i.axl.length;k++){
      
      
// //     ctx.lineTo(i.axl[k], i.ayl[k]);
     
// //       lastp={x:i.axl[k], y:i.ayl[k]};
      
// //     }
// //      ctx.stroke();
//     for(var k=0;k<i.axl.length;k++){
//       var bri=volume-k/i.axl.length+0;
//       ctx.beginPath();
//     ctx.strokeStyle = `hsl(${i.freq/effectiveF*360},${Math.floor((bri)*100)}%,${Math.floor((bri)*20+30)}%)`;
//       ctx.moveTo(lastp.x, lastp.y);
//     ctx.lineTo(i.axl[k], i.ayl[k]);
//       ctx.stroke();
//       lastp={x:i.axl[k], y:i.ayl[k]};
      
//     }
    
//     ctx.beginPath();
//     ctx.strokeStyle = `hsl(${i.freq/effectiveF*360},${100}%,${50}%)`;
//     ctx.lineWidth=controls.lineWidth;
//     ctx.lineCap = "round";
//     var lastp={x:i.ax,y:i.ay};
//       ctx.moveTo(lastp.x, lastp.y);
//     for(var k=0;k<i.axl.length;k++){
      
      
//     ctx.lineTo(i.axl[k], i.ayl[k]);
     
//       lastp={x:i.axl[k], y:i.ayl[k]};
      
//     }
//      ctx.stroke();
//     lastp={x:i.ax,y:i.ay};
    var vFall=0.95;
    i.vol=Math.max(volume,(i.vol||0)*vFall);
    i.volav=Math.max(volume3/2+volume/3,(i.volav||0)*vFall);
//     for(var k=0;k<i.axl.length;k++){
//       var bri=volume-k/i.axl.length+0;
//       ctx.beginPath();
//     ctx.strokeStyle = `rgba(${Math.floor(255*0.3)},${Math.floor(255*0.3)},${Math.floor(255*0.3)},${(1-bri)})`;
//       ctx.moveTo(lastp.x, lastp.y);
//     ctx.lineTo(i.axl[k], i.ayl[k]);
      
//       lastp={x:i.axl[k], y:i.ayl[k]};
      
//     }
//     ctx.stroke();
    
  }
    
  // }
  //weird optimized v rendering
  for(let i of nodes){
    i.axl.unshift(i.ax+0);
    i.ayl.unshift(i.ay+0);
    
    i.btr.unshift(i.vol);
    if(i.axl.length>trailSteps){
      i.axl=i.axl.slice(0,trailSteps);
    }else{
      i.axl.push(i.axl[0])
    }
    if(i.btr.length>trailSteps){
      i.btr=i.btr.slice(0,trailSteps);
    }
    i.posHist.unshift({x:i.ax,y:i.ay});
 
    if(i.posHist.length>trailSteps){
      i.posHist=i.posHist.slice(0,trailSteps);
    }
    if(i.ayl.length>trailSteps){
      i.ayl=i.ayl.slice(0,trailSteps);
    }else{
      i.ayl.push(i.ayl[0])
    }
    for(var ko=i.axl.length-1;ko>0;ko--){
        i.axl[ko]=i.axl[ko]+(Math.random()*2-1)*1;
      i.ayl[ko]=i.ayl[ko]+(Math.random()*2-1)*1;
    }
//    for(var ko=i.axl.length-1;ko>0;ko--){
//       // for(var ko=1;ko<i.axl.length;ko++){
//       var an={x:i.axl[ko],y:i.ayl[ko]};
//       var bn={x:i.axl[ko-1],y:i.ayl[ko-1]};
    
      
//       var di=Math.sqrt((an.x-bn.x)**2+(an.y-bn.y)**2);
//       var le=1-10/di;
//       i.axl[ko]=i.axl[ko-1]*le+i.axl[ko]*(1-le);
//       i.ayl[ko]=i.ayl[ko-1]*le+i.ayl[ko]*(1-le);
//     }
  
  }
ctx.lineWidth=controls.lineWidth;
//   for(var ko=0;ko<nodes[1].axl.length;ko++){
//     var k=nodes[1].axl.length-ko-1;
//     // var firstN=true;
//     var lastN=-1;
//     for(let i of nodes){
//       var bri=i.btr[k]/2*Math.pow((1-k/(i.axl.length-1)),2);//Math.pow((1-k/i.axl.length),0.25)-(k/i.axl.length)/2;
//       var bri=i.vol*Math.pow(Math.max(Math.min((i.vol-k/(i.posHist.length-1)),1),0),0.25);
//       var lastp={x:i.ax,y:i.ay};
//       if(k>0){
//         lastp={x:i.axl[k-1],y:i.ayl[k-1]};
//       }
//       if(lastN!==i.freq){
//         if(lastN!=-1){
//           ctx.fill();
//         }
//         lastN=i.freq;
//         ctx.beginPath();
        
//     ctx.lineCap = "round";
//         ctx.fillStyle = `hsla(${(i.freq/freqCount*scales*360*3)%360},${Math.floor((bri)*50+50)}%,${50}%,${Math.floor((bri)*100)}%)`;
//     // ctx.strokeStyle = `rgba(${Math.floor(255*0.3)},${Math.floor(255*0.3)},${Math.floor(255*0.3)},${(1-bri)})`;
//       }
//       ctx.moveTo(lastp.x-1, lastp.y,1,0,Math.PI*2);
//       ctx.arc(lastp.x, lastp.y,1,0,Math.PI*2);
//     //   ctx.moveTo(lastp.x, lastp.y);
//     // ctx.lineTo(i.axl[k], i.ayl[k]);
      
//     }
//     ctx.fill();
    
//   }
  for(var ko=0;ko<nodes[1].posHist.length;ko++){
    var k=nodes[1].posHist.length-ko-1;
    // var firstN=true;
    var lastN=-1;
    for(let i of nodes){
      var bri=i.vol*Math.pow(Math.max(Math.min((i.vol-k/(i.posHist.length-1)),1),0),0.25);
      var lastp={x:i.ax,y:i.ay};
      if(k>0){
        lastp=i.posHist[k-1];
      }
      if(lastN!==i.freq){
        if(lastN!=-1){
          ctx.stroke();
        }
        lastN=i.freq;
        ctx.beginPath();
        
    ctx.lineCap = "round";
        ctx.strokeStyle = `hsla(${(i.freq/freqCount*scales*360*3)%360},${Math.floor((bri)*50+50)}%,${50}%,${Math.floor((bri)*100)}%)`;
    // ctx.strokeStyle = `rgba(${Math.floor(255*0.3)},${Math.floor(255*0.3)},${Math.floor(255*0.3)},${(1-bri)})`;
      }
      // ctx.moveTo(lastp.x-1, lastp.y,1,0,Math.PI*2);
      // ctx.arc(lastp.x, lastp.y,1,0,Math.PI*2);
      ctx.moveTo(lastp.x, lastp.y);
    ctx.lineTo(i.posHist[k].x, i.posHist[k].y);
      
    }
    ctx.stroke();
    
  }
  
}



function bound(node) {
  var r = node.radius,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r;
  var nx = Math.max(node.x, r);
  var ny = Math.max(node.y, r);
  nx = Math.min(nx, w - r);
  ny = Math.min(ny, h - r);

  node.vx += nx - node.x;
  node.vy += ny - node.y;
  node.vx += nx - node.x;
  node.vy += ny - node.y;
}

function collide(node) {
  var r = node.radius * 18,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && quad.point !== node) {
      var x = node.x - quad.point.x,
        y = node.y - quad.point.y,
        l = Math.sqrt(x * x + y * y),
        r = node.radius + quad.point.radius;
      if (l < r * 3) {
        var thr=0.8;
        var attractiveness=Math.max(Math.pow(1-Math.abs(node.freq-quad.point.freq)/freqCount*scales,2)-thr,0)/(1-thr);
        node.totalNebs+=attractiveness;
        quad.point.totalNebs+=attractiveness;
        node.aveVX += quad.point.vx*attractiveness;
        quad.point.aveVX += node.vx*attractiveness;
        node.aveVY += quad.point.vy*attractiveness;
        quad.point.aveVY += node.vy*attractiveness;
        node.aveCenterX += quad.point.x*attractiveness;
        quad.point.aveCenterX += node.x*attractiveness;
        node.aveCenterY += quad.point.y*attractiveness;
        quad.point.aveCenterY += node.y*attractiveness;
        r = r * 1.5;
        if (l < r) {
          l = ((l - r) / l) * 0.5*attractiveness;
          node.fx -= x *= l;
          node.fy -= y *= l;
          quad.point.fx += x;
          quad.point.fy += y;
        }
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}
window.addEventListener("resize", function(e) {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
});
audio.addEventListener("pause", () => {
  audio.classList.add("paused");
})
audio.addEventListener("play", () => {
  audioCtx.resume();
  audio.classList.remove("paused");
})
function startMicD(){
  micc=true;
  if(!Mic){
  Mic=new Microphone(freqCount * 2);
    Mic.init();
  
  
  }
}
window.setInterval(main,1000/60);