var directory=function() {
    // This constructor contains all methods, properties and local variables
    // for a single instance of the directory of strips;
    // including properties for linking to other strips

    var me=this;

    var dir=document.getElementById("directory");


    this.init=function(params) {
        // Do all setup tasks
        if(params.directory) { dir=params.directory; }
        base.getData("directory","direc");
    };


    this.direc=function(data) {
        // Receive directory data, wipe out existing list, redraw list
        wipeList();
        createList(data.segments);
    }

    function createList(list,parent,istop) {
        // Method for drawing the directory
        // "list" is the data received, "parent" is the container node

        var par=parent?parent:dir;
        var nLI, nUL, nA;

        // Iterate over the data, and create li elements
        for(var i=0; i<list.length; i++) {
            // Create and append li node, and if it has a sub-list set it to hide the sub-list
            nLI=document.createElement("LI");
            if(list[i].below) nLI.className="hide";
            par.appendChild(nLI);

            // Create  and append link node
            nA=document.createElement("A");
            nA.innerHTML=list[i].title;
            nLI.appendChild(nA);

            if(list[i].below) {
                // If there is a sub-list, add a listener to toggle that sub-list
                nA.addEventListener("click",function(e) {
                    e.preventDefault();
                    if(e.target.parentNode.className.indexOf("hide")>=0) e.target.parentNode.className=classJuggler(e.target.parentNode,{hide: "remove", show: "add"});
                    else e.target.parentNode.className=classJuggler(e.target.parentNode,{hide: "add", show: "remove"});
                },false);
            } else if (list[i].link){
                // If there is no sub-list, add a listener to bring down data for the clicked strip
                nA.id=("link"+list[i].link);
                nA.className="link";
                if(list[i].link==ECGid) {
                    // If this link represents the current list, don't add the listener
                    nA.className=classJuggler(nA,{selected:"add"});
                    nA.addEventListener("click",function(e) { e.preventDefault(); });
                } else {
                    nA.addEventListener("click",function(e) {
                        e.preventDefault();
                        var clicked=e.target.id;
                        clicked=clicked.replace("link","");
                        base.getData("ECG","plot",null,{ecg:clicked});
                        base.getData("directory","direc");
                    });
                }
            }

            if(list[i].below) {
                // If there is a sub-list, create and append its container,
                // and re-call this function
                nUL=document.createElement("UL");
                nLI.appendChild(nUL);
                createList(list[i].below,nUL,false);
            }
        }
    };


    function wipeList() {
        // Eliminate the existing list
        while(dir.childNodes.length>0) {
            dir.removeChild(dir.firstChild);
        }
    }
};

