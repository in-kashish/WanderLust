const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default:
            "https://media.istockphoto.com/id/1205289672/photo/majestic-bright-sunrise-over-ocean.jpg?s=1024x1024&w=is&k=20&c=Iu120uS9o3MkPOOVK7dmZAZqugnaFEgO8Tgzcm41Y8k=",
        set: (v) =>
            v === ""
              ? "https://media.istockphoto.com/id/1205289672/photo/majestic-bright-sunrise-over-ocean.jpg?s=1024x1024&w=is&k=20&c=Iu120uS9o3MkPOOVK7dmZAZqugnaFEgO8Tgzcm41Y8k="
              : v,
      },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
    await Review.deleteMany({reviews: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;