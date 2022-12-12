// GLOBAL HOLDERS

var year, month, day, hour, min, sec, ms, scaleFull, scaleECG, ECGid;

// BASE DEFINITIONS AND FUNCTIONS

var body=document.body


// ALTER A NODE'S CLASSES
function classJuggler(node,changes) {
    // {node} is the node to evaluate
    // {changes] is an object with classes to be removed or added

    var newClass="", oClasses={};

    // Turn existing classes into an object
    var currClass=node.className;
    var pieces=currClass.split(" ");
    for(var piece in pieces) oClasses[pieces[piece].toLowerCase()]=true;

    // Iterate over changes and alter object
    for(var change in changes) {
        if(changes[change]=="remove") oClasses[change.toLowerCase()]=false;
        else if(changes[change]=="add" && !oClasses[change.toLowerCase()]) oClasses[change.toLowerCase()]=true;
    }

    // Recreate classes with altered object
    for(var clas in oClasses) {
        if(newClass.length>0 && newClass[newClass.length-1]!==" ") newClass+=" ";
        if(oClasses[clas]) newClass+=clas;
    }

    return newClass;
}


var main=function(scale,fullscale) {
    // Constructor of core object
    // scale is the pixels-per-second scale of the main ECG,
    // fullscale is the pixels-per-second scale of the full-length ECG

    // Populate global variables
    var datestart=new Date();
    year=datestart.getFullYear();
    month=datestart.getMonth();
    day=datestart.getDate();
    hour=datestart.getHours();
    min=datestart.getMinutes();
    sec=datestart.getSeconds();
    ms=datestart.getMilliseconds();

    scaleECG=scale?scale:125;
    scaleFull=fullscale?fullscale:32;

    var mods={
        ecg:typeof(ecg)=="function"?ecg:false,
        fullecg:typeof(fullecg)=="function"?fullecg:false,
        directory:typeof(directory)=="function"?directory:false,
        info:typeof(info)=="function"?info:false
    };

    var oModules={};        // object containing the page's registered modules
        aTimes=[];          // array containing references to each member of oModule with a time
        aPlots=[];          // array containing references to each member of oModule with an ECG plot
        aDates=[];          // array containing references to each member of oModule with a date handler
        aStrips=[];         // array containing references to each member of oModule with a strip handler
        aDir=[];            // array containing references to each member of oModule with a directory handler
        aSegs=[];           // array containing references to each member of oModule with a segments handler

    var oLists={            // object containing references to all the array lists, for efficient reference
        time:aTimes,
        plot:aPlots,
        datestamp:aDates,
        strip:aStrips,
        direc:aDir,
        segment:aSegs
    };

    function registerMod(mod) {
        var obj=new mods[mod];
        if(obj.time) aTimes.push(mod);
        if(obj.plot) aPlots.push(mod);
        if(obj.datestamp) aDates.push(mod);
        if(obj.strip) aStrips.push(mod);
        if(obj.direc) aDir.push(mod);
        if(obj.segment) aSegs.push(mod);
        oModules[mod]=obj;
    };

    this.time=5;           // current cursor position in seconds from beginning of ECG

    this.distribute=function(x, type, exclude, params) {
        // send data to other handlers
        // x is the data to send, type is the type of handler,
        // params is an object to pass along, exclude is a module to not send to

        var obj=params?params:null;
        var list=oLists[type];

        for (var i=0; i<list.length; i++) {
            if(oModules[list[i]]!==exclude) oModules[list[i]][type](x,obj);
        }

        if (type=="time") { this.time=x; }
    }


    this.init=function(params) {
        // Do all setup tasks

        var obj=params?params:{};

        // Register modules
        for(var elem in mods) {
            if(mods[elem]&&document.getElementById(elem)) {
                registerMod(elem);
            }
        }

        // Run all inits
        for(var mod in oModules) {
            oModules[mod].init(obj);
        }

    };

    this.getData=function(type, handler, exclude, params) {
        // Get data from AJAX call.
        // "type" is call type; "handler" is which object handler;
        // "params" is data to be passed to handler with the return
        // (Note: at the moment, no AJAX call yet, just faked data

        var data={};                    // container for returned data
        var obj=params?params:null;

        // make request and receive data
        switch (type) {
        case "startdate":
            data.year=2015;
            data.month=4;
            data.day=23;
            data.hour=0;
            data.minute=12;
            data.second=53;
            data.ms=12;
            break;
        case "ECG":
            var address;
            if(obj) { address=obj.ecg; } 
            else { address=window.location.search?window.location.search.split("=")[1]:0; }
            data.ecg=ecgdata[address];
            ECGid=address;
            break;
        case "directory":
            data.segments=linkdata;
        default:
            data.returned=null;
        }

        var list=oLists[handler];

        // send data to all but excluded handler
        for (var i=0; i<list.length; i++) {
            if(oModules[list[i]]!==exclude) oModules[list[i]][handler](data,obj);
        }

        return false;
    };


    this.tabset=function(container) {
        // Constructor for a tabset
        var me=this;

        this.node=container;        // Outer container for tab triggers and content
        this.node.className="tabset";
        this.tabs=[];               // Array of all tab objects for this tabset

        // Collect all the links in the main container, then create tab objects
        var triggers=this.node.getElementsByTagName("A");
        for (var i=0; i<triggers.length; i++) {
            this.tabs[i]=new oTab(triggers[i]);
        }


        function oTab(trigger) {
            // Constructor for a single tab
            var tab=this;
            this.node=trigger.parentNode;               // The container for the trigger-content pair
            this.trigger=trigger;                       // The trigger for this tab
                                                        
            // identify the content div
            this.content=this.trigger.nextSibling;
            while (this.content.tagName!=="DIV") {
                this.content=this.content.nextSibling;
            }

            this.content.className="content";

            this.activate=function() {
                tab.node.className="active";
            }

            this.inactive=function() {
                tab.node.className="";
            }
            
            // Add a listner for clicks on the trigger
            this.trigger.addEventListener("click",function(e) {
                e.preventDefault();
                for(var i=0; i<me.tabs.length; i++) {
                    if(me.tabs[i]==tab) { me.tabs[i].activate(); }
                    else { me.tabs[i].inactive(); }
                }
            }
            );

            return this;
        }

        return this;
    };


    this.popup=function(xy,obj,callback) {
        // Constructor for a custom pop-up
        // "xy" is an object with x-y coordinates. "obj" holds the parameters for the popup.
        // "callback" is the object with a "popup" response to which to send input.

        var popup=this;
        this.respond=callback;       // locally store the callback object

        // Create and position the container div
        var pop=document.createElement("DIV");
        pop.className="popup";
        pop.style.top=xy?xy.y+"px":"0px";
        pop.style.left=xy?xy.x+"px":"0px";

        this.xpos=xy.x;             // starting position of the popup

        // Examine the parameters and build the form
        var form=document.createElement("FORM");
        var elem, item, label;
        for(var i=0; i<obj.elements.length; i++) {
            item=obj.elements[i];
            switch(item.type) {
            case "bigtext":
                elem=document.createElement("TEXTAREA");
                elem.name=item.id;
                elem.id=item.id;
                if(item.label) {
                    label=document.createElement("LABEL");
                    label.innerHTML=item.label;
                    label.htmlFor=item.id;
                    form.appendChild(label);
                }
                if(item.content) elem.innerHTML=item.content;
                break;
            case "button":
                elem=document.createElement("BUTTON");
                elem.innerHTML=item.label;
                elem.id=item.action;
                // Add a listener
                elem.addEventListener("click",function(e) {
                    e.preventDefault();
                    popup.clicked({result:e.target.id});
                    });
                break;
            default:
                console.log("No element");
            }
            if(item.style) elem.className=item.style;
            form.appendChild(elem);
        }

        pop.appendChild(form);
        body.appendChild(pop);
        this.node=pop;

        // if focus has been requested, apply it
        if(obj.foc) {
            document.getElementById(obj.foc).focus();
            document.getElementById(obj.foc).select();
        }

        this.clicked=function(inp) {
            // One of the buttons has been clicked. Either dismiss
            // or send data. "inp" is an object with the status/data
            // to send.

            var data={};           // return object to send to callback
            if(inp.result=="cancel") {
                data.result="cancel";
            } else {
                data.result="submit";
                for (var i=0; i<form.elements.length; i++) {
                    // iterate through form's elements, and attach results to return object
                    if(form.elements[i].id) data[form.elements[i].id]=form.elements[i].value;
                }
            }

            popup.respond.popreturn(data);      // send the data object to the callback
            popup.dismiss();                    // remove the popup
        };

        this.dismiss=function() {
            // Eliminate the entire pop-up
            popup.node.parentNode.removeChild(popup.node);
        };

        return this;
    }

    return this;
}
