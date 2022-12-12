var fullecg=function(datestart,data,ECGscale,Fullscale) {
    // This constructor contains all methods, properties and local variables
    // for the full ECG module; including properties governing strip overlays

    var me=this;

    // collect DOM nodes for later reference
    var fullcontainer=document.getElementById("fullecg");

    // holds the X offset of the full length strip container within the browser window
    var fullcontainerOffsetX=fullcontainer.offsetLeft+Number(window.getComputedStyle(fullcontainer,null).getPropertyValue("border-left-width").replace("px",""));

    this.segments=[];               // contains references to each of the three segments
    this.strips={};                 // contains added strips



    this.full={
        // singly-defined object that holds the full-length strip
        currentX: 0,
        node: fullcontainer,
        width: 3600,

        // method to place viewports correctly
        calcX: function(x) {
            console.log("calculating");
        }
    };



    this.time=function(x) {
        // function to jump to a new time
        for (var i=0; i<me.segments.length; i++) {
            // iterate over each segement, call its time function
            me.segments[i].time(x);
        }
    };



    this.segment=function(x,obj) {
        // function to move the window indicator
        var newX=obj.scale=="ecg"?x/scaleECG:x/scaleFull;
        newX+=obj.edge=="left"?5:0;
        for (var i=0; i<me.segments.length; i++) {
            // iterate over each segement, call its time function
            me.segments[i].time(newX);
        }
    }


    this.strip=function(x,params) {
        // function to place a strip representation
        var strip=me.strips[("strip"+x)];
        switch(params.action) {
        case "move":
            // move an existing strip
            strip.move(params.newx);
            break;
        case "delete":
            // delete an existing strip
            strip.delete();
            break;
        case "lock":
            // lock a strip in place
            strip.lock();
            break;
        default:
            // create a new strip
            me.strips[("strip"+x)]=new oStrip(x);
        }

    };


    this.plot=function(data) {
        // Draw the ecg plot given a set of data
        var ecg=data.ecg;
        var x=0;
        var canvas1=document.getElementById("ecgfull1");
        var context1=canvas1.getContext("2d");
        var canvas2=document.getElementById("ecgfull2");
        var context2=canvas2.getContext("2d");
        var canvas3=document.getElementById("ecgfull3");
        var context3=canvas3.getContext("2d");

        // Now clear the existing data
        context1.clearRect(0,0,canvas1.width,canvas1.height)
        context2.clearRect(0,0,canvas2.width,canvas2.height)
        context3.clearRect(0,0,canvas3.width,canvas3.height)

        // Now write the new data
        context1.beginPath();
        context2.beginPath();
        context3.beginPath();

        for(var i=1; i<ecg.length; i++) {
            context1.lineTo(x,ecg[i]/3);
            context2.lineTo(x,ecg[i]/3);
            context3.lineTo(x,ecg[i]/3);
            x+=(scaleFull/scaleECG);
        }

        context1.lineWidth=.5;
        context1.strokeStyle="#ffffff";
        context1.stroke();
        context2.lineWidth=.5;
        context2.strokeStyle="#ffffff";
        context2.stroke();
        context3.lineWidth=.5;
        context3.strokeStyle="#ffffff";
        context3.stroke();
    };


    this.init=function() {
        // set up full length segments
        for(var i=0; i<this.full.node.children.length; i++) {
            me.segments[i]=new oSegment(i);
        }
    };

        
    function oSegment(number) {
        // Constructor for each of three segments holding the strip
        var segment=this;
        this.ind=number;
        this.currentX=-(number*960);
        this.node=me.full.node.children[number];
        var nView=document.createElement("DIV");
        nView.className="viewport";
        nView.style.left=this.currentX+"px";
        this.node.appendChild(nView);
        this.viewport=nView;
    
        // method to jump to a new time
        this.time=function(x) {
            var newtime=x<5?5:x>85?85:x;
            var newX=(newtime*scaleFull)-(scaleFull*10/2);
            newX-=(segment.ind*scaleFull*30);
            segment.viewport.style.left=newX+"px";
            segment.currentX=newX;
        }
    
        // Add click listener
        this.node.addEventListener("click",function(e) {
            e.preventDefault();
            var posX=e.clientX-fullcontainerOffsetX;
            posX+=(segment.ind*scaleFull*30);
            var timeX=posX/scaleFull;
            base.distribute(timeX,"time");
        });
    
        return this;
    };


    function oStrip(xpos) {
        // Constructor of strips to display
        var strip=this;
        this.viewport=[];

        // Create the representation of the strip
        var fpos=xpos/(scaleECG/scaleFull), fStrip;
        for(var i=0; i<me.segments.length; i++) {
            fpos-=(i==0)?0:(scaleFull*30);
            fStrip=document.createElement("DIV");
            fStrip.className="strip";
            fStrip.style.left=fpos+"px";
            fStrip.id="fstrip"+xpos;
            me.segments[i].node.appendChild(fStrip);
            this.viewport[i]=fStrip;
        }

        this.move=function(newx) {
            // Move the strip in conjunction with the same strip moving
            // on the main ECG window
            fpos=newx/(scaleECG/scaleFull);
            for(var i=0; i<strip.viewport.length; i++) {
                fpos-=(i==0)?0:(scaleFull*30);
                strip.viewport[i].style.left=fpos+"px";
            }
        };

        this.delete=function() {
            // Strip has been deleted; remove it
            for(var i=0; i<strip.viewport.length; i++) {
                strip.viewport[i].parentNode.removeChild(strip.viewport[i]);
            }
        };

        this.lock=function() {
            // Lock the strip in conjunction with the same strip locking
            // on the main ECG window
            for(var i=0; i<strip.viewport.length; i++) {
                strip.viewport[i].className="strip locked";
            }
        }
    }


    return this;
}
