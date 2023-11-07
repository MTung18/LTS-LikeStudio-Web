class NoticeBoard {
 constructor(init) {
  Object.assign(this, init);
 }
}

const fileData = {
 id: null,
 titleId: null,
 content: " ",
 views: null,
 createDate: null,
 createUser: null,
 editDate: null,
 editUser: null,
 gim: null,
 ginDate: null,
 show: null,
 popup: null,
};

const address = new NoticeBoard(fileData);