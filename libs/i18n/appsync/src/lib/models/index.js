// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Product, Language, Definition, Translation } = initSchema(schema);

export {
  Product,
  Language,
  Definition,
  Translation
};