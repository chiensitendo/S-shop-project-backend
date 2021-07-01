function setDefaultHeader(res) {
    res.setHeader("Content-type", 'application/json');
}

function convertUserSchemaToUserObject(schema) {
    let user = {};
    user.id = schema.id;
    user.name = schema.name;
    user.createdDate = schema.createdDate;
    if (schema.updatedDate) {
        user.updatedDate = schema.updatedDate;
    }
    return user;
}

module.exports = setDefaultHeader;
module.exports = convertUserSchemaToUserObject;