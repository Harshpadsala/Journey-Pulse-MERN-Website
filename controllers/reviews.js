const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.createReview = async (req,res) =>{
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    console.log('new review saved');
    req.flash('success','New Review Posted!');
    res.redirect(`/listings/${listing._id}`);

};

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id);
    console.log(reviewId);

    await Listing.findByIdAndUpdate(id,{ $pull : { reviews : reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('error','Review Deleted!');
    res.redirect(`/listings/${id}`);
    // res.send('removed')
};
