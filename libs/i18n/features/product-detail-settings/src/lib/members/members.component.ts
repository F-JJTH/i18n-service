import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService, I18nService, Member, Product } from '@kizeo/i18n/data-access';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddEditMemberModalComponent } from '../add-edit-member-modal/add-edit-member-modal.component';
import { ZenObservable } from 'zen-observable-ts';

@Component({
  selector: 'kizeo-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {

  product!: Product

  dtStoreSubscription?: ZenObservable.Subscription

  currentUserId = ""

  constructor(
    private readonly route: ActivatedRoute,
    private readonly modal: NzModalService,
    private readonly currentUser: CurrentUserService,
    private readonly i18nSvc: I18nService,
  ) { }

  async ngOnInit() {
    this.product = this.route.parent?.parent?.snapshot.data['product']

    this.dtStoreSubscription = this.i18nSvc.observeProductById(this.product.id).subscribe(data => {
      this.product = data.element
    })

    this.currentUserId = (await this.currentUser.getPayload()).sub
  }

  ngOnDestroy(): void {
    this.dtStoreSubscription?.unsubscribe()
  }

  get members() {
    return this.product.authorizations as Member[] || []
  }

  onAddNewMemberClicked() {
    this.modal.create({
      nzContent: AddEditMemberModalComponent,
      nzComponentParams: {
        product: this.product,
      }
    })
  }

  async confirmDelete(member: Member) {
    await this.i18nSvc.deleteMemberFromProduct(member.id, this.product.id)
  }

  onEditMemberClicked(member: Member) {
    this.modal.create({
      nzContent: AddEditMemberModalComponent,
      nzComponentParams: {
        product: this.product,
        member,
      }
    })
  }
}
