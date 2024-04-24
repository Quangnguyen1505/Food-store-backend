const _ = require('lodash');
const { Types } = require('mongoose');

const getInfoData = ({ fileds = [], object = {} })=>{
    return _.pick( object, fileds );
}

const getDataSelectFood = ( select = [] ) => {
    return Object.fromEntries(select.map(el => [el, 1]));
}

const convertToObject = id => new Types.ObjectId(id);

module.exports = {
    getInfoData,
    convertToObject,
    getDataSelectFood
}