const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = 'mongodb://127.0.0.1:27017/nestify';

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(mongo_url);
}

const initialize = async() =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj , owner : "679caeb7f26e37d90a0b1dd3"}))
    await Listing.insertMany(initdata.data);
    console.log("data initialized");
}
initialize();