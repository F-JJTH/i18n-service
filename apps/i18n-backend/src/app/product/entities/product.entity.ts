import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Timestamp } from "../../../classes/timestamp.class";
import { Language } from "../../language/entities/language.entity";
import { Definition } from "../../definition/entities/definition.entity";
import { Translation } from "../../translation/entities/translation.entity";
import { MemberAuthorization } from "./member-authorization.entity";

@Entity()
export class Product extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  defaultLanguage: string;

  @OneToMany(() => Language, language => language.product, {eager: true})
  languages: Language[];
  
  @OneToMany(() => Definition, definition => definition.product)
  definitions: Definition[];
  
  @OneToMany(() => Translation, translation => translation.product)
  translations: Translation[];
  
  @Column('text', { array: true, default: [] })
  members: string[];

  @OneToMany(() => MemberAuthorization, memberAuthorization => memberAuthorization.product, {eager: true})
  authorizations: MemberAuthorization[];
  
  @Column({nullable: true})
  publishedPreprodAt: string;

  @Column({nullable: true})
  publishedProdAt: string;
}
