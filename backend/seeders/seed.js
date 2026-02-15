const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Run seeders
        console.log('\n--- Seeding Badges ---');
        await require('./badgeSeeder');

        console.log('\n--- Seeding Placement Questions ---');
        await require('./placementQuestionSeeder');

        console.log('\n--- Seeding Complete ---');
        process.exit(0);

    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();