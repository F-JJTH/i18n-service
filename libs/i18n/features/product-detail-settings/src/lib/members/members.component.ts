import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService, I18nService, Member, Product } from '@kizeo/i18n/data-access';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddEditMemberModalComponent } from '../add-edit-member-modal/add-edit-member-modal.component';

@Component({
  selector: 'kizeo-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  product!: Product

  productId!: string

  currentUserId = ""

  constructor(
    private readonly route: ActivatedRoute,
    private readonly modal: NzModalService,
    private readonly currentUser: CurrentUserService,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    this.productId = this.route.parent?.parent?.snapshot.data['product'].id

    await this.fetch()

    this.currentUserId = (await this.currentUser.getPayload()).sub
  }

  async fetch() {
    this.product = await this.i18nSvc.getProductById(this.productId)
  }

  get members() {
    return this.product.authorizations as Member[] || []
  }

  onAddNewMemberClicked() {
    this.modal.create({
      nzContent: AddEditMemberModalComponent,
      nzComponentParams: {
        product: this.product,
      },
      nzOnOk: () => this.fetch(),
    })
  }

  async confirmDelete(member: Member) {
    await this.i18nSvc.deleteMemberFromProduct(member.id, this.product.id)
    this.fetch()
  }

  onEditMemberClicked(member: Member) {
    this.modal.create({
      nzContent: AddEditMemberModalComponent,
      nzComponentParams: {
        product: this.product,
        member,
      },
      nzOnOk: () => this.fetch(),
    })
  }
}
