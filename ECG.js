var ecg=function() {
    // This constructor contains all methods, properties and local variables
    // for the main ECG module; including properties governing strip overlays
    // and calipers

    var me=this;

    var oClick={ move: false, down: false, offGrid: false };                // Tracks current state        
    var oAction={heir:{grid: false},current:false,gridX:0,intval:false};    // Tracks what is the current actionable object.

    this.strips={};              // contains all strips added to the grid
    this.cals={};                // contains all calipers added to the grid
    this.calHandles={};          // contains all caliper drag handles added to the grid

    // collect DOM nodes for later reference
    var grid=document.getElementById("grid"),
        container=document.getElementById("ecg"),
        outer=document.getElementById("outercontainer");
        windowStart=document.getElementById("windowStart"),
        windowEnd=document.getElementById("windowEnd");

    var startMove=0;                    // holds x position of the cursor at the start of a move
    var containerOffset={               // holds the x,y offset of the main ECG container within the browser window
        x: container.offsetLeft+Number(window.getComputedStyle(container,null).getPropertyValue("border-left-width").replace("px","")),
        y: container.offsetTop+Number(window.getComputedStyle(container,null).getPropertyValue("border-top-width").replace("px",""))
    };
           
    // var containerOffsetX=container.offsetLeft+Number(window.getComputedStyle(container,null).getPropertyValue("border-left-width").replace("px",""));   // holds the x-offset of the main ECG container within the browser window



    this.time=function(x) {
        // function to jump to a new time received from base (center of viewport)
        var newtime=(x<5?5:x>85?85:x);
        var newX=(newtime*scaleECG)-(scaleECG*10/2)
        container.scrollLeft=newX;
        me.grid.calcX();
        me.setRange(x);
    };

    this.datestamp=function(data) {
        // Receives a date object and uses it to set the range data
        year=data.getFullYear();
        month=data.getMonth();
        day=data.getDate();
        hour=data.getHours();
        min=data.getMinutes();
        sec=data.getSeconds();
        ms=data.getMilliseconds();
        me.setRange();
    };


    this.plot=function(data) {
        // Receives ECG data, clears and redraws ECG
        var ecg=data.ecg
        var x=0;
        var canvas=document.getElementById("ecgcan");
        var context=canvas.getContext("2d");

        // Now clear the existing data
        context.clearRect(0,0,canvas.width,canvas.height)

        // Now write the new data
        context.beginPath();

        for(var i=1; i<ecg.length; i++) {
            context.lineTo(x,ecg[i]);
            x+=1;
        }

        context.lineWidth=1.5;
        context.strokeStyle="#ffffff";
        context.stroke();

        // Now set the daterange
        me.datestamp(ecg[0].start);

        // Now set the time to the beginning of the strip
        base.distribute(5,"time");
    };


    this.setRange=function() {
        // function to recreate labels showing begin and end time of viewport,
        // based on relative position of strip container to viewport

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
        var newend=new Date(year,month,day,hour,min,sec,(newms+10000));
    
        // Construct the new labels
        var days=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        var labelstart="", labelend="";
    
        // (Dates)
        labelstart+=(days[newstart.getDay()]+", ");
        labelstart+=((newstart.getMonth()+1)+"/");
        labelstart+=(newstart.getDate()+"/");
        labelstart+=(newstart.getFullYear()+" ");
        labelend+=(days[newend.getDay()]+", ");
        labelend+=((newend.getMonth()+1)+"/");
        labelend+=(newend.getDate()+"/");
        labelend+=(newend.getFullYear()+" ");
    
        // (Times)
        labelstart+=timeBuild(newstart);
        labelend+=timeBuild(newend);
    
        windowStart.innerHTML=labelstart;
        windowEnd.innerHTML=labelend;
    
    };


    this.grid={
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

            // propagate action to other handlers
            base.distribute(nextX,"segment",me,{scale:"ecg",edge:"left"});
        },

        // setting the currentX to live setting
        calcX: function(e) {
            this.currentX=container.scrollLeft;
        }
    };



    function xCalc() {
        // Return the new master time based on current grid position
        var t=container.scrollLeft;         // starts as number of pixels to left of viewport
        t+=(5*scaleECG);                    // add five seconds' worth of pixels to middle
        t=t/scaleECG;                       // convert pixels to number of seconds
        return t;
    };

    
    this.init=function() {
        // Do all setup tasks
        base.getData("ECG","plot");
    };


    function oStrip(xpos) {
        // Constructor for a strip object
        var strip=this;
    
        // Create the strip overlay node
        var nStrip=document.createElement("DIV");   // The visible strip window
        nStrip.className="strip";
        nStrip.style.left=xpos+"px";
        nStrip.id="strip"+xpos;
        me.grid.node.appendChild(nStrip);
        var screen=document.createElement("DIV");   // background screen
        screen.className="screen";
        nStrip.appendChild(screen);
        var anote=document.createElement("A");  // Div that contains an entered note
        anote.className="note";
        nStrip.appendChild(anote);
        anote.addEventListener("click", function(e) { e.preventDefault(); })
    
        this.node=nStrip;            // strip node
        this.strip=true;             // flag that this is a strip, if taken out of context
        this.id=xpos;                // identifier to pass along to other scripts
        this.currentX=xpos;          // current position at start of move
        this.movable=true;           // this strip is movable or not (locked down)
        this.viewport=[];            // array of viewport overlays
        this.popup=null;             // holder for any popup that is created
        this.stripnote=null;         // holder for any text saved with this strip
        this.stripattach=anote;    // node that contains a note for this strip

        // Define the settings to create a pop-up on rightclick
        var popsettings={
            elements:[
                {type:"bigtext", id:"note", label:"Notes", content: null},
                {type:"button", label:"Submit", action:"submit"},
                {type:"button", label:"Cancel", action:"cancel"}
            ],
            foc: "note"
        };

        // Create a function to add or remove as a listener
        var addpop=function(e) {
            e.preventDefault();
            if(strip.popup) { strip.popup.dismiss(); }      // if there's already a popup, dismiss it without submitting
            strip.note(e);         // send the x-y coordinates of the click, relative to the window
        }

        // Capture the right click to insert popup
        this.node.addEventListener("contextmenu",addpop);
    
        // Method for dragging overlay
        this.move=function(e) {
            var diff=0, nextX=0, newStyle;
            diff=e.clientX-startMove;
            nextX=strip.currentX+diff;
            nextX=nextX<0?0:nextX>12600?12600:nextX;
            newStyle=nextX+"px";
            this.node.style.left=newStyle;

            // propagate to other handlers
            base.distribute(strip.id,"strip",me,{action: "move", newx: nextX});
        };
    
        // Method for deleting overlay
        this.deleteMe=function(e) {
            e.preventDefault();

            if(strip.popup) { strip.popup.dismiss(); }          // eliminate a popup if one is showing
    
            var prop=strip.node.id;
            strip.node.parentNode.removeChild(strip.node);        // remove the strip node
            if(oAction.current=me.strips[prop]) oAction.current=me.grid;    // make the main grid the actionable item
            delete oAction.heir[prop];                      // remove the strip from heirarchy array
            delete me.strips[prop];                           // remove the strip from strips array

            base.distribute(strip.id,"strip",me,{action: "delete"});
        };

        // Method for asking for a pop-up
        this.note=function(e) {
            var coordinates={x: e.clientX, y: e.clientY};
            if (strip.stripnote) popsettings.elements[0].content=strip.stripnote;
            strip.popup=new base.popup(coordinates,popsettings,strip);
            // strip.lockDown();
        };

        // Method for processing the data that is returned by a popup
        this.popreturn=function(data) {
            // "data" is the object returned by the popup
            if(data.result=="cancel") {
                console.log("Popup cancelled!");
            } else {
                // If data was submitted, lock down the strip and record the note
                strip.lockDown();
                strip.stripattach.innerHTML="NOTE";
                strip.stripattach.title=data.note;

                strip.stripnote=data.note;      // save the text of the note

                // swap listeners: remove listener from strip and add to note text for editing.
                strip.node.removeEventListener("contextmenu",addpop);
                strip.stripattach.addEventListener("click",addpop);
            }

            // The popup will have been dismissed by its object;
            // clear its reference
            strip.popup=null;
        };
    
        // Method for locking down the strip
        this.lockDown=function() {
            strip.movable=false;
            strip.node.className="strip locked";
            oAction.current=getCurrent();

            // Send lock to other handlers
            base.distribute(strip.id,"strip",me,{action: "lock"});
        };
    
        // Method for updating the stored x position with the real-time x position
        this.calcX=function() {
            this.currentX=Number(this.node.style.left.replace("px",""));
        };
    
        // Add the strip deletion link
        var delStrip=document.createElement("A");
        delStrip.className="delete";
        delStrip.appendChild(document.createTextNode("X"));
        nStrip.appendChild(delStrip);
    
        // Add the strip lockdown link
        // var lockStrip=document.createElement("A");
        // lockStrip.className="lock";
        // lockStrip.appendChild(document.createTextNode("L"));
        // nStrip.appendChild(lockStrip);
    
        // Add listeners
        delStrip.addEventListener("click",strip.deleteMe);
        // lockStrip.addEventListener("click",strip.lockDown);
        strip.node.addEventListener("mouseenter",actionable);
        strip.node.addEventListener("mouseleave",unactionable);

        // propagate to other handlers
        base.distribute(xpos,"strip",me,{action: "create"});
    };


    
    function oCal(xpos){
        // Constructor for a caliper object
        var cal=this;
        var startWidth=0;
        var scale=8;
    
        // Create the caliper overlay node
        var nCal=document.createElement("DIV");
        nCal.className="caliper";
        nCal.style.left=xpos+"px";
        nCal.id="cal"+xpos;
        nCal.style.width=startWidth+"px";
        me.grid.node.appendChild(nCal);
    
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
        me.calHandles["cal"+xpos+"left"]=this.lHandle;
        me.calHandles["cal"+xpos+"right"]=this.rHandle;
    
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
            var prop=cal.node.id;
            
            delete me.calHandles[prop+"left"];      // remove handle objects
            delete me.calHandles[prop+"right"];     // remove handle objects
            cal.node.parentNode.removeChild(cal.node);        // remove main caliper node
            if(oAction.current=me.cals[prop]) oAction.current=me.grid;      // set main grid to current actionable item
            delete oAction.heir[prop];            // remove caliper from heirarchy array
            delete me.cals[prop];                   // remove caliper from calipers array
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
        delCal.addEventListener("click",cal.deleteMe);
    
    };

    
    function oCalHandle(cal,xpos,type) {
        // constructor for a caliper handle object
        var handle=this;
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
            switch(handle.type) {
            case "left":
                handle.caliper.move(e);     // reference parent caliper method to adjust left position
                diff=e.clientX-startMove;
                nextW=handle.caliper.currentWidth-diff;
                finalW=nextW<handle.caliper.startWidth?handle.caliper.startWidth:nextW;
                newWidth=finalW+"px";
                handle.caliper.node.style.width=newWidth;
                break;
            case "right":
                diff=e.clientX-startMove;
                nextW=this.caliper.currentWidth+diff;
                finalW=nextW<handle.caliper.startWidth?handle.caliper.startWidth:nextW;
                newWidth=nextW<handle.caliper.startWidth?handle.caliper.startWidth+"px":nextW+"px";
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
    
    
    var checktype=function(e) {
        // This function checks for key-click pairs
        e.preventDefault();
    
        // in case there is a move, record the start position of the cursor and of the grid
        startMove=e.clientX;
        oAction.gridX=Number(grid.style.left.replace("px",""));
    
        if(e.ctrlKey) {
            // control key down: create strip
            posX=e.clientX-containerOffset.x+container.scrollLeft;
            if(posX>12600) posX=12600;
            me.strips["strip"+posX]=new oStrip(posX);
        } else if(e.altKey) {
            // alt key down: create caliper
            oClick.caliper=true;
            posX=e.clientX-containerOffset.x+container.scrollLeft;
            me.cals["cal"+posX]=new oCal(posX);
            oClick.move=true;
        } else {
            // no key down: prepare a move
            oClick.move=true;
            oClick.down=true;
        }
    };
    
    var actionable=function(e) {
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
    };
    
    var unactionable=function(e) {
        // This function removes actionable elements from oAction
        var node=e.target;
        oAction.heir[node.id]=false;
        if(oClick.move && node.id=="grid" && oAction.current.strip && (e.clientX<containerOffset.x || e.clientX>(containerOffset.x+850))) {
            // if a current move is going on and have left the grid, initiate an off-grid move
            oClick.offGrid=true;
            offGridMove(10,e.clientX<containerOffset.x);
        } else if(!oClick.move) oAction.current=getCurrent();
    };
    
    var getCurrent=function() {
        // This function determines the heirarchy of movable objects
        var aStrips=[], aCals=[], aList=[];
        if(oAction.heir["grid"]) aList.push(me.grid);
        // iterate over all moused-over elements
        for(var prop in oAction.heir) {
            if(oAction.heir[prop] && prop.indexOf("strip")==0) aStrips.push(prop);
            else if(oAction.heir[prop] && prop.indexOf("cal")==0) aCals.push(prop);
        }
        // iterate over strips and add to master list
        for(var i=0; i<aStrips.length; i++) {
            if(me.strips[aStrips[i]].movable) aList.push(me.strips[aStrips[i]]);
        }
        // iterate over calipers and add to master list
        for(i=0; i<aCals.length; i++) {
            aList.push(me.calHandles[aCals[i]]);
        }
    
        if(aList.length>0) return aList[aList.length-1];
        else return false;
    };
    
    var moveitem=function(e) {
        // method to move a grabbed object
        if(!oClick.move) return false;
//        else if(oClick.offGrid && oAction.current!==me.grid) {
            // if there is a current off-grid move, nothing
            // console.log("Off-grid!");
//        }
        // use the move method of the current element
        else oAction.current.move(e);
    };
    
    var endmove=function(e) {
        // Method to clean up after a move ends
//        if(oAction.intval) resetOffGrid(oAction.current);
        for (var i in oClick) oClick[i]=false;
        var newTime=xCalc();
        for(i in me.strips) me.strips[i].calcX();
        for(i in me.cals) me.cals[i].calcX();
        me.grid.calcX();
        
        // Send new x coordinate to master timekeeper
        base.distribute(newTime,"time",me);

        // Update the date range
        me.setRange();
    };



















    
    var offGridMove=function(dist,dir) {
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
    
    var resetOffGrid=function(oItem) {
        // method to clean up after an off-grid move
        clearInterval(oAction.intval);
        oAction.intval=false;
    };
    
    // set up full length segments
/*    for(var i=0; i<this.full.node.children.length; i++) {
        this.full.segments[i]=new oSegment(i);
    } */















    
    
    // add listeners
    grid.addEventListener("mouseenter",actionable);
    grid.addEventListener("mouseleave",unactionable);
    body.addEventListener("mousemove",moveitem);
    grid.addEventListener("mousedown",checktype);
    body.addEventListener("mouseup",endmove);
    

    return this;
}
