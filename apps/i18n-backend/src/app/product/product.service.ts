import { Injectable } from '@nestjs/common';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: string) {
    return `This action returns a #${id} product`;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }

  addMember(id: string, member: AddMemberDto) {
    return `This action adds a new member #${member.memberId} to product #${id}`;
  }

  updateMember(id: string, memberId: string, updateMemberDto: UpdateMemberDto) {
    return `This action updates a member #${memberId} in product #${id}`;
  }

  removeMember(id: string, memberId: string) {
    return `This action removes a member #${memberId} to product #${id}`;
  }

  publishTranslations(id: string, env: string) {
    return `This action publishes translations #${env} for product #${id}`;
  }

  getLanguage(id: string) {
    return `This action returns languages for product #${id}`;
  }

  getDefinition(id: string) {
    return `This action returns definitions for product #${id}`;
  }

  getTranslation(id: string) {
    return `This action returns translations for product #${id}`;
  }

}
