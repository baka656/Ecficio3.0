const admin = require('firebase-admin');

var serviceAccount = require("./credentials.json");
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const dumped = {};

const schema = {
  participants: {
    eventname:String,
    marks:Number,
    receipt:String,
    id:String,
    name:String,
    college:String,
    phone:Number,
    rollno:String,
    timestamp:String,
    email:String,
  }
};

var db = admin.firestore();
  const dump = (dbRef, aux, curr) => {
  return Promise.all(Object.keys(aux).map((collection) => {
    return dbRef.collection(collection).get()
      .then((data) => {
        let promises = [];
        data.forEach((doc) => {
          const data = doc.data();
          if(!curr[collection]) {
            curr[collection] =  { 
              data: { },
              type: 'collection',
            };
            curr[collection].data[doc.id] = {
              data,
              type: 'document',
            }
          } else {
            curr[collection].data[doc.id] = data;
          }
          promises.push(dump(dbRef.collection(collection).doc(doc.id), aux[collection], curr[collection].data[doc.id]));
      })
      return Promise.all(promises);
    });
  })).then(() => {
    return curr;
  })
};
let aux = { ...schema };
let answer = {};
dump(db, aux, answer).then((answer) => {
  fs.writeFileSync('./excelbaka.json', JSON.stringify(answer, null, 4), 'utf8');
  console.log(JSON.stringify(answer, null, 4));
});