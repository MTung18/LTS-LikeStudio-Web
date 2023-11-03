class Faq {
 constructor(init) {
   Object.assign(this, init);
 }
}

const faqData = {
 id: null,
 title: " ",
 category: null,
 content: " ",
 views: null,
 createDate: null,
 createUser: null,
 editDate: null,
 editUser: null,
 show: null
};

const address = new Faq(faqData);