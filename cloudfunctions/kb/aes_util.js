const CryptoJS = require('./aes.js'); //引用AES源码js
/**
 * Aes解密
 * @param {*} word 密文
 * @param {*} keyHex 密钥
 * @param {*} ivHex 偏移量
 */
function AesDecrypt(word, keyHex, ivHex) {
  const key = CryptoJS.enc.Utf8.parse(keyHex); //十六位十六进制数作为密钥
  const iv = CryptoJS.enc.Utf8.parse(ivHex); //十六位十六进制数作为密钥偏移量
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}


//暴露接口
module.exports = {
  AesDecrypt
}