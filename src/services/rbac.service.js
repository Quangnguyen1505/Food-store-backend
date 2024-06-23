const ROLE = require('../models/role.model');
const SRC = require('../models/resource.model');
const { BadRequestError } = require('../core/error.response');

const createRole = async ({
    name = 'USER',
    slug = 's00001',
    description = 'extend from user or user',
    grants = []
}) => {
    const newRole = await ROLE.create({
        role_name: name,
        role_slug: slug,
        role_description: description,
        role_grants: grants
    });

    if(!newRole) throw new BadRequestError('role create error');

    return newRole;
}

const listRole = async ({
    userId = 0, //admin
    limit = 10,
    offset = 0,
    search = ''
}) => {
    const role = await ROLE.aggregate([
        {
            $unwind: '$role_grants'
        },
        {
            $lookup: {
                from: 'Resources',
                localField: 'role_grants.resource',
                foreignField: '_id',
                as: 'resource'            
            }
        },
        {
            $unwind: '$resource'
        },
        {
            $project: {
                role: '$role_name',
                resource: '$resource.src_name',
                action: '$role_grants.actions',
                attributes: '$role_grants.attributes',      
            }
        },
        {
            $unwind: '$action'
        },
        {
            $project: {
                _id: 0,
                role: 1,
                resource: 1,
                action: '$action',
                attributes: 1,      
            }
        },
    ])

    if(!role) throw new BadRequestError('role not exists!');
    return role;
}

const createResource = async ({name = 'profile', slug = 'p00001', description = ''}) => {
    const newResource = await SRC.create({
        src_name: name,
        src_slug: slug,
        src_description: description
    });
    if(!newResource) throw new BadRequestError('role create error');

    return newResource;
}

const listResouce = async ({
    userId = 0, //admin
    limit = 10,
    offset = 0,
    search = ''
}) => {
    try {
        const resource = await SRC.aggregate([
            {
                $project: {
                    _id: 0,
                    src_name: 1,
                    src_slug: 1,
                    src_description: 1
                }
            }
        ]);
        
        return resource;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createRole,
    listRole,
    createResource,
    listResouce
}