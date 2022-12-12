var ecgdata=[
    [{start:new Date(2015,7,7,12,30,10,0),id:1}],
    [{start:new Date(2012,11,1,5,22,33,0),id:2}],
    [{start:new Date(2013,4,29,17,01,0,0),id:3}]
]

var transition=[125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125,125];
var square=[75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,75,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175,175];

var normal=[125,125,125,124,125,123,125,125,126,126,125,125,126,127,127,127,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125,125,125,125,126,125,125,125,124,124,124,123,123,123,123,124,124,125,125,125,125,125,125,124,125,123,125,125,126,126,125,125,125,124,124,125,125,123,125,125,125,126,126,126,125,125,124,124,125,125,125,125,125,124,124,124,124,125,125,125,126,126,125,124,123,125,125,125,126,125,125,126,127,128,129,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125,124,125,125,125,125,126,125,125,125,124,124,124,123,123,123,123,124,124,125,125,125,125,125,125,124,125,123,125,125,126,126,125,125,125,124,124,125,125,123,125,125,125,126,126,126,125,125,124,124,125,125,125,125,125,124,124,124,124,125,125,125,126,126,125,124,123,125,125,125,126,125,125,126,127,128,129,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125,124,125,125,125,125,126,125,125,125,124,124,124,123,123,123,123,124,124,125,125,125,125,125,125,124,125,123,125,125,126,126,125,125,125,124,124,125,125,123,125,125,125,126,126,126,125,125,124,124,125,125,125,125,125,124,124,124,124,125,125,125,126,126,125,124,123,125,125,125,126,125,125,126,127,128,129,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125,125,125,125,124,125,123,125,125,126,126,125,125,126,127,127,127,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125,125,125,125,126,125,125,125,124,124,124,123,123,123,123,124,124,125,125,125,125,125,125,124,125,123,125,125,126,126,125,125,125,124,124,125,125,123,125,125,125,126,126,126,125,125,124,124,125,125,125,125,125,124,124,124,124,125,125,125,126,126,125,124,123,125,125,125,126,125,125,126,127,128,129,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125,124,125,125,125,125,126,125,125,125,124,124,124,123,123,123,123,124,124,125,125,125,125,125,125,124,125,123,125,125,126,126,125,125,125,124,124,125,125,123,125,125,125,126,126,126,125,125,124,124,125,125,125,125,125,124,124,124,124,125,125,125,126,126,125,124,123,125,125,125,126,125,125,126,127,128,129,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125,124,125,125,125,125,126,125,125,125,124,124,124,123,123,123,123,124,124,125,125,125,125,125,125,124,125,123,125,125,126,126,125,125,125,124,124,125,125,123,125,125,125,126,126,126,125,125,124,124,125,125,125,125,125,124,124,124,124,125,125,125,126,126,125,124,123,125,125,125,126,125,125,126,127,128,129,125,120,110,101,92,80,70,76,81,91,100,105,110,115,118,122,123,123,124,125];
var tachy=[125,125,124,120,120,130,145,175,190,192,178,175,150,140,110,95,60,50,45,80,125,124,123,125,126,125,125,126,125,125,124,124,125,128,127,126,125,125,124,125,124,130,145,175,190,192,178,175,150,140,115,100,85,60,50,45,80,120,125,124,123,122,123,125,126,125,125,125,125,124,120,120,130,145,175,190,192,178,175,150,140,110,95,60,50,45,80,125,124,123,125,126,125,125,126,125,125,124,124,125,128,127,126,125,125,124,125,124,130,145,175,190,192,178,175,150,140,115,100,85,60,50,45,80,120,125,124,123,122,123,125,126,125,125,125,125,124,123,125,125,126,126,125,125,125,124,120,120,130,145,175,190,192,178,175,150,140,110,95,60,50,45,80,125,124,123,125,126,125,125,126,125,125,124,124,125,128,127,126,125,125,124,125,124,130,145,175,190,192,178,175,150,140,115,100,85,60,50,45,80,120,125,124,123,122,123,125,126,125,125,125,125,125,125,124,125,126,126,126,127,127,126,125,124,125,125,125,125,132,140,145,152,140,142,138,125,110,98,75,68,72,85,90,103,112,120,124,125,126,125,128,126,125,125,125,125,124,123,124,125,125,125,125,125];

ecgdata[0].push.apply(ecgdata[0],transition);
ecgdata[0].push.apply(ecgdata[0],square);
ecgdata[0].push.apply(ecgdata[0],square);
ecgdata[0].push.apply(ecgdata[0],square);
ecgdata[0].push.apply(ecgdata[0],transition);
ecgdata[0].push.apply(ecgdata[0],tachy);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],tachy);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],square);
ecgdata[0].push.apply(ecgdata[0],square);
ecgdata[0].push.apply(ecgdata[0],square);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],normal);
ecgdata[0].push.apply(ecgdata[0],tachy);


ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],tachy);
ecgdata[1].push.apply(ecgdata[1],tachy);
ecgdata[1].push.apply(ecgdata[1],tachy);
ecgdata[1].push.apply(ecgdata[1],tachy);
ecgdata[1].push.apply(ecgdata[1],tachy);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],normal);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);
ecgdata[1].push.apply(ecgdata[1],transition);



ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],tachy);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],tachy);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],square);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],tachy);
ecgdata[2].push.apply(ecgdata[2],transition);
ecgdata[2].push.apply(ecgdata[2],transition);

var linkdata=[
    {
        title: "Report Strips (by received date)",
        below: [
        {
            title: "6/29/2015",
            below: null
        },
        {
            title: "6/29/2015",
            below: null
        },
        {
            title: "6/29/2015",
            below: null
        },
        {
            title: "6/29/2015",
            below: null
        },
        {
            title: "6/29/2015",
            below: null
        }]
    },
    {
        title: "Prior Events (by received date)",
        below: [
        {
            title: "6/20/2015",
            below: [
            {
                title: "Sinus Tachycardia",
                below: [
                { title: "Item 1", link: "0", below: null },
                { title: "Item 2", link: "1", below: null },
                { title: "Item 3", link: "2", below: null },
                { title: "Item 4", below: null },
                { title: "Item 5", below: null }
                ]
            },
            { title: "Sinus Tachycardia", below: null }
            ]
        },
        {
            title: "6/19/2015",
            below: null
        },
        {
            title: "6/18/2015",
            below: null
        },
        {
            title: "6/16/2015",
            below: [
            { title: "Ventricular Tachycardia", below: null },
            { title: "Atrial Fibrillation", below: null }
            ]

        },
        {
            title: "6/15/2015",
            below: null
        }]
    },
    {
        title: "Current Report"
    },
    {
        title: "Reports"
    }
];

