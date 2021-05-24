const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const helper = require('./helper')
const keyboard = require('./keyboard')
const kb = require('./keyboard-buttons')
//const ikb = require('./inline-keyboard')
const fs = require('fs')
const fetch = require('node-fetch')  //installed npm node-fetch for api

helper.logStart()
const bot = new TelegramBot(config.TOKEN,{
    polling: true
})

var indexOf=0, lock=0, id

bot.onText(/\/start/,msg=>{
    const text = `Добро пожаловать на наш магазин ${msg.from.first_name}\nВыберетье команду:`
    bot.sendMessage(helper.getChatId(msg),text,{
        reply_markup:{
            keyboard: keyboard.home,
            resize_keyboard: true 
        }
    })
})

bot.on('message', msg=>{
    counter=0
    const chatId = helper.getChatId(msg)
    
    
    switch(msg.text){
        case kb.home.catalogs:
            bot.sendMessage(chatId,'Каталог',{
                reply_markup:{
                    keyboard:keyboard.exit,
                    resize_keyboard:true
                }
            })
            .then(()=>{
                fetch('http://allouzb/category/get')
                    .then(response => response.json())
                    .then(data=>{
                        var send_to_root=key_value_pairs(data.data)
                        bot.sendMessage(chatId,'Выберите раздел чтобы вывести список товаров:',{
                            reply_markup:{
                                inline_keyboard:send_to_root
                            }
                        })
                    })
                
                
            })
            break
        case kb.home.bin:
            console.log('BINda>>'+JSON.stringify(cart))
            
            if(cart.length == 0){
                console.log('cart null')
                bot.sendMessage(chatId,'В корзине пусто 🛒\n Посмотрите Каталог, там много интересного')

            }else{
                calculated_cost = cart[0].cost*cart[0].count
                dataObj[2]=cart[indexOf].id
            
                var total_amount = 0    
                for(var i in cart){
                    total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
                }
            //console.log('total_amount: '+total_amount)   

                fetch(`http://allouzb/product/img?id=${dataObj[2]}`).then(response => response.json())
                .then(data=>{
                    bot.sendMessage(chatId,'Корзина:\n '+cart[0].cost+' UZS '+' x '+cart[0].count+' = '+calculated_cost+' UZS '+'\n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                        reply_markup:{
                            inline_keyboard: [
                                [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                                [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cart.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                                [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                            ]
                        },
                        parse_mode:'HTML'
                    })

                })
            }
            break
        case kb.home.orders:
            break
        
        case kb.home.news:
            fetch('http://allouzb/news/get')
            .then(response => response.json())
            .then(data=>{
                id = data.id
                bot.sendChatAction(chatId,"upload_photo").then(()=>{
                    bot.sendPhoto(chatId,'.'+data.img.substr(12,data.img.length),{
                        caption: data.created_at + '\n\n'+ data.text,
                        reply_markup:{
                            keyboard: keyboard.news,
                            resize_keyboard:true
                        }
                    })
                }) 
            })
            break
        //more knopka bosilganda
        case kb.more.more:
                fetch(`http://allouzb/news/get?id=${id}`).then(response => response.json())
                .then(data=>{
                    if(data==null){
                        bot.sendMessage(chatId,'⚠️Других новостей пока нет🗞')
                    }else{

                    id = data.id
                    bot.sendChatAction(chatId,"upload_photo").then(()=>{
                        bot.sendPhoto(chatId,'.'+data.img.substr(12,data.img.length),{
                            caption: data.created_at + '\n\n'+ data.text,
                            reply_markup:{
                                keyboard: keyboard.news,
                                resize_keyboard:true
                            }
                        })
                    })
                    
                    
                 }

                })
            break
        case kb.home.help:
            bot.sendMessage(chatId,'Список команд:\n/catalog - Каталог\n\n Выберите ниже раздел справки и получите краткую помощь. Если Ваш вопрос не решен, обратитесь за помощью к живому оператору @abusaid_umarov.',{
                reply_markup:{
                    keyboard: keyboard.help,
                    resize_keyboard:true
                }
            })
            break
        case kb.help.call:
            bot.sendMessage(chatId,'Горячая линия "allo_uz"\n+998990000001')
            break 
        
        case kb.help.write:
            lock=1
            
            bot.sendMessage(chatId,'Напишите сообщение',{
                reply_markup:{
                    keyboard:keyboard.cancel,
                    resize_keyboard:true
                }
            })

            break

            
        //knopka nazad
        case kb.cancel.cancel:
            if(msg.text.toLowerCase=='отмена')
            {
                bot.deleteMessage(chatId,messageId2)
            }
            bot.sendMessage(chatId,'Список команд:\n/catalog - Каталог\n\n Выберите ниже раздел справки и получите краткую помощь. Если Ваш вопрос не решен, обратитесь за помощью к живому оператору @abusaid_umarov.',{
                reply_markup:{
                    keyboard: keyboard.help,
                    resize_keyboard:true
                }
            })

            break
        case kb.back.backward:
            if(msg.text.toLowerCase=='назад')
            {
                bot.deleteMessage(chatId,messageId2)
            }

            bot.sendMessage(chatId,'Главный меню',{
                reply_markup:{
                    keyboard: keyboard.home,
                    resize_keyboard: true 
                }
            })
            break
        case kb.exit.exit:
            bot.sendMessage(chatId,'Главный меню',{
                reply_markup:{
                    keyboard: keyboard.home,
                    resize_keyboard: true 
                }
            })
            break


        case kb.exit.mcatalogue:
            fetch('http://allouzb/category/get')
            .then(response => response.json())
            .then(data=>{
                var send_to_root=key_value_pairs(data.data)
                bot.sendMessage(chatId,'Выберите один из каталогов:',{
                    reply_markup:{
                        inline_keyboard:send_to_root
                    }
                })
            })
            break

        case '🚚Доставить/Yetqazib\nberish':
            var total_amount = 0    
            
            for(var i in cart){
                total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
            }

            console.log('cart>> '+JSON.stringify(cart))
            console.log('total_amount>> '+total_amount)
            console.log('chatid>> '+msg.from.id)
            console.log('firstname>> '+msg.from.first_name)
            console.log('lastname>> '+msg.from.last_name)
            console.log('username>> '+msg.from.username)
            break




            default:{
                console.log(lock)
                if(lock==1){
                   //bazaga shu msg.text otziv ga yoziladi
                    console.log(msg.text+'this will go to DB')
                    console.log('chatid '+msg.from.id)
                    console.log('firstname '+msg.from.first_name)
                   //tugadi bazaga yozish
                    bot.sendMessage(chatId,'Спасибо за ваш отзыв!',{
                        reply_markup:{
                            keyboard:keyboard.back,
                            resize_keyboard:true
                        }
                    }).then(()=>{
                        bot.sendMessage(2975459,msg.from.first_name+' send you this message:\n'+msg.text)
                    })
                }
                lock=0 //buyoda hold otzivni ajratish uchun kk
                
                
            }
        
    }
})








bot.on('callback_query',query=>{
    var status,sub_category
    var calculated_cost
    
    

    if(query.data.slice(0,3)=='add'){
console.log('add kupit knopka')
        
        dataObj=query.data.split(" ")
        counter=parseInt(dataObj[3])+1
        var description=dataObj.slice(4,dataObj.length).join(" ")
        
         
         //console.log('here add>>>>  '+dataObj[0]) //add digan text
         console.log('here id>>>>  '+dataObj[2]) //id
         console.log('here cost>>>>  '+dataObj[1]) //cost
         console.log('num of>>>> '+counter) //counter
         console.log('descript>>> '+description) //description
        
        addItemToCart(dataObj[2],dataObj[1],counter,description)
console.log('cart added'+JSON.stringify(cart))
        bot.editMessageCaption(description,{
            chat_id:query.message.chat.id,
            message_id: query.message.message_id,
            reply_markup:{
                inline_keyboard:[
                    [{text:'Купить - '+dataObj[1]+' UZS'+' ('+counter +'шт.)',callback_data:'add'+' '+dataObj[1]+' '+dataObj[2]+' '+counter+' '+description}],
                    [{text:'В корзину',callback_data:'bin'}]
                ]
            }
        }).catch((err)=>{console.log(err)})
    
    
    }else if(query.data=='bin'){
console.log('bin v korzinu')
console.log('BINda>>'+JSON.stringify(cart))
            
            var description=dataObj.slice(4,dataObj.length).join(" ")
            calculated_cost = cart[0].cost*cart[0].count
            dataObj[2]=cart[indexOf].id
            
//calculating total amount in cart
            
            var total_amount = 0    
            for(var i in cart){
                total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
            }
            //console.log('total_amount: '+total_amount)   

        fetch(`http://allouzb/product/img?id=${dataObj[2]}`).then(response => response.json())
        .then(data=>{
            bot.sendMessage(query.message.chat.id,'Корзина:\n '+cart[0].cost+' UZS '+' x '+cart[0].count+' = '+calculated_cost+' UZS '+'\n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                reply_markup:{
                    inline_keyboard: [
                        [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                        [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cart.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                        [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                    ]
                },
                parse_mode:'HTML'
            })
        })
    
    }else if(query.data=='❌'){
        
        if(indexOf==0){
            //indexOf++;
        }else{
            indexOf--;
        }

        dataObj[2]=cart[indexOf].id

        removeItemFromCart(dataObj[2])

        
        if(cart.length!=0){
            calculated_cost = cart[indexOf].cost*cart[indexOf].count
            var total_amount = 0    
            
            for(var i in cart){
                total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
            }

        fetch(`http://allouzb/product/img?id=${dataObj[2]}`).then(response => response.json())
            .then(data=>{
            bot.editMessageText('Корзина:\n '+cart[indexOf].cost+' UZS '+' x '+cart[indexOf].count+' = '+calculated_cost+' UZS \n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                chat_id: query.message.chat.id,
                message_id:query.message.message_id,
                reply_markup:{
                    inline_keyboard:[
                        [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                        [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cart.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                        [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                    ]
                },
                parse_mode:'HTML'
                
            })
        })

        }else{
            console.log('cart empty(')
            bot.deleteMessage(query.message.chat.id,query.message.message_id).then(()=>{
                fetch('http://allouzb/category/get')
                    .then(response => response.json())
                    .then(data=>{
                        //var send_to_root=key_value_pairs(data.data)
                        bot.sendMessage(query.message.chat.id,'В корзине пусто 🛒\n Посмотрите Каталог, там много интересного',{
                            reply_markup:{
                                keyboard: keyboard.home,
                                resize_keyboard: true
                            }
                            
                            
                        })
                    })
            })
            
        
        }

    
    }else if(query.data=='◀️'){
            indexOf--;
            if(indexOf>=0){
console.log('indexOf*** '+indexOf)
                dataObj[2]=cart[indexOf].id
console.log('chap<<'+dataObj[2])
                calculated_cost = cart[indexOf].cost*cart[indexOf].count
                var description=dataObj.slice(4,dataObj.length).join(" ")
                
                var total_amount = 0    
                for(var i in cart){
                    total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
                }

        fetch(`http://allouzb/product/img?id=${dataObj[2]}`).then(response => response.json())
        .then(data=>{
                bot.editMessageText('Корзина:\n '+cart[indexOf].cost+' UZS '+' x '+cart[indexOf].count+' = '+calculated_cost+' UZS \n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                    chat_id: query.message.chat.id,
                    message_id:query.message.message_id,
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                            [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cart.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                            [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                        ]
                    },
                    parse_mode:'HTML'
                })
        })
            }else{console.log('no more left'+indexOf);indexOf++;}
            

    }else if(query.data=='▶️'){

            indexOf++;
            if(indexOf<=(cart.length-1)){

                dataObj[2]=cart[indexOf].id
console.log('ong>>'+dataObj[2])
                calculated_cost = cart[indexOf].cost*cart[indexOf].count
                var description=dataObj.slice(4,dataObj.length).join(" ")
                
                var total_amount = 0    
                for(var i in cart){
                    total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
                }
                
                
            fetch(`http://allouzb/product/img?id=${dataObj[2]}`).then(response => response.json())
                .then(data=>{ 
                bot.editMessageText('Корзина:\n '+cart[indexOf].cost+' UZS '+' x '+cart[indexOf].count+' = '+calculated_cost+' UZS \n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                    chat_id: query.message.chat.id,
                    message_id:query.message.message_id,
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                            [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cart.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                            [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                        ]
                    },
                    parse_mode:'HTML'
                })
            })
            }else{console.log('no more right'+indexOf);indexOf--;}
            
    
    }else if(query.data=='🔻'){
console.log('indexOf*** '+indexOf)
console.log('down cart '+JSON.stringify(cart))
            
            if(cart[indexOf].count!=1){
                dataObj[2]=cart[indexOf].id
                decrementItemInCart(dataObj[2])
                calculated_cost = cart[indexOf].cost*cart[indexOf].count

                var total_amount = 0    
                for(var i in cart){
                    total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
                }

            fetch(`http://allouzb/product/img?id=${dataObj[2]}`).then(response => response.json())
                .then(data=>{ 
                bot.editMessageText('Корзина:\n '+cart[indexOf].cost+' UZS '+' x '+cart[indexOf].count+' = '+calculated_cost+' UZS \n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                    chat_id: query.message.chat.id,
                    message_id:query.message.message_id,
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                            [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cart.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                            [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                        ]
                    },
                    parse_mode:'HTML'
                })
            })

            }else{
                console.log('1ta qoldi')
            }
            
    }else if(query.data == '🔺'){
console.log('indexOf**** '+indexOf)  //cart digi orni
console.log('cart '+JSON.stringify(cart))
console.log('dataObj[2] '+dataObj[2]) //id of pruduct
            
            dataObj[2]=cart[indexOf].id
            incrementItemInCart(dataObj[2])

            calculated_cost = cart[indexOf].cost*cart[indexOf].count

            var total_amount = 0    
            for(var i in cart){
                total_amount=total_amount + parseFloat(cart[i].cost)*cart[i].count
            }
            
console.log('Qara buyoga>>>>>>>'+calculated_cost)
        fetch(`http://allouzb/product/img?id=${dataObj[2]}`).then(response => response.json())
            .then(data=>{ 
            bot.editMessageText('Корзина:\n '+cart[indexOf].cost+' UZS '+' x '+cart[indexOf].count+' = '+calculated_cost+' UZS \n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                chat_id: query.message.chat.id,
                message_id:query.message.message_id,
                reply_markup:{
                    inline_keyboard:[
                        [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                        [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cart.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                        [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                    ]
                },
                parse_mode:'HTML'
            })
        })

    }else if(query.data=='nu'){
        console.log('No action')
    }else if(query.data=='c'){
        console.log('No action')
    }
    else if(query.data=='formalize'){
        console.log('formalize')
        
        bot.sendMessage(query.message.chat.id,'Укажитье вариант доставки:',{
            reply_markup:{
                keyboard:[
                    ['🚚Доставить/Yetqazib\nberish','Отмена'],
                    ['◀️Назад в корзину']
                ],
                resize_keyboard:true
            }
        })
    }
    else{
    //BY API////////////////////////////// 

        fetch(`http://allouzb/category/get?id=${query.data}`).then(response => response.json())
        .then(data=>{
            status = data.status //0 -keyboard yoki 1-good
            sub_category = key_value_pairs(data.data) //keyobard
            
            //callback_data = query.data  //callback_data bu id shuni id ga berish kk
            if(data.parent!=null){
                sub_category.push([{text:'↖️ Вернуться в суб-каталог',callback_data:data.parent}])
            }
            
            //keyboard holati uchun
            if(status==0){
                console.log('status 0 keyobard')
                bot.deleteMessage(query.message.chat.id,query.message.message_id).then(()=>{
                    bot.sendMessage(query.message.chat.id,'Выберите раздел чтобы вывести список товаров:',{
                        reply_markup:{
                            inline_keyboard:sub_category, //shuyoga api digi DATA ni assign
                        }
                    })
                })

            }//data holati uchun
            else if(status==1){
                console.log('status 1 data')
                var goods = data.data
                var good_counter=0
                let promise = Promise.resolve()

                goods.forEach((good)=>{
                   promise = promise.then(()=>{
                    good_counter=good_counter+1
                    bot.sendChatAction(query.message.chat.id,'upload_photo').then(()=>{
                        bot.sendPhoto(query.message.chat.id,'.'+good.img.substr(12,good.img.length),{
                            caption:good.description,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text:'Купить - '+good.cost+' UZS' ,callback_data:'add'+' '+good.cost+' '+good.id+' '+counter+' '+good.description}]
                                ]
                            }
                        }).then(()=>{}).catch((err)=>{console.log(err)})
                    })
                  }).then(()=>{//har bitta loop dan keyin bitta bitta ishlidi
                            })
                  promise.then(()=>{
                        //loop dan oldin hammasini ketma ket ishlatadi
                  })
                })
               
            }else{
                console.log('status is not either 0 or 1\nэта категория пока пуста')
                bot.sendMessage(query.message.chat.id,'⚠️ Извините, эта категория пока пуста!')
            }
        })

    //END BY API////////////////////////////// 
    }





})



//functions
        var cart = []
        var Item = function(id,cost,count,description){
            this.id = id
            this.cost = cost
            this.count = count
            this.description = description
        }

        function addItemToCart(id,cost,count,description){
            for(var i in cart){
                if(cart[i].id === id){
                    cart[i].count ++;
                    return
                }
            }
            var item = new Item(id,cost,count,description);
            cart.push(item);
        }

        
        function removeItemFromCart(id){
            for(var i in cart){
                if(cart[i].id===id){
                    cart.splice(i,1);
                    break;
                }
            }
        }
        function incrementItemInCart(id){
            for(var i in cart){
                if(cart[i].id===id){
                    cart[i].count++;
                    break
                }
            }
        }
        function decrementItemInCart(id){
            for(var i in cart){
                if(cart[i].id===id){
                    if(cart[i].count>1){
                        cart[i].count--;
                    }else{
                        console.log('at least 1 item you should posess')
                        break
                    }    
                    break
                }
            }
        }
        


//////////////```Plugins```///////////////////////////
        function key_value_pairs(obj) {
            var keys = _keys(obj);
            var length = keys.length;
            var pairs = Array(length);
            
            for (var i = 0; i < length; i++){
                pairs[i] = [obj[keys[i]]];
            }
            return pairs;
        }

        function _keys(obj){
            if (!isObject(obj)) return [];
            if (Object.keys) return Object.keys(obj);
            var keys = [];
            for (var key in obj) if (_.has(obj, key)) keys.push(key);
            return keys;
        }
        
        function isObject(obj){
            var type = typeof obj;
            return type === 'function' || type === 'object' && !!obj;
        }