const mongoose = require('mongoose'); // Erase if already required
const validateMongodId = (id => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Id');
    }
})

module.exports = validateMongodId;