import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Timestamp } from "../../../classes/timestamp.class";
import { Product } from "./product.entity";

@Entity()
export class MemberAuthorization extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, product => product.authorizations)
  product: Product

  @Column()
  email: string;

  @Column({ default: false })
  definitions: boolean;

  @Column({ default: false })
  settings: boolean;

  @Column({ default: false })
  deploy: boolean;

  @Column({ default: false })
  validator: boolean;

  @Column('text', { array: true, default: [] })
  translations: string[];
}
