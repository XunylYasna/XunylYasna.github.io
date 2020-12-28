var pre = document.querySelectorAll("pre");
var colors = ["red","red","orange","yellow","chartreuse","cyan","violet","purple","purple","indigo"];
var tempColors = [];


setInterval(function(){
  
for (i=0; i < pre.length; i++)
  {
    if (i == pre.length-1)
      {
        tempColors[i] = colors[0];
        colors = tempColors;
      }
    else
      {
        tempColors[i] = colors[i+1];
      }
    pre[i].style.color = tempColors[i];
  };

},60);
