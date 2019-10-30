const mongoDB = require("../utils/database"); 
const ObjectId = require('mongodb').ObjectId; 
const rootPath = require('../utils/path');

class AuthModel {
    constructor(body){
        this.emailId = body.email;
        this.password = body.password;
    }

    save(){        
         /** CONNECT TO DB */
         const db = mongoDB.getDb();
         return db.collection('authorization').insertOne(this);
    }

    static fetchAllUsers(){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('authorization').find().toArray();
    }

    static findByEmailId(email){
        /** CONNECT TO DB */
        const db = mongoDB.getDb();
        return db.collection('authorization').findOne({"emailId":email})
    }
}


module.exports = AuthModel;