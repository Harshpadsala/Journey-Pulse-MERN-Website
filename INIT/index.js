const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
if (process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
    
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
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
    initData.data = initData.data.map((obj)=>({...obj , owner : '65a4d08f3af475bcd593d934'}));
    await Listing.insertMany(initData.data);
    console.log('initialization is done');
}   

initDB();