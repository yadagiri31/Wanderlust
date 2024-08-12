const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:String,
        url:{
            type:String,
            default:"https://tse1.mm.bing.net/th?id=OIP.hOlk0w05OLs3BXnUWLoKqQHaEo&pid=Api&P=0&h=180",
            set : (v)=>v===""
            ?"https://tse1.mm.bing.net/th?id=OIP.hOlk0w05OLs3BXnUWLoKqQHaEo&pid=Api&P=0&h=180"
            :v
        }
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner :{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
// post mongoose middle ware
listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({reviews:{$in: listing.reviews}});
    }
});
const Listing = mongoose.model("Listing",listSchema);

module.exports = Listing;