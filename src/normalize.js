import { has, isObject } from 'lodash/fp';

const extractFields = async (item, ctx) => {
  if (Array.isArray(item)) {
    for (const element of item) {
      await extractFields(element, ctx);
    }

    return;
  }

  if (isObject(item)) {
    for (const key in item) {
      await extractFields(item[key], ctx);
    }

    return;
  }
};

exports.isDynamicZone = (node) => {
  // Dynamic zones are always arrays
  if (Array.isArray(node)) {
    return node.some((nodeItem) => {
      // The object is a dynamic zone if it has a strapi_component key
      return has('strapi_component', nodeItem);
    });
  }
  return false;
};

// Downloads media from image type fields
exports.downloadMediaFiles = async (entities, ctx) => {
  return Promise.all(entities.map((entity) => extractFields(entity, ctx)));
};
