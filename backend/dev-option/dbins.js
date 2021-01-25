const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://einzelganger:<password>@veinzel1.qurwg.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    var myobj = { name: "Company Inc", address: "Highway 37" };
    const collection = client.db("test").collection("devices").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });;
    // perform actions on the collection object
    client.close();
});
// client.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("customers").insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// }); 