const _ = require('lodash');
const { Types } = require('mongoose');

const getInfoData = ({ fileds = [], object = {} })=>{
    return _.pick( object, fileds );
}

const convertToObject = id => new Types.ObjectId(id);

module.exports = {
    getInfoData,
    convertToObject
}