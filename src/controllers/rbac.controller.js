const { SuccessResponse } = require('../core/success.response');
const { createResource, listResouce, createRole, listRole } = require('../services/rbac.service');

class RbacController{
    newResource = async (req, res, next) => {
        new SuccessResponse({
            message: "create resource successfully",
            metadata: await createResource(req.body)
        }).send(res)
    }

    getResource = async (req, res, next) => {
        new SuccessResponse({
            message: "get resource successfully",
            metadata: await listResouce(req.query)
        }).send(res)
    }

    newRole = async (req, res, next) => {
        new SuccessResponse({
            message: "create role successfully",
            metadata: await createRole(req.body)
        }).send(res)
    }

    getRole = async (req, res, next) => {
        new SuccessResponse({
            message: "get role successfully",
            metadata: await listRole(req.query)
        }).send(res)
    }
}

module.exports = new RbacController();