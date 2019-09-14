const  guid_generator =  function(){
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function message_generator(){
    const msg_list = [
        'Random message ' + (Math.floor((Math.random()*1000)+1))
    ]
    var retVal = msg_list[0];
    return retVal;
}


//Math.floor((Math.random()*15)+1)



module.exports = {
    guid_generator,
    message_generator
};
