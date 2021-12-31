// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Product, Language, Translation, Definition, MemberAuthorization, Member } = initSchema(schema);

export {
  Product,
  Language,
  Translation,
  Definition,
  MemberAuthorization,
  Member
};