const utils = {
 getFileType(data) {
  const fileName = data;
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return fileExtension;
 }
};

export default utils;
