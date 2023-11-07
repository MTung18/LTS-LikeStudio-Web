class FileManager {
 constructor(init) {
   Object.assign(this, init);
 }
}

const fileData = {
 id: null,
 titleId: null,
 functionType: null,
 oriFileName: " ",
 createDate: null,
 createUser: null,
 uniqFileName: " ",
};

const address = new FileManager(fileData);