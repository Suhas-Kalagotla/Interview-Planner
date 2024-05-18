const mongoose = require('mongoose');

const MOSS_ACCOUNT_ACTIVE = ['active', 'inactive', 'pending']
const MOSS_ACCOUNT_ACTIVE_MAP = {
  ACTIVE : "active",
  INACTIVE : "inactive",
  PENDING : "pending"
}

var accountSchema = new mongoose.Schema(
    {
        moss_api_key: { type: String, trim: true, required: false },
        user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'muser' }],
        is_active: { type: String, enum: MOSS_ACCOUNT_ACTIVE, default: MOSS_ACCOUNT_ACTIVE_MAP.PENDING },
        is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

module.exports = mongoose.model('maccount', accountSchema);
