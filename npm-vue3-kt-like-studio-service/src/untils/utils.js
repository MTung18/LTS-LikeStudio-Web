const utils = {
 getFileType(data) {
  const fileName = data;
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return fileExtension;
 },

 generateRandomNumber() {
  const min = 10000000;
  const max = 99999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
 },

 generateFileName(data) {
  
 }
};

export default utils;
