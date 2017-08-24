const defaults = require('./lib/defaults');
const orderPackageKeys = require('./lib/orderKeys');
const transformValues = require('./lib/transformValues');

function orderPackage(pkg,  options = {}) {
  const { order, transformations } = Object.assign({}, defaults, options);

  const orderedKeys = orderPackageKeys(pkg, order);

  const collection = transformValues(orderedKeys, pkg, transformations);

  const map = collection.reduce((obj, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    obj[key] = value;
    return obj;
  }, {});

  // Safety check
  //   - every key from package.json is in the collection
  //   - every key in the collection is in package.json
  
  if (
    Object.keys(pkg).some(k => !map[k]) ||
    collection.some(([k]) => !pkg[k])
  ) {
    throw new Error('Something went wrong and some keys were lost - this sort was cancelled and nothing written')
  }

  map.toArray = () => collection;
  collection.toObject = () => map;
  collection.toJSON = (_, space = 2) => JSON.stringify(map, _, space)

  return collection;
}

module.exports = orderPackage;