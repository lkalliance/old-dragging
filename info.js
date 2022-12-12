var info=function() {
    // This constructor contains all methods, properties and local variables
    // for a single instance of the tabbed info set;

    var me=this;
    var tabset;

    var container=document.getElementById("info");


    this.init=function(params) {
        // Do all setup tasks

        // First create the tabset
        tabset=new base.tabset(container);
        tabset.tabs[0].activate();

    };


};

