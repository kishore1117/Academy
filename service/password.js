

const CryptoJS = require('crypto-js');

  // Define the encryption key
  const encryptionKey = 'ThisIsASecretKey';
  
  // Function to encrypt data
  function encryptData(plaintext) {
    const ciphertext = CryptoJS.AES.encrypt(plaintext, encryptionKey).toString();
    return ciphertext;
  }
  
  // Function to decrypt data
  function decryptData(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }


  module.exports={encryptData,decryptData}