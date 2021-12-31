import { Component, Input, OnInit } from '@angular/core';
import { AdminQueriesService, Member, Product } from '@kizeo/i18n/data-access';
import { DataStore } from 'aws-amplify';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'kizeo-add-edit-member-modal',
  templateUrl: './add-edit-member-modal.component.html',
  styleUrls: ['./add-edit-member-modal.component.scss']
})
export class AddEditMemberModalComponent implements OnInit {
  @Input() product!: Product

  @Input() member?: Member

  selectedMember?: Member

  manageDefinitions = false
  manageLanguages = false
  manageDeploy = false
  manageTranslations = 'all'
  languages: {code: string}[] = []

  memberOptions: any[] = []

  isNew = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly adminQueries: AdminQueriesService,
  ) {}

  async ngOnInit() {
    this.isNew = !this.member

    if (this.member) {
      this.manageDefinitions = this.member.authorizations.definitions
      this.manageLanguages = this.member.authorizations.languages
      this.manageDeploy = this.member.authorizations.deploy
      this.manageTranslations = this.member.authorizations.translations?.includes('ALL') ? 'all' : 'specific'
      this.languages = (this.member.authorizations.translations as string[]).map(t => ({code: t}))
    }

    if (this.isNew) {
      this.memberOptions = await this.adminQueries.listUsers()
        .then((users: any[]) => users.map((u: any) => ({
            ...u,
            id: u.Attributes.find((a: any) => a.Name === 'sub').Value,
            email: u.Attributes.find((a: any) => a.Name === 'email').Value
          }))
          .filter(u => !this.product.members?.includes(u.id))
        )
    }
  }

  async onCreateOrEditClicked() {
    const newAuthorizations = {
      definitions: this.manageDefinitions,
      deploy: this.manageDeploy,
      languages: this.manageLanguages,
      translations: this.manageTranslations === 'all' ? ['ALL'] : this.languages.filter(l => l.code !== 'ALL').map(l => l.code)
    }

    if (this.isNew && ! this.selectedMember) return

    const product: Product = (await DataStore.query(Product, this.product.id))!
    await DataStore.save(Product.copyOf(product, updated => {
      if (this.isNew) {
        updated.members = [...product.members!, this.selectedMember?.id!]

        updated.authorizations = [...product.authorizations!, {
          email: this.selectedMember?.email!,
          id: this.selectedMember?.id!,
          authorizations: newAuthorizations
        }]
      } else {
        updated.authorizations = product.authorizations?.map(a => {
          if (a?.id !== this.member?.id) return a
          return {...a!, authorizations: newAuthorizations}
        })
      }
    }))

    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }
}
