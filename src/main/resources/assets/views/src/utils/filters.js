const getObject = (collection, keyValue, keyName) =>
(collection && keyValue ? collection.filter((item) => {
  if (item[keyName] && keyValue) {
    if (item[keyName].toString() === keyValue.toString()) {
      return item;
    }
  }

  return null;
}) : null);

const getClients = (mainCollection, subCollection) =>
((mainCollection && subCollection) ? mainCollection.filter((item) => {
  return !subCollection.some((item1) => {
    return item._id === item1.client_id;
  })
}) : null);

export {
  getObject,
  getClients,
};
