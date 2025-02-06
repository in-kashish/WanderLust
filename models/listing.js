const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;