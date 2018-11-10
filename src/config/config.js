exports.optionConfig = function optionConfig(debug, today) {
    return {
      debug: debug,
      today: today,
    };
};
exports.sesConfig = function sesConfig(){
    return {
        key: process.env.SES_KEY,
        secret: process.env.SES_SECRET
    }
}
exports.mailConfig = function mailConfig(){
    return {
        errorEmailAddr: process.env.ERROR_EMAIL_ADDR,
    }
}
