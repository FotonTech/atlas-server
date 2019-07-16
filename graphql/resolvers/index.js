const authResolver = require("./auth");
const postResolver = require("./postResolver");

const rootResolver = {
  ...authResolver,
  ...postResolver
};

module.exports = rootResolver;
