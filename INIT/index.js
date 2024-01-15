const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  }

main()
    .then((res)=>{
        console.log('Database connected successfully');
    })
    .catch((err)=>{
        console.log(err);
    });
    

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj , owner : '659e9b8fbee7bc5b6d21fc7d'}));
    await Listing.insertMany(initData.data);
    console.log('initialization is done');
}   

initDB();