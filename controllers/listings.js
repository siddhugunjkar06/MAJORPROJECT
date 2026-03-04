const Listing = require("../models/listing");


const mapToken = process.env.MAP_TOKEN; 


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings});
};

module.exports.renderNewform = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params; 
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    // The route-planner SDK doesn't offer geocoding; we hit Geoapify's
    // geocode endpoint directly. Node 18+ has a built-in fetch API.
    const address = req.body.listing?.location;
    try {
        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            address
        )}&apiKey=${mapToken}`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();
        // if we got a geocode hit, attach the correct geometry object required by the listing schema.
        if (geoData.features && geoData.features[0]) {
            const [lng, lat] = geoData.features[0].geometry.coordinates;
            req.body.listing.geometry = {
                type: "Point",
                coordinates: [lng, lat],
            };
        }
    } catch (e) {
        console.error("geocoding error", e);
    }

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    // geometry was already added to req.body.listing above if available
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let {id} = req.params; 
    const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
        
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
    
};