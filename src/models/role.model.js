const { Types, model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

const roleSchema = new Schema({
    role_name: { type: String, default: 'user', enum: ['USER', 'ADMIN']},
    role_slug: { type: String, required: true },
    role_status: { type: String, default: 'active', enum: ['active', 'block', 'pending']},
    role_description: { type: String, default: '' },
    role_grants: [
        {
            resource: { type: Schema.Types.ObjectId, ref: 'Resource', require: true  },
            actions: [{ type: String, require: true}],
            attributes: { type: String, default: '*' }
        }
    ]
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, roleSchema);