const { AuthFailureError } = require('../core/error.response');
const { listRole } = require('../services/rbac.service');
const ac = require('./rbac.middleware');

const grantAccess = ( action, resource ) => {
    return async (req, res, next) => {
        console.log("list role::", await listRole({
            userId: 999
        }));
        try {
            ac.setGrants( await listRole({
                userId: 999
            }));
            const role_name = req.query.role;
            const permission = ac.can(role_name)[action](resource);
            if(!permission.granted){
                throw new AuthFailureError('you dont have enough permission !!');
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { 
    grantAccess
}