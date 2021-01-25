import mongoose from 'mongoose';

mongoose.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true
}, (error) => {
    if (error) {
        console.log('Error', error);
    }
    else {
        console.log('Database connection established.');
    }
});

// established connection

const connection = mongoose.connection;

