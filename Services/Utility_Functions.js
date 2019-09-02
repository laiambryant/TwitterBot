const  guid_generator =  function(){
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function message_generator(){
    const msg_list = [
        'Putin is my President',
        'MAGA',
        'We love Trump',
        'We love Putin',
        '#MAGA They say we are bots',
        'Democrats are losers',
        'Hillary Clinton is unfit to be president',
        'Putin can ride bears, can your president ride bears?',
        'Im totally not a russian bot',
        'Trump has approval rates of 101%',
        'Believe in the russian dream',
        'Lets make russia great again',
        'MAKE AMERICA GREAT AGAIN',
        '#trump2020 MAGA',
        '#putinforever Putin best president'
    ]
    var retVal = msg_list[Math.floor((Math.random()*15)+1)];
    return retVal;
}


//Math.floor((Math.random()*15)+1)



module.exports = {
    guid_generator,
    message_generator
};