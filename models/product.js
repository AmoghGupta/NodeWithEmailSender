const mongoDB = require("../utils/database"); 
const ObjectId = require('mongodb').ObjectId; 
const rootPath = require('../utils/path');

class Product {
    constructor(body){
        this.title = body.title;
        this.description = body.description;
        this.price = body.price.toString();
    }

    save(){        
         /** CONNECT TO DB */
         const db = mongoDB.getDb();
         return db.collection('products').insertOne(this);
    }

    static fetchAll(){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('products').find().toArray();
    }

    static findById(productId,){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        var o_id = new ObjectId(productId);
        return db.collection('products').findOne({"_id":o_id})
    }
}


module.exports = Product;