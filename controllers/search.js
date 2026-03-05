// controllers/search.js
const Listing = require('../models/listing');

module.exports.simpleSearch = async (req, res) => {
    try {
        const { q } = req.query; // q = search query
        
        let listings = [];
        let searchPerformed = false;
        
        if (q && q.trim() !== '') {
            searchPerformed = true;
            
            // Simple text search across indexed fields
            listings = await Listing.find(
                { $text: { $search: q.trim() } },
                { score: { $meta: 'textScore' } } // Get relevance score
            )
            .sort({ score: { $meta: 'textScore' } }) // Sort by relevance
            .populate('owner')
            .limit(50); // Limit results for performance
        }
        
        res.render('listings/search-results', {
            listings,
            searchPerformed,
            searchQuery: q,
            resultsCount: listings.length
        });
        
    } catch (error) {
        console.error('Search error:', error);
        req.flash('error', 'Search failed. Please try again.');
        res.redirect('/listings');
    }
};