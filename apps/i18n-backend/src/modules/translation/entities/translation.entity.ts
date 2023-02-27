import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { Timestamp } from "../../../classes/timestamp.class";
import { Definition } from "../../definition/entities/definition.entity";
import { Language } from "../../language/entities/language.entity";
import { Product } from "../../product/entities/product.entity";

@Entity()
export class Translation extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Definition, definition => definition.translations)
  definition: Definition;

  @ManyToOne(() => Language, language => language.translations)
  language: Language;

  @Index()
  @ManyToOne(() => Product, product => product.translations)
  product: Product;

  @Column({nullable: true})
  value: string;

  @Column({default: false})
  isRequireTranslatorAction: boolean;

  @Column({default: false})
  isValid?: boolean;
}
