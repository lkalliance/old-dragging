// CALIPERS AND STRIP WINDOWS ON MAIN ECG GRID

var oClick={ move: false, down: false, offGrid: false };                    // Tracks current state        
var oAction={heir:{grid: false},current:false,gridX:0,intval:false};        // Tracks what is the current actionable object.
var oStrips={};     // contains all strips added to the grid
var oCals={};       // contains all calipers added to the grid
var oCalHandles={}; // contains all caliper drag handles added to the grid
var scaleECG=125;   // number of pixels per second for main ECG
var scaleFull=32;   // number of pixels per second for full ECG

// placeholder data for date range
var year=2015, month=6, day=28, hour=13, min=0, sec=0, ms=0;
var starttime=new Date(year, month, day, hour, min, sec, ms);

// collect DOM nodes for later reference
var body=document.body,
    grid=document.getElementById("grid"),
    container=document.getElementById("container"),
    fullcontainer=document.getElementById("fullcontainer"),
    windowStart=document.getElementById("windowStart"),
    windowEnd=document.getElementById("windowEnd");

var startMove=0;    // holds x position of the cursor at the start of a move
var containerOffsetX=container.offsetLeft+Number(window.getComputedStyle(container,null).getPropertyValue("border-left-width").replace("px",""));   // holds the offset of the main ECG container within the browser window
var fullcontainerOffsetX=fullcontainer.offsetLeft+Number(window.getComputedStyle(fullcontainer,null).getPropertyValue("border-left-width").replace("px",""));   // holds the X offset of the full length strip container within the browser window

var oTime={
    // singly-defined object that manages time changes
    current: 5,

    // master method for changing time
    changeTime: function(x,who) {
       // console.log(x);
        this.current=x;

        for(var i=0; i<oFull.segments.length; i++) {
            oFull.segments[i].time(x);
        }

        if(who!=="grid") oGrid.time(x);
    },

    // method to set the time range displayed on the main ECG
    setRange: function() {
        // Closure to create a time string
        function timeBuild(obj) {
            var timestring="";
            var noon=obj.getHours()==12?true:false;
            var midnight=obj.getHours()==0?true:false;
            var ampm=(obj.getHours()<12 || midnight)?"am":"pm";
            timestring+=(midnight||noon)?"12:":ampm=="am"?(obj.getHours()+":"):((obj.getHours()-12+":"));
            timestring+=obj.getMinutes()<10?"0":"";
            timestring+=(obj.getMinutes()+":");
            timestring+=obj.getSeconds()<10?"0":"";
            timestring+=(obj.getSeconds()+" ");
            timestring+=ampm;
            return timestring;
        }

        // determine the new MS start and end time of the window
        var offset=container.scrollLeft;
        var newms=ms+(offset/(scaleECG/1000));
        var newstart=new Date(year,month,day,hour,min,sec,newms);
        var newend=new Date (year,month,day,hour,min,sec,(newms+10000));

        // Construct the new labels
        var days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        var labelstart="", labelend="";

        // (Dates)
        labelstart+=(days[newstart.getDay()]+", ");
        labelstart+=(newstart.getMonth()+"/");
        labelstart+=(newstart.getDate()+"/");
        labelstart+=(newstart.getFullYear()+" ");
        labelend+=(days[newend.getDay()]+", ");
        labelend+=(newend.getMonth()+"/");
        labelend+=(newend.getDate()+"/");
        labelend+=(newend.getFullYear()+" ");

        // (Times)
        labelstart+=timeBuild(newstart);
        labelend+=timeBuild(newend);

        windowStart.innerHTML=labelstart;
        windowEnd.innerHTML=labelend;

    }
};

var oFull={
    // singly-defined object that holds the full-length strip
    currentX: 0,
    node: fullcontainer,
    width: 3600,
    segments: [],

    // method for jumping to a new time
    time: function(x) {
        console.log("jumping to new time");
    },

    // method to place viewports correctly
    calcX: function(x) {
        console.log("calculating");
    }
}

var oGrid={
    // singly-defined object that holds the main ECG grid
    node: grid,
    grid: true,
    currentX: 0,

    // method for dragging grid within the container
    move: function(e) {
        var diff=0, nextX=0, newX="0px";
        diff=e.clientX-startMove;
        nextX=this.currentX-diff;
        newX=nextX<0?0:(nextX>11125)?11125:nextX;
        container.scrollLeft=newX;
    },

    // method for jumping to a new time
    time: function(x) {
        var newtime=(x<5?5:x>85?85:x);
        var newX=(newtime*scaleECG)-(scaleECG*10/2)
        container.scrollLeft=newX;
        this.calcX();
    },

    // method for updating stored x position with real-time x position
    calcX: function() {
        var newX=container.scrollLeft;
        this.currentX=newX;
        oTime.setRange();
        return ((newX+(scaleECG*10/2))/scaleECG);
    }
};

function oStrip(xpos) {
    // Constructor for a strip object
    var me=this;

    // Create the strip overlay node
    var nStrip=document.createElement("DIV");   // The visible strip window
    nStrip.className="strip";
    nStrip.style.left=xpos+"px";
    nStrip.id="strip"+xpos;
    oGrid.node.appendChild(nStrip);
    var screen=document.createElement("DIV");   // background screen
    nStrip.appendChild(screen);


    this.node=nStrip;   // strip node
    this.strip=true;    // flag that this is a strip, if taken out of context
    this.currentX=xpos; // current position at start of move
    this.movable=true;  // this strip is movable or not (locked down)
    this.viewport=[];   // array of viewport overlays

    // Create the representation on the full length strip
    var fpos=xpos/(scaleECG/scaleFull), fStrip;
    for(var i=0; i<oFull.segments.length; i++) {
        fpos-=(i==0)?0:(scaleFull*30);
        fStrip=document.createElement("DIV");
        fStrip.className="strip";
        fStrip.style.left=fpos+"px";
        fStrip.id="fstrip"+fpos;
        oFull.segments[i].node.appendChild(fStrip);
        this.viewport[i]=fStrip;
    }
    
    // Method for dragging overlay
    this.move=function(e) {
        var diff=0, nextX=0, newStyle=this.currentX+"px";
        diff=e.clientX-startMove;
        nextX=this.currentX+diff;
        newStyle=nextX<0?"0px":nextX>12600?"12600px":nextX+"px";
        this.node.style.left=newStyle;
    };

    // Method for deleting overlay
    this.deleteMe=function(e) {
        e.preventDefault();

        // remove the representation on the full strip
        for(var i=0; i<me.viewport.length; i++) me.viewport[i].parentNode.removeChild(me.viewport[i]);

        var prop=me.node.id;
        me.node.parentNode.removeChild(me.node);        // remove the strip node
        if(oAction.current=oStrips[prop]) oAction.current=oGrid;    // make the main grid the actionable item
        delete oAction.heir[prop];                      // remove the strip from heirarchy array
        delete oStrips[prop];                           // remove the strip from strips array
    };

    // Method for finalizing a strip's position
    this.lockDown=function(e) {
        me.movable=false;
        me.node.className="strip locked";
        for(var i=0; i<me.viewport.length; i++) me.viewport[i].className="strip locked";
        oAction.current=getCurrent();
    };

    // Method for updating the stored x position with the real-time x position
    this.calcX=function() {
        this.currentX=Number(this.node.style.left.replace("px",""));
        // update position of full strip representations
        var fpos=this.currentX/(scaleECG/scaleFull);
        for(var i=0; i<me.viewport.length; i++) {
            fpos-=(i==0)?0:(scaleFull*30);
            me.viewport[i].style.left=fpos+"px";
        }
    };

    // Add the strip deletion link
    var delStrip=document.createElement("A");
    delStrip.className="delete";
    delStrip.appendChild(document.createTextNode("X"));
    nStrip.appendChild(delStrip);

    // Add the strip lockdown link
    var lockStrip=document.createElement("A");
    lockStrip.className="lock";
    lockStrip.appendChild(document.createTextNode("L"));
    nStrip.appendChild(lockStrip);

    // Add listeners
    delStrip.addEventListener("click",me.deleteMe);
    lockStrip.addEventListener("click",me.lockDown);
    me.node.addEventListener("mouseenter",actionable);
    me.node.addEventListener("mouseleave",unactionable);
};

function oCal(xpos){
    // Constructor for a caliper object
    var me=this;
    var startWidth=0;
    var scale=8;

    // Create the caliper overlay node
    var nCal=document.createElement("DIV");
    nCal.className="caliper";
    nCal.style.left=xpos+"px";
    nCal.id="cal"+xpos;
    nCal.style.width=startWidth+"px";
    oGrid.node.appendChild(nCal);

    // Create the measurement display
    var nContainer=document.createElement("DIV");       // container for data
    var nBPM=document.createElement("SPAN");            // isolated bpm number
    var nMS=document.createElement("SPAN");             // isolated ms number
    nBPM.appendChild(document.createTextNode(startWidth==0?"--":Math.round(600000/((startWidth)*scale))/10));
    nMS.appendChild(document.createTextNode(Math.round((startWidth)*scale)));
    var nData=document.createElement("P");              // container for text
    nContainer.className="measurement";
    nData.appendChild(nMS);
    nData.appendChild(document.createTextNode(" ms"));
    nData.appendChild(document.createElement("BR"));
    nData.appendChild(nBPM);
    nData.appendChild(document.createTextNode(" bpm"));
    nContainer.appendChild(nData);
    nCal.appendChild(nContainer);

    this.node=nCal;         // caliper node
    this.ms=nMS;            // ms display
    this.bpm=nBPM;          // bpm display
    this.caliper=true;      // flag that this is a caliper, if taken out of context
    this.currentX=xpos;     // current position at start of move
    this.currentWidth=startWidth;    // last-saved current width of caliper overlay
    this.startWidth=startWidth;      // starting width of caliper overlay
    this.scale=scale;       // pixels-to-seconds scale of x axis

    // Create the left and right handles
    this.lHandle=new oCalHandle(this,xpos,"left");
    this.rHandle=new oCalHandle(this,xpos,"right");
    oCalHandles["cal"+xpos+"left"]=this.lHandle;
    oCalHandles["cal"+xpos+"right"]=this.rHandle;

    // Set the right handle as the current drag object
    // (can drag handle without creating a second click first)
    oAction.current=this.rHandle;

    // Method for moving the left placement/handle
    this.move=function(e) {
        var diff=0, nextX=0, newStyle=this.currentX+"px";
        var limit=this.currentX+this.currentWidth-this.startWidth;
        diff=e.clientX-startMove;
        nextX=this.currentX+diff;
        newStyle=nextX<0?"0px":nextX>=limit?limit+"px":nextX+"px";
        this.node.style.left=newStyle;
    };

    // Method for deleting caliper
    this.deleteMe=function(e) {
        e.preventDefault();
        var prop=me.node.id;
        
        delete oCalHandles[prop+"left"];      // remove handle objects
        delete oCalHandles[prop+"right"];     // remove handle objects
        me.node.parentNode.removeChild(me.node);        // remove main caliper node
        if(oAction.current=oCals[prop]) oAction.current=oGrid;      // set main grid to current actionable item
        delete oAction.heir[prop];            // remove caliper from heirarchy array
        delete oCals[prop];                   // remove caliper from calipers array
    };

    // Method for cleaning up after a move
    this.calcX=function() {
        this.currentX=Number(this.node.style.left.replace("px","")); 
        this.currentWidth=Number(this.node.style.width.replace("px","")); 
    };

    // Add the caliper deletion link
    var delCal=document.createElement("A");
    delCal.className="delete";
    delCal.appendChild(document.createTextNode("X"));
    nCal.appendChild(delCal);
    delCal.addEventListener("click",me.deleteMe);

};

function oCalHandle(cal,xpos,type) {
    // constructor for a caliper handle object
    var me=this;
    this.caliper=cal;   // the parent caliper
    this.type=type;     // left or right handle

    // create the handle nodes
    var nHandle=document.createElement("DIV");  // the handle
    nHandle.id="cal"+xpos+type;
    nHandle.className="handle "+type;
    cal.node.appendChild(nHandle);
    var screen=document.createElement("DIV");   // the screen
    nHandle.appendChild(screen);

    this.node=nHandle;

    // create the movement methods
    this.move=function(e) {
        var diff=0, nextW=0, finalW=0, newWidth=this.caliper.currentWidth+"px";
        switch(me.type) {
        case "left":
            me.caliper.move(e);     // reference parent caliper method to adjust left position
            diff=e.clientX-startMove;
            nextW=this.caliper.currentWidth-diff;
            finalW=nextW<me.caliper.startWidth?me.caliper.startWidth:nextW;
            newWidth=finalW+"px";
            this.caliper.node.style.width=newWidth;
            break;
        case "right":
            diff=e.clientX-startMove;
            nextW=this.caliper.currentWidth+diff;
            finalW=nextW<me.caliper.startWidth?me.caliper.startWidth:nextW;
            newWidth=nextW<me.caliper.startWidth?me.caliper.startWidth+"px":nextW+"px";
            this.caliper.node.style.width=newWidth;
            break;
        }

        // refresh measurements display based on new width
        this.caliper.ms.innerHTML=Math.round((finalW+2)*this.caliper.scale);
        this.caliper.bpm.innerHTML=finalW==0?"--":Math.round(600000/((finalW+2)*this.caliper.scale))/10;
    }

    // add listeners
    nHandle.addEventListener("mouseenter",actionable);
    nHandle.addEventListener("mouseleave",unactionable);
};

function oSegment(number) {
    var me=this;
    this.ind=number;
    this.currentX=-(number*960);
    this.node=oFull.node.children[number];
    var nView=document.createElement("DIV");
    nView.className="viewport";
    nView.style.left=this.currentX+"px";
    this.node.appendChild(nView);
    this.viewport=nView;

    // method to jump to a new time
    this.time=function(x) {
        var newtime=x<5?5:x>85?85:x;
        var newX=(newtime*scaleFull)-(scaleFull*10/2);
        newX-=(me.ind*scaleFull*30);
        me.viewport.style.left=newX+"px";
        me.currentX=newX;
    }

    // add click listener
    this.node.addEventListener("click",function(e) {
        e.preventDefault();
        var posX=e.clientX-fullcontainerOffsetX;
        posX+=(me.ind*scaleFull*30);
        var timeX=posX/scaleFull;
        oTime.changeTime(timeX,"full");
    });

    return this;
}

checktype=function(e) {
    // This function checks for key-click pairs
    e.preventDefault();

    // in case there is a move, record the start position of the cursor and of the grid
    startMove=e.clientX;
    oAction.gridX=Number(grid.style.left.replace("px",""));

    if(e.ctrlKey) {
        // control key down: create strip
        posX=e.clientX-containerOffsetX+container.scrollLeft;
        if(posX>12600) posX=12600;
        oStrips["strip"+posX]=new oStrip(posX);
    } else if(e.altKey) {
        // alt key down: create caliper
        oClick.caliper=true;
        posX=e.clientX-containerOffsetX+container.scrollLeft;
        oCals["cal"+posX]=new oCal(posX);
        oClick.move=true;
    } else {
        // no key down: prepare a move
        oClick.move=true;
        oClick.down=true;
    }
};

actionable=function(e) {
    // This function places actionable elements into oAction
    var node=e.target;
    if(node.id=="grid") {
        // cursor is over the grid
        oClick.offGrid=false;
        if(oAction.intval) {
            // if current off-grid movement, cancel it
            startMove=e.clientX;
            resetOffGrid(oAction.current);
        }
    }
    oAction.heir[node.id]=true;
    if(!oClick.move) oAction.current=getCurrent();
}

unactionable=function(e) {
    // This function removes actionable elements from oAction
    var node=e.target;
    oAction.heir[node.id]=false;
    if(oClick.move && node.id=="grid" && oAction.current.strip && (e.clientX<containerOffsetX || e.clientX>(containerOffsetX+850))) {
        // if a current move is going on and have left the grid, initiate an off-grid move
        oClick.offGrid=true;
        offGridMove(10,e.clientX<containerOffsetX);
    } else if(!oClick.move) oAction.current=getCurrent();
};

getCurrent=function() {
    // This function determines the heirarchy of movable objects
    var aStrips=[], aCals=[], aList=[];
    if(oAction.heir["grid"]) aList.push(oGrid);
    // iterate over all moused-over elements
    for(var prop in oAction.heir) {
        if(oAction.heir[prop] && prop.indexOf("strip")==0) aStrips.push(prop);
        else if(oAction.heir[prop] && prop.indexOf("cal")==0) aCals.push(prop);
    }
    // iterate over strips and add to master list
    for(var i=0; i<aStrips.length; i++) {
        if(oStrips[aStrips[i]].movable) aList.push(oStrips[aStrips[i]]);
    }
    // iterate over calipers and add to master list
    for(i=0; i<aCals.length; i++) {
        aList.push(oCalHandles[aCals[i]]);
    }

    if(aList.length>0) return aList[aList.length-1];
    else return false;
};

moveitem=function(e) {
    // method to move a grabbed object
    if(!oClick.move) return false;
    else if(oClick.offGrid && oAction.current!==oGrid) {
        // if there is a current off-grid move, nothing
        // console.log("Off-grid!");
    }
    // use the move method of the current element
    else oAction.current.move(e);
};

endmove=function(e) {
    // method to clean up after a move ends
    if(oAction.intval) resetOffGrid(oAction.current);
    for (var i in oClick) oClick[i]=false;
    var newTime=oGrid.calcX();
    for(i in oStrips) oStrips[i].calcX();
    for(i in oCals) oCals[i].calcX();
    
    // send time change
    oTime.changeTime(newTime,"grid");
};

offGridMove=function(dist,dir) {
    // This function does an off-grid move
    var px=dist, x=dir;
    var obj=oAction.current.node.style;
    var objX=Number(obj.left.replace("px",""));
    var gridX=container.scrollLeft;
    console.log(gridX);

    // set interval to move node dist pixels
    oAction.intval=setInterval(moveXpixels, 20);

    function moveXpixels() {
        // advances object by dist pixels
        objX=x?objX-=px:objX+=px;
        gridX=x?gridX-=px:gridX+=px;
        if(gridX>(scaleECG*80)) gridX=(scaleECG*80);
        if(gridX<0) gridX=0;
        if(objX>(scaleECG*84)) objX=(scaleECG*84);
        if(objX<0) objX=0;
        container.scrollLeft=gridX;
        obj.left=objX+"px";
        oAction.current.currentX=objX;

        return false;
    };
};

resetOffGrid=function(oItem) {
    // method to clean up after an off-grid move
    clearInterval(oAction.intval);
    oAction.intval=false;
}

// set up full length segments
for(var i=0; i<oFull.node.children.length; i++) {
    oFull.segments[i]=new oSegment(i);
}

// Create time range
oTime.setRange();

// add listeners
grid.addEventListener("mouseenter",actionable);
grid.addEventListener("mouseleave",unactionable);
body.addEventListener("mousemove",moveitem);
grid.addEventListener("mousedown",checktype);
body.addEventListener("mouseup",endmove);

