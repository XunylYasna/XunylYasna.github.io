// forked from demouth's "ASCII Art" https://jsdo.it/demouth/dxX2
setTimeout(function(){
  
    var img = document.createElement("img");
    var img2 = document.createElement("img");
    var counter = 0;
    img.onload = function(e){
      counter += 1;
      if(counter == 2)
        animateFunction()
    }
    img2.onload = function(e){
      counter += 1
      if(counter == 2)
        animateFunction();
    }
    
    var animateFunction = function(e){
      
      var aa = new AA();
      aa.init(img,img2);
      aa.random = false;
      
      setInterval(function(){
        
        var master = [
          ["$","M","@"],
          ["Y","N"],
          ["%","#"],
          ["6","9"],
          ["A","M","E"],
          ["I","S","L"],
          ["Y","N","U"],
          ["X","A","N"],
          ["S","A","y"],
          ["(","/",")"],
          ["[","]"],
          ["i","l"],
          ["^","~"],
          ["`"],
          [" "]
        ];
        var p= Math.sin(new Date().getTime()*0.0015)*0.5+0.5;
        var i = 0, l = master.length;
        var max = ~~(l * p)+1;
        var list = [];
        for(;i<max;i++){
          list.push( AA.prototype._pickRandom(master[i+(l-max)]) );
        }
        AADot.prototype.stringList = list;
        
        
        
        AALine.prototype.toString = function(){
          
          var i = 0,
            l = this.dots.length,
            str = "";
          
          for(;i<l;i++){
            if(i<p*l){
            str += this.dots[i].toString();
            }else{
            str += (p<i/l-Math.random()*0.4) ? " " : this.dots[i].toString();
            }
          }
          
          
          str += '\r\n';
          
          return str;
          
        };
        
        var str = aa.getString();
        
        
        document.getElementById("photo_target").textContent = str;

        
      },100);
    };
    
    img.src = "assets/images/lynuxansay.png";
    img2.src = "assets/images/lynuxskull.png";

  
  },0);
  
  
  var AA = function(){
    
    this.image;
    this.image2;
    this.lines = [];
    this.lines2 =[];
    this.random = true;
    this.altImage = false;
    this.framecounter = 0;
    
  };
  AA.prototype = {
    
    init : function(image, image2){
      
      var imageData = this._convertToImageData(image);
      var data = imageData.data;

      var imageData2 = this._convertToImageData(image2);
      var data2 = imageData2.data;
      var i = 0,
        l = h,
        w = imageData.width,
        h = imageData.height;
      var lines = [],
        line;
      var lines2 = [],
        line2;
      
      data = this._canvasPixelArrayToArray(data);
      data2 = this._canvasPixelArrayToArray(data2);
      
      for(;i<h;i++){
        line = new AALine( data.splice(0,4*w) );
        lines.push(line);
        line2 = new AALine( data2.splice(0,4*w) );
        lines2.push(line2);
      }
      
      this.lines = lines;
      this.lines2 = lines2;
      
    },
    getString : function() {
      this.framecounter += 1;
      if(this.framecounter == 32){
        this.altImage = !this.altImage;
        this.framecounter = 0;
      }
      if(this.random) this._changeStringList();
      if(this.altImage){
        var linesFinal = this.lines2
      }
      else{
        var linesFinal = this.lines
      }
      var i = 0,
        l = linesFinal.length,
        str = "";
      for(;i<l;i++) str += linesFinal[i].toString();
      return str;
    },
    _convertToImageData : function(image){
      
      var c = document.createElement("canvas");
      c.width  = image.width;
      c.height = image.height;
      var cx = c.getContext("2d");
      var w = image.width,
        h = image.height;
      cx.drawImage(image,0,0,w,h);
      var imageData = cx.getImageData(0,0,w,h);
      
      return imageData;
      
    },
    _pickRandom : function(array){
      
      var l = array.length;
      
      return array[ ~~(Math.random() * l) ];
      
    },
    _canvasPixelArrayToArray : function(cpa) {
      
      var i = 0, l = cpa.length;
      var r = [];
      for(;i<l;i++) r.push(cpa[i]);
      return r;
      
    }
  };
  
  
  var AALine = function (imageData) {
    
    this.dots;
    if(imageData) this.init(imageData);
    
  };
  
  AALine.prototype = {
    
    init : function(imageData){
      
      var i = 0,
        l = imageData.length;
      
      var dots = [];
      
      for(;i<l;i+=4){
        
        var dot = new AADot(imageData[i],imageData[i+1],imageData[i+2],imageData[i+3]);
        dots.push(dot);
      }
      
      this.dots = dots;
      
      
    },
    toString : function(){
      
      var i = 0,
        l = this.dots.length,
        str = '';
      
      for(;i<l;i++) str += this.dots[i].toString();
      
      return str + '\r\n';
      
    },
    toHtmlString : function(){
      
      var i = 0,
        l = this.dots.length,
        str = '';
      
      for(;i<l;i++) str += this.dots[i].toHtmlString();
      
      return str + '<br>';
      
    }
    
  };
  
  
  var AADot = function(r,g,b,a){
    
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    
  };
  
  AADot.prototype = {
    stringList : ["$","M","%","8","D","Z","U","b","+","(","[","i","^","`"],
    toString : function(){
      
      var l = this.stringList.length;
      var b = this.getBrightness();
      var s = this.stringList[~~(b*(l-1)+0.5)];
      
      return s;
      
    },
    toHtmlString : function(){
      
      var s = '<span style="color:rgb(' + this.r + ',' + this.g +',' + this.b + ');">' + this.toString() + "</span>";
      
      return s;
      
    },
    getBrightness : function(){
      
      var t = this.r + this.g + this.b;
      
      return t / 765;
      
    }
  };