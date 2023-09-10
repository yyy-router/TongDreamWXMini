const CryptoJS = require('./aes.js'); //引用AES源码js
function getRamNumber() {
  var result = '';
  for (var i = 0; i < 16; i++) {

    result += Math.floor(Math.random() * 16).toString(16); //获取0-15并通过toString转16进制
  }

  //默认字母小写，手动转大写
  return result.toUpperCase(); //另toLowerCase()转小写
}

/**
 * aes 加密方法
 */
function AesEncrypt(word) {
  const keyHex = getRamNumber()
  const ivHex = getRamNumber()
  const key = CryptoJS.enc.Utf8.parse(keyHex); //十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse(ivHex); //十六位十六进制数作为密钥偏移量
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {
    key: keyHex,
    iv: ivHex,
    Str: encrypted.ciphertext.toString().toUpperCase()
  };
}


//暴露接口
module.exports = {
  AesEncrypt
}