import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from "typeorm";
import { Timestamp } from "../../../classes/timestamp.class";
import { Product } from "../../product/entities/product.entity";
import { Translation } from "../../translation/entities/translation.entity";

@Entity()
export class Language extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: false })
  isDisabled: boolean;

  @Index()
  @ManyToOne(() => Product, product => product.languages)
  product: Product;
  
  @OneToMany(() => Translation, translation => translation.language)
  translations: Translation[];
  
  @Column({ default: false })
  isRequireTranslatorAction: boolean;
}
