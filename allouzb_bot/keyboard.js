const kb = require('./keyboard-buttons')
module.exports={
    home:[
        [kb.home.catalogs, kb.home.bin],
        [kb.home.orders, kb.home.news],
        [kb.home.help]
    ],
    help:[
        [kb.help.call, kb.help.write],
        [kb.back.backward]
    ],
    cancel:[
        [kb.cancel.cancel]
    ],
    back:[
        [kb.back.backward]
    ],
    news:[
        [kb.back.backward,kb.more.more]
    ],
    exit:[
        [kb.exit.mcatalogue],
        [kb.exit.exit]
    ]

}