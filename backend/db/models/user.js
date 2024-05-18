const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ROLES = ['admin', 'client'];
const ROLES_MAP = {
    ADMIN: 'admin',
    CLIENT: 'client',
};
var userSchema = new mongoose.Schema(
    {
        username: String,
        name: String,
        email: { type: String, trim: true, unique: true },
        phone_number: { type: String, trim: true },
        avatar: { type: String },
        github_username: String,
        linkedin_username: String,
        moss_api_key: [{ type: String, trim: true, required: false }],
        role: { type: String, required: true, enum: ROLES, default: ROLES_MAP.CLIENT },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('muser', userSchema);
