const mongoose = require('mongoose');
const Listing = require('../models/listing'); // Correct relative path to listing.js

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/nestify', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  updateURLField();
}).catch(err => {
  console.error('Connection error', err);
});

async function updateURLField() {
  try {
    // Find all documents where 'image.URL' exists
    const listings = await Listing.find({ "image.URL": { $exists: true } });
    
    for (let listing of listings) {
      // Rename 'URL' to 'url'
      listing.image.url = listing.image.URL;
      delete listing.image.URL;  // Remove the old 'URL' field
      
      // Save the updated document
      await listing.save();
    }

    console.log('All documents updated successfully.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error updating documents:', err);
  }
}
