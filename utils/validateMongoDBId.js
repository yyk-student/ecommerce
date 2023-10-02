const mongoose = require('mongoose');
const validatMongoDbId = (id) => {
    const isValid = mongoose.Schema.Types.isValid(id);
    if (!isValid) {
        throw new Error('Invalid MongoDb Id');
    }
}

module.exports = validatMongoDbId;