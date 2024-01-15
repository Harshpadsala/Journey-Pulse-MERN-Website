const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
// const ExpressError = require("../utils/ExpressErrors");
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const addCoordinates = async (listing) => {
//     let response = await geocodingClient.forwardGeocode({
//         query: listing.location,
//         limit: 1
//       }).send();
      
//     listing.geometry = response.body.features[0].geometry;
//     return listing;
// }

//index route
module.exports.index = (async (req,res)=>{
    const allListing = await Listing.find({});
    res.render('listings/index.ejs',{allListing});
});

//new listing
module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs');
};

//show listing
module.exports.showListing = async(req,res)=>{
    let {id}= req.params;

    const listing = await Listing.findById(id)
        .populate({path : 'reviews',
            populate :{
                path : 'author',
                },
            })
        .populate('owner');

    if(!listing){
        req.flash('error','Listing you requested for does not exist !');
        res.redirect('/listings');
    }

    // listing = await addCoordinates(listing);
    res.render('listings/show.ejs',{listing});
};

//Create listing - new listing post request
module.exports.createListing = async (req,res,next)=>{

    let response = await geocodingClient
    .forwardGeocode({
        query : req.body.listing.location,
        limit : 1
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}; 

    console.log(response.body.features[0].geometry);


    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash('success','New Listing Created!');
    res.redirect('/listings');
};

//edit listing get request
module.exports.renderEditForm = async (req,res)=>{
    let {id}= req.params;

    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing you requested for does not exist !');
        res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload','/upload/h_300,w_250');
 
    res.render('listings/edit.ejs',{ listing , originalImageUrl });
    
};

//Update listing - edit lising post request
module.exports.updateListing = async (req,res)=>{

    let {id}= req.params;    

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if ( typeof (req.file) !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url , filename };
        await listing.save();
    }

    // listing = await addCoordinates(listing);
    // await listing.save();

    req.flash('success','Listing Updated!');
    res.redirect(`/listings/${id}`);
};

//delete listing
module.exports.destroyListing = async (req,res)=>{
    let {id}= req.params;
    const dl = await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!');
    res.redirect('/listings');
};