// MODULE FILE FOR TOP-LEVEL CODE



// CLASS MANIPULATION FUNCTIONS

function addClass(node, add) {
    var currClass=node.className;
    var pieces=currClass.split(" ");
    var found=false;
    var newClass="";

    for(var i=0; i<pieces.length; i++) {
        if(pieces[i]==add) found=true;
    }

    newClass=found?currClass:(currClass+" "+add);
    node.className=newClass;
};

function removeClass(node,rem) {
    var currClass=node.className;
    var pieces=currClass.split(" ");
    var newClass="";

    for(var i=0; i<pieces.length; i++) {
        if(pieces[i]!== rem) newClass+=pieces[i];
        if(i<(pieces.length-1)) newClass+=" ";
    }

    node.className=newClass;
};

function switchClass(node,old,rep) {
    var currClass=node.className;
    var pieces=currClass.split(" ");
    var newClass="";
    var switched=false;

    for(var i=0; i<pieces.length; i++) {
        if(pieces[i]==rep) {
            switched=true;
        } else if(pieces[i]==old && !switched) {
            if(newClass.length>0) newClass+=" ";
            newClass+=rep;
            switched=true;
        } else if(pieces[i]!==old) {
            if(newClass.length>0) newClass+=" ";
            newClass+=pieces[i];
        }
    }
    if(!switched) newClass+=(" "+rep);

    node.className=newClass;
};


// ELEMENT CREATION FUNCTIONS

function nCreate(type,id,html,className,link) {
    var node=document.createElement(type);
    node.innerHTML=html?html:"";
    node.className=className?className:"";
    if(type=="A" && link) node.href=link;
    if(id) node.id=id;

    return node;
}


