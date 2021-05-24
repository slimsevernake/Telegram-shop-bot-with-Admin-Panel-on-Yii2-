
module.exports={
    catalogues:[
        [{text:'Телефоны',callback_data:'sc1'}],
        [{text:'Чехол',callback_data:'sc2'}]
        
    ],
    sc1:[
        [{text:'Samsung',callback_data:'samsung'}],
        [{text:'Iphone',callback_data:'sc12'}]
        
    ],
    
    sc12:[
        [{text:'Macbook',callback_data:'Macbook'}],
        [{text:'iwatch',callback_data:'sc122'}]
        
    ],

    cartKeyboard:[
        [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
        [{text:'◀️',callback_data:'◀️'},{text:'indexOf/outOf',callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
        [{text:'✅',callback_data:'formalize'}]
    ],



    samsung:[
        {
            id:'1',
            picture:'./goods/galaxys5.jpg',
            type:'samsung',
            description:'Samsung galaxy S5',
            cost:'4,700,000.111'
        },
        {
            id:'2',
            picture:'./goods/galaxyj6.jpg',
            type:'samsung',
            description:'Samsung galaxy J6 hhhhhhjhjuytgfrtyhjiop',
            cost:'2,240,000.20'
        }
    ],
    Macbook:[
    {
        id:'3',
        picture:'https://drive.google.com/file/d/14PO6BNi_KZ66Y2bgsUX0OlsYZ5fZ14Ls/view?usp=drivesdk',
        type:'Macbook',
        description:'Macbook pro 13 fdkmdfklvjdfjl lkkjfgjdfggfg',
        cost:'24,540,000'
    }
]
   
}