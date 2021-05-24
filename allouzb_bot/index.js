//https://www.youtube.com/watch?v=_TMUowcFP5c&list=PLoN_ejT35AEhzNoPStBzAkpqAu3YQwPj7&index=10
// cart uchun tutorial ozi bitkan cart


const TelegramBot = require('node-telegram-bot-api')
const config = require('./config')
const helper = require('./helper')
const keyboard = require('./keyboard')
const kb = require('./keyboard-buttons')
//const ikb = require('./inline-keyboard')
//const fs = require('fs')
const fetch = require('node-fetch')  //installed npm node-fetch for api
const mysql = require('mysql')

helper.logStart()
const bot = new TelegramBot(config.TOKEN,{
    polling: true
})

var indexOf=0, lock=0, address_lock=0, phone_lock=0, finish=0, id
var finalCartByChatId=[]
// Listen on the 'polling_error' event
bot.on('polling_error', (error) => {
	var time = new Date();
	console.log("TIME:", time);
	console.log("CODE:", error.code);  // => 'EFATAL'
	console.log("MSG:", error.message);
	console.log("STACK:", error.stack);
});
var username=''
var table_name='client'

bot.onText(/\/ukamuxladin/,msg=>{
    bot.sendMessage(msg.chat.id,'⚠️ Warning.\n  Orders are disallowed.')
    table_name='disabled'
})
bot.onText(/\/allouzb_success/,msg=>{
    bot.sendMessage(msg.chat.id,'✅ Success!\n  Functionality has been fixed.')
    table_name='client'
})

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
    var cartByChatId = cart.filter(item =>item.chatId==msg.chat.id)
    //indexOf = cart.filter(item =>item.chatId==msg.chat.id).length
    console.log('cartByChatId length>>> '+indexOf)
    
    switch(msg.text){
        case kb.home.catalogs:
            bot.sendMessage(chatId,'Каталог',{
                reply_markup:{
                    keyboard:keyboard.exit,
                    resize_keyboard:true
                }
            })
            .then(()=>{
                fetch(config.pre_url+'/category/get')
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
            console.log('BINda>>'+JSON.stringify(cartByChatId))
            
            if(cartByChatId.length == 0){
                console.log('cart null')
                bot.sendMessage(chatId,'В корзине пусто 🛒\n Посмотрите Каталог, там много интересного')

            }else{
                indexOf=0;
                calculated_cost = cartByChatId[0].cost*cartByChatId[0].count
                dataObj[2]=cartByChatId[indexOf].id
            
                var total_amount = 0    
                for(var i in cartByChatId){
                    total_amount=total_amount + parseFloat(cartByChatId[i].cost)*cartByChatId[i].count
                }
            //console.log('total_amount: '+total_amount)   

                fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
                .then(data=>{
                    bot.sendMessage(chatId,'🛍 Корзина:\n '+cartByChatId[0].cost+' UZS '+' x '+cartByChatId[0].count+' = '+calculated_cost+' UZS '+'\n\n'+'<a href="allouzb'+data.img+'">'+data.description+'</a>',{
                        reply_markup:{
                            inline_keyboard: [
                                [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cartByChatId[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                                [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                                [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                            ]
                        },
                        parse_mode:'HTML'
                    })

                })
            }
            break
//bitta teppadigi home.bin bilan birxil
        case '◀️ Назад в корзину':
            address_lock=0, phone_lock=0, finish=0
            console.log('BINda>>'+JSON.stringify(cartByChatId))
            
            if(cartByChatId.length == 0){
                bot.sendMessage(chatId,'В корзине пусто 🛒\n Посмотрите Каталог, там много интересного')

            }else{
                indexOf=0;
                calculated_cost = cartByChatId[0].cost*cartByChatId[0].count
                dataObj[2]=cartByChatId[indexOf].id
            
                var total_amount = 0    
                for(var i in cartByChatId){
                    total_amount=total_amount + parseFloat(cartByChatId[i].cost)*cartByChatId[i].count
                }
            //console.log('total_amount: '+total_amount)   

                fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
                .then(data=>{
                    bot.sendMessage(chatId,'🛍 Корзина:\n '+cartByChatId[0].cost+' UZS '+' x '+cartByChatId[0].count+' = '+calculated_cost+' UZS '+'\n\n'+'<a href="'+config.pre_url_picture+data.img+'">'+data.description+'</a>',{
                        reply_markup:{
                            inline_keyboard: [
                                [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cartByChatId[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                                [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                                [{text:'✅ Заказ на '+total_amount+' UZS Оформить?',callback_data:'formalize'}]
                            ]
                        },
                        parse_mode:'HTML'
                    })

                })
            }
            break
        
        case '🚫 Отменить Заказ':
            address_lock=0, phone_lock=0, finish=0
            bot.sendMessage(chatId,'❌ Ваш Заказ был отменен.\n',{
                reply_markup:{
                    keyboard: keyboard.home,
                    resize_keyboard: true 
                }
            })
            break
        case kb.home.orders:
            fetch(config.pre_url+`/cart/get-client-order?chat_id=${chatId}`).then(response => response.json())
                .then(data=>{
                    console.log(JSON.stringify(data));
                    if(data!='There is no order of this user'){

                    
                    var orders = data
                    orders.forEach(json=>{
                        if(json.status==1){
                            var status = '🕐 В ожидании'
                        }else if(json.status==2){
                            status = '✅ Ваш заказ одобрен'
                        }
                        else{
                            status=json.status
                        }
                        bot.sendChatAction(chatId,'typing')
                        .then(()=>{
                            bot.sendMessage(chatId,'📝 Заказ № '+json.order_key+'\n\n🛎 Статус: '+status+'\n📅 Дата: '+json.time+'\n💵 Общая сумма: '
                                +json.cost+' UZS'+'\n\n🚚 Доставка: Доставить/Yetqazib berish\n'+'📍 Адрес: '+json.location+'\n\n🛍 Товары: \n'+json.description,{
                                reply_markup:{
                                    keyboard:keyboard.home,
                                    resize_keyboard:true
                                }
                        
                    })
                        })
                    })

                }else{
                    bot.sendMessage(chatId,'⚠️ Нет никаких заказов!')
                }

                })

                
            break
        
        case kb.home.news:
            fetch(config.pre_url+'/news/get')
            .then(response => response.json())
            .then(data=>{
                if(data!=null){

                
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
            }else{
                bot.sendMessage(chatId,'📰 Новостей пока нет!')
            }
            })
            
            break
        //more knopka bosilganda
        case kb.more.more:
                fetch(config.pre_url+`/news/get?id=${id}`).then(response => response.json())
                .then(data=>{
                    if(data==null){
                        bot.sendMessage(chatId,'⚠️ Других новостей пока нет! 🗞')
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
            bot.sendMessage(chatId,'Выберите ниже раздел справки и получите краткую помощь. Если Ваш вопрос не решен, обратитесь за помощью к живому оператору @'+config.reception_admin_user_name,{
                reply_markup:{
                    keyboard: keyboard.help,
                    resize_keyboard:true
                }
            })
            break
        case kb.help.call:
            bot.sendMessage(chatId,'☎️ Горячая линия "allo_uz"\n'+config.reception_admin_phone)
            break 
        
        case kb.help.write:
            lock=1
            
            bot.sendMessage(chatId,'⚠️ Предупреждение!!! \n\nВы можете оставить отзыв. Если у вас нет имени пользователя (Username), то невозможно связаться с вами. В этом случае, пожалуйста, укажите ваше имя пользователя (Username) или номер телефона в вашем сообщение. Спасибо за понимание. \n\nОставьте свой отзыв в службу поддержки ✍️👇🏼',{
                reply_markup:{
                    keyboard:keyboard.cancel,
                    resize_keyboard:true
                }
            })

            break

            
        //knopka nazad
        case kb.cancel.cancel:
            lock=0
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
            fetch(config.pre_url+'/category/get')
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

        case '🚚📦 Доставить/Yetqazib\nberish':
            if(cartByChatId.length!=0){
                


//Database Connection*******************************************
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'allouzb'
      });
    connection.connect();
    if(msg.from.username==undefined){
        username='username отсуствует'
    }else{
        username=msg.from.username
    }
    connection.query(`REPLACE ${table_name} (id,name,tel) VALUES (${msg.from.id},'${username}',${null})`,(err,results,fields)=>{
        if(err) {console.log('DataBase Error>> '+err)};
        if(fields){console.log('field'+fields.toString())}
    })
    connection.end()
    //end Database Connection****************************************



                
            
            var total_amount = 0    
            for(var i in cartByChatId){
                total_amount=total_amount + parseFloat(cartByChatId[i].cost)*cartByChatId[i].count
            }

          /*console.log('cartByChatId>> '+JSON.stringify(cartByChatId))
            //console.log('cart bychatid>>> '+JSON.stringify(cartByChatId))
            console.log('total_amount>> '+total_amount)
            console.log('chatid>> '+msg.from.id)
            console.log('firstname>> '+msg.from.first_name)
            console.log('lastname>> '+msg.from.last_name)
            console.log('username>> '+msg.from.username)*/
            
            //PUSH chatid
            finalCartByChatId = cartByChatId
            phone_lock=1
            bot.sendMessage(chatId,'☎️ Поделитесь своим номером телефона:',{
                reply_markup:{
                    one_time_keyboard:true,
                    resize_keyboard:true,
                    keyboard:[
                        [{text:'☎️ Отправить мой номер', request_contact: true}],
                        ['◀️ Назад в корзину'],
                        ['🚫 Отменить Заказ']
                    ]
                }
            })
             .then(()=>{
                phone_lock=0
                bot.once("contact",(msg)=>{
                    
                    //console.log(JSON.stringify(msg))
                    console.log('name by contact>> '+msg.contact.first_name+'\nphone number>> '+msg.contact.phone_number) 
                    
                    //PUSH phonenumber
                    
                    finalCartByChatId.push({phonenumber:`${msg.contact.phone_number}`,chatId:`${msg.chat.id}`})
                    address_lock=1
                    bot.sendMessage(msg.chat.id,'📍 Пожалуйста, отправьте ваше местоположение: ',{
                        reply_markup:{
                            one_time_keyboard:true,
                            resize_keyboard:true,
                            keyboard:[
                                ['◀️ Назад в корзину'],
                                ['🚫 Отменить Заказ']
                            ]
                        }
                    })
                })
            })
            }else{
                bot.sendMessage(chatId,'⚠️ Ваша корзина пуста!',{
                    reply_markup:{
                        keyboard: keyboard.home,
                        resize_keyboard: true 
                    }
                })
            }

            break




            default:{
            //admin ga message jonatiw
                console.log(lock)
                if(lock==1){
                   //bazaga shu msg.text otziv ga yoziladi
                    //console.log(msg.text+'this will go to DB')
                    //console.log('chatid '+msg.from.id)
                    //console.log('firstname '+msg.from.first_name)
                   //tugadi bazaga yozish
                    bot.sendMessage(chatId,'Спасибо за ваш отзыв! Админ свяжется с вами в ближайшее время.',{
                        reply_markup:{
                            keyboard:keyboard.back,
                            resize_keyboard:true
                        }
                    }).then(()=>{
                        bot.sendMessage(config.reception_admin_chat_id,'@'+msg.from.username + ' отправил(-а) отзыв 👇🏼:\n\n'+msg.text)
                    })
                    lock=0
                }
                
            //end adminga message jonatiw  
            
            
            if(finish==1){
              if(finalCartByChatId[0].chatId==msg.chat.id){
                //add_info.push([{time:`${msg.text}`,chatId:`${msg.chat.id}`}])
                finalCartByChatId.push({time:`${msg.text}`,chatId:`${msg.chat.id}`})
                console.log('cart>> '+JSON.stringify(finalCartByChatId))
                var send_finalCartByChatId = finalCartByChatId.filter(item =>item.chatId==msg.chat.id)
                
                //var l_add_info = add_info.filter(item=>item[0].chatId==msg.chat.id)
                //send_finalCartByChatId.push(l_add_info)
                //console.log('first_name'+msg.from.first_name)
                //console.log('second_name'+msg.from.last_name)
                //console.log('username '+msg.from.username)
                fetch(config.pre_url+`/cart/make`,{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify(send_finalCartByChatId)})
                .then((res)=>{
                    return res.json()
                })
                .then((json)=>{
                    if(json.status==1){
                        var status = '🕖 В ожидании'
                    }else{
                        status=json.status
                    }
                    bot.sendMessage(chatId,'📝 Заказ № '+json.order_key+'\n\n🛎 Статус: '+status+'\n🕖 Дата: '+json.time+'\n💵 Общая сумма: '
                    +json.cost+' UZS'+'\n\n🚚 Доставка: Доставить/Yetqazib berish\n'+'📍 Адрес: '+json.location+'\n\n🛍 Товары: \n'+json.description,{
                        reply_markup:{
                            keyboard:keyboard.home,
                            resize_keyboard:true
                        }
                        
                    })
                    .then(()=>{
                        bot.sendMessage(chatId,'✅ Ваш заказ был принят и статус в ожидании. Пожалуйста, подождите, вы будете уведомлены о статусе вашего заказа.'+
                        '\n\nКонтактная информация оператора: '+'@username\nНаш адрес: xxxxxx xxxxx\nТелефон: +99891 111 11 11')
                         removeItemFromCartAll(chatId);
                        
                    })
                    .then(()=>{
                        bot.sendMessage(-1001394878997,'🛎 Новый заказ принят № '+json.order_key+'.\nПожалуйста, обновите ваш браузер.🔄')
                    })
                    
                })
                
               
                
                finish=0
             }
            }


            //geo location orniga address jonatiw
                if(address_lock==1){//finish=1
                  if(finalCartByChatId[0].chatId==msg.chat.id){
                    console.log(JSON.stringify(msg,null,4))
                    
                    //console.log(msg.location.latitude+','+msg.location.latitude+' <<'+' <<bu address boliwi kk')
                    if(msg.location!=undefined){
                        //add_info.push({location:`https://google.com/maps/?q=${msg.location.latitude},${msg.location.longitude}`,chatId:`${msg.chat.id}`})
                        finalCartByChatId.push({location:`https://google.com/maps/?q=${msg.location.latitude},${msg.location.longitude}`,chatId:`${msg.chat.id}`})
                    }else{
                        //PUSH location text
                        //add_info.push([{location:`${msg.text}`,chatId:`${msg.chat.id}`}])
                        finalCartByChatId.push({location:`${msg.text}`,chatId:`${msg.chat.id}`})
                    }
                    //console.log('last bychi>>>>> '+JSON.stringify(finalCartByChatId,null,4))
                    bot.sendMessage(chatId,'🕐 В какое время и когда вы хотите получить?',{
                        reply_markup:{
                            resize_keyboard: true,
                            one_time_keyboard:true,
                            keyboard:[
                                ['🚫 Отменить Заказ']
                            ]
                        }
                    })
                    address_lock=0
                    finish=1
                 }
                }
             //end of geo location jonatiw


                if(phone_lock==1){
                    //PUSH phonenumber
                  if(finalCartByChatId[0].chatId==msg.chat.id){
                    
                    finalCartByChatId.push({phonenumber:`${msg.text}`,chatId:`${msg.chat.id}`})
                    address_lock=1
                    bot.sendMessage(msg.chat.id,'📍 Пожалуйста, отправьте ваше местоположение: ',{
                        reply_markup:{
                            one_time_keyboard:true,
                            resize_keyboard:true,
                            keyboard:[
                                ['◀️ Назад в корзину'],
                                ['🚫 Отменить Заказ']
                            ]
                        }
                    })
                    phone_lock=0
                  }
                }
                

            }

            
        
    }
})








bot.on('callback_query',query=>{
    var status,sub_category
    var calculated_cost
    var cartByChatId = cart.filter(item =>item.chatId==query.message.chat.id)
    

    if(query.data.slice(0,3)=='add'){
console.log('add kupit knopka')
        
        dataObj=query.data.split(" ")
        counter=parseInt(dataObj[3])+1

        fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
        .then(data=>{
        
        //var description=dataObj.slice(4,dataObj.length).join(" ")
        var description = /*data.description*/ data.name+' - '+data.description
         
         //console.log('here add>>>>  '+dataObj[0]) //add digan text
         console.log('here id>>>>  '+dataObj[2]) //id
         console.log('here cost>>>>  '+dataObj[1]) //cost
         console.log('num of>>>> '+counter) //counter
         console.log('descript>>> '+description) //description
//f
        addItemToCart(dataObj[2],dataObj[1],counter,description,query.message.chat.id)
console.log('cart added'+JSON.stringify(cart))

        bot.editMessageCaption(description,{
            chat_id:query.message.chat.id,
            message_id: query.message.message_id,
            reply_markup:{
                inline_keyboard:[
                    [{text:'🛍 Купить - '+dataObj[1]+' UZS'+' ('+counter +'шт.)',callback_data:'add'+' '+dataObj[1]+' '+dataObj[2]+' '+counter}],
                    [{text:'🛒 В корзину',callback_data:'bin'}]
                ]
            }
        }).catch((err)=>{console.log(err)})
    })
    
    }else if(query.data=='bin'){
console.log('bin v korzinu')
console.log('BINda>>'+JSON.stringify(cart))

//cartById
            //var description=dataObj.slice(4,dataObj.length).join(" ")
            calculated_cost = cartByChatId[0].cost * cartByChatId[0].count
            dataObj[2]=cartByChatId[indexOf].id
            
//calculating total amount in cart
            
            var total_amount = 0    
            for(var i in cartByChatId){
                total_amount=total_amount + parseFloat(cartByChatId[i].cost) * cartByChatId[i].count
            }
            //console.log('total_amount: '+total_amount)   

        fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
        .then(data=>{
            bot.sendMessage(query.message.chat.id,'Корзина:\n '+cartByChatId[0].cost+' UZS '+' x '+cartByChatId[0].count+' = '+calculated_cost.toFixed(2)+' UZS '+'\n\n'+'<a href="'+config.pre_url_picture+data.img+'">'+data.description+'</a>',{
                reply_markup:{
                    inline_keyboard: [
                        [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cart[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                        [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                        [{text:'✅ Заказ на '+total_amount.toFixed(2)+' UZS Оформить?',callback_data:'formalize'}]
                    ]
                },
                parse_mode:'HTML'
            })
        })
    
    }else if(query.data=='❌'){
        
        console.log('indexOf initial '+indexOf)
        if(indexOf>0){
            //indexOf++;
            dataObj[2]=cartByChatId[indexOf].id
            indexOf--;
        }else if(indexOf==0){
            dataObj[2]=cartByChatId[indexOf].id
            //indexOf++;
        }
        else{
            indexOf--;
            dataObj[2]=cartByChatId[indexOf+1].id
        }
        
        
        
        
        console.log('id tovar to be delted >>'+dataObj[2])
        console.log('cartbychatid  '+JSON.stringify(cartByChatId))

        removeItemFromCart(dataObj[2],query.message.chat.id)
        cartByChatId = cart.filter(item =>item.chatId==query.message.chat.id)
        console.log('cartbychatid d>>'+JSON.stringify(cartByChatId)) 

        if(cartByChatId.length!=0){
            calculated_cost = cartByChatId[indexOf].cost * cartByChatId[indexOf].count
            var total_amount = 0    
            
            for(var i in cartByChatId){
                total_amount=total_amount + parseFloat(cartByChatId[i].cost)*cartByChatId[i].count
            }

        dataObj[2]=cartByChatId[indexOf].id
        fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
            .then(data=>{
            bot.editMessageText('Корзина:\n '+cartByChatId[indexOf].cost+' UZS '+' x '+cartByChatId[indexOf].count+' = '+calculated_cost.toFixed(2)+' UZS \n\n'+'<a href="'+config.pre_url_picture+data.img+'">'+data.description+'</a>',{
                chat_id: query.message.chat.id,
                message_id:query.message.message_id,
                reply_markup:{
                    inline_keyboard:[
                        [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cartByChatId[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                        [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                        [{text:'✅ Заказ на '+total_amount.toFixed(2)+' UZS Оформить?',callback_data:'formalize'}]
                    ]
                },
                parse_mode:'HTML'
                
            })
        })

        }else{
            console.log('cart empty(')
            bot.deleteMessage(query.message.chat.id,query.message.message_id).then(()=>{
                fetch(config.pre_url+'/category/get')
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
                dataObj[2]=cartByChatId[indexOf].id
console.log('chap<<'+dataObj[2])
                calculated_cost = cartByChatId[indexOf].cost * cartByChatId[indexOf].count
                //var description=dataObj.slice(4,dataObj.length).join(" ")
                
                var total_amount = 0    
                for(var i in cartByChatId){
                    total_amount=total_amount + parseFloat(cartByChatId[i].cost) * cartByChatId[i].count
                }

        fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
        .then(data=>{
                bot.editMessageText('Корзина:\n '+cartByChatId[indexOf].cost+' UZS '+' x '+cartByChatId[indexOf].count+' = '+calculated_cost.toFixed(2)+' UZS \n\n'+'<a href="'+config.pre_url_picture+data.img+'">'+data.description+'</a>',{
                    chat_id: query.message.chat.id,
                    message_id:query.message.message_id,
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cartByChatId[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                            [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                            [{text:'✅ Заказ на '+total_amount.toFixed(2)+' UZS Оформить?',callback_data:'formalize'}]
                        ]
                    },
                    parse_mode:'HTML'
                })
        })
            }else{console.log('no more left'+indexOf);indexOf++;indexOf=0;}
            

    }else if(query.data=='▶️'){

            indexOf++;
            if(indexOf<=(cartByChatId.length-1)){

                dataObj[2]=cartByChatId[indexOf].id
console.log('ong>>'+dataObj[2])
                calculated_cost = cartByChatId[indexOf].cost * cartByChatId[indexOf].count
                //var description=dataObj.slice(4,dataObj.length).join(" ")
                
                var total_amount = 0    
                for(var i in cartByChatId){
                    total_amount=total_amount + parseFloat(cartByChatId[i].cost)*cartByChatId[i].count
                }
                
                
            fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
                .then(data=>{ 
                bot.editMessageText('Корзина:\n '+cartByChatId[indexOf].cost+' UZS '+' x '+cartByChatId[indexOf].count+' = '+calculated_cost.toFixed(2)+' UZS \n\n'+'<a href="'+config.pre_url_picture+data.img+'">'+data.description+'</a>',{
                    chat_id: query.message.chat.id,
                    message_id:query.message.message_id,
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cartByChatId[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                            [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                            [{text:'✅ Заказ на '+total_amount.toFixed(2)+' UZS Оформить?',callback_data:'formalize'}]
                        ]
                    },
                    parse_mode:'HTML'
                })
            })
            }else{console.log('no more right'+indexOf);indexOf--;indexOf=cartByChatId.length-1;}
            
    
    }else if(query.data=='🔻'){
console.log('indexOf*** '+indexOf)
console.log('down cart '+JSON.stringify(cartByChatId))
            
            if(cartByChatId[indexOf].count!=1){
                dataObj[2]=cartByChatId[indexOf].id
                decrementItemInCart(dataObj[2],query.message.chat.id)
                calculated_cost = cartByChatId[indexOf].cost*cartByChatId[indexOf].count

                var total_amount = 0    
                for(var i in cartByChatId){
                    total_amount=total_amount + (parseFloat(cartByChatId[i].cost)).toFixed(2) *cartByChatId[i].count
                }

            fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
                .then(data=>{ 
                bot.editMessageText('Корзина:\n '+cartByChatId[indexOf].cost+' UZS '+' x '+cartByChatId[indexOf].count+' = '+calculated_cost.toFixed(2)+' UZS \n\n'+'<a href="'+config.pre_url_picture+data.img+'">'+data.description+'</a>',{
                    chat_id: query.message.chat.id,
                    message_id:query.message.message_id,
                    reply_markup:{
                        inline_keyboard:[
                            [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cartByChatId[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                            [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                            [{text:'✅ Заказ на '+total_amount.toFixed(2)+' UZS Оформить?',callback_data:'formalize'}]
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
console.log('cartByChatId '+JSON.stringify(cartByChatId))
console.log('dataObj[2] '+dataObj[2]) //id of pruduct
            
            dataObj[2]=cartByChatId[indexOf].id
            incrementItemInCart(dataObj[2],query.message.chat.id)

            calculated_cost = cartByChatId[indexOf].cost*cartByChatId[indexOf].count

            var total_amount = 0    
            for(var i in cartByChatId){
                total_amount=total_amount + parseFloat(cartByChatId[i].cost)*cartByChatId[i].count
            }
            
console.log('Qara buyoga>>>>>>>'+calculated_cost)
        fetch(config.pre_url+`/product/img?id=${dataObj[2]}`).then(response => response.json())
            .then(data=>{ 
            bot.editMessageText('Корзина:\n '+cartByChatId[indexOf].cost+' UZS '+' x '+cartByChatId[indexOf].count+' = '+calculated_cost.toFixed(2)+' UZS \n\n'+'<a href="'+config.pre_url_picture+data.img+'">'+data.description+'</a>',{
                chat_id: query.message.chat.id,
                message_id:query.message.message_id,
                reply_markup:{
                    inline_keyboard:[
                        [{text:'❌',callback_data:'❌'},{text:'🔻',callback_data:'🔻'},{text:cartByChatId[indexOf].count+' шт.',callback_data:'c'},{text:'🔺',callback_data:'🔺'}],
                        [{text:'◀️',callback_data:'◀️'},{text: (indexOf+1)+'/'+cartByChatId.length,callback_data:'nu'},{text:'▶️',callback_data:'▶️'}],
                        [{text:'✅ Заказ на '+total_amount.toFixed(2)+' UZS Оформить?',callback_data:'formalize'}]
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
                    ['🚚📦 Доставить/Yetqazib\nberish'],
                    ['◀️ Назад в корзину','🚫 Отменить Заказ']
                ],
                resize_keyboard:true
            }
        })
    }
    else{
    //BY API////////////////////////////// 

        fetch(config.pre_url+`/category/get?id=${query.data}`).then(response => response.json())
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
                            caption:good.name+' - '+good.description,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text:'🛍 Купить - '+good.cost+' UZS' ,callback_data:'add'+' '+good.cost+' '+good.id+' '+counter}]
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
        var cartByChatId=[]
        var Item = function(id,cost,count,description,chatId){
            this.id = id
            this.cost = cost
            this.count = count
            this.description = description
            this.chatId = chatId
        }

        function addItemToCart(id,cost,count,description,chatId){
            for(var i in cart){
                if(cart[i].id === id && cart[i].chatId === chatId){
                    cart[i].count ++;
                    return
                }
            }
            var item = new Item(id,cost,count,description, chatId);
            cart.push(item);
        }


        function removeItemFromCart(id, chatId){
            for(var i in cart){
                if(cart[i].id===id && cart[i].chatId === chatId){
                    cart.splice(i,1);
                    break;
                }
            }
        }
        function incrementItemInCart(id, chatId){
            for(var i in cart){
                if(cart[i].id===id && cart[i].chatId === chatId){
                    cart[i].count++;
                    break
                }
            }
        }
        function decrementItemInCart(id, chatId){
            for(var i in cart){
                if(cart[i].id===id && cart[i].chatId === chatId){
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

        function removeItemFromCartAll(chatId){
           
            for(var i in cart){
                if(cart[i].chatId===chatId){
                    cart.splice(i,1)
                }
            }
            //bu oxirgi item qop ketvotkani uchun yana bitta loop qivoriw kk
            for(var i in cart){
                if(cart[i].chatId===chatId){
                    cart.splice(i,1)
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