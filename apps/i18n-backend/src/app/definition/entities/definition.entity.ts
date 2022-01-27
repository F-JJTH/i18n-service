import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from "typeorm";
import { Timestamp } from "../../../classes/timestamp.class";
import { Product } from "../../product/entities/product.entity";
import { Translation } from "../../translation/entities/translation.entity";

@Entity()
export class Definition extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  defaultValue: string;

  @Index()
  @ManyToOne(() => Product, product => product.definitions)
  product: Product;

  @OneToMany(() => Translation, translation => translation.definition)
  translations: Translation[];

  @Column({ nullable: true })
  link: string;
  
  @Column({ nullable: true })
  picture: string;
}
