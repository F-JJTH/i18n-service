import { Component, Input, OnInit } from '@angular/core';
import { AdminQueriesService, I18nService, Member, Product } from '@kizeo/i18n/data-access';
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
  manageSettings = false
  manageDeploy = false
  manageTranslations = 'all'
  languages: {code: string}[] = []

  memberOptions: any[] = []

  isNew = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly adminQueries: AdminQueriesService,
    private readonly i18nSvc: I18nService,
  ) {}

  async ngOnInit() {
    this.isNew = !this.member

    if (this.member) {
      this.manageDefinitions = this.member.authorizations.definitions
      this.manageSettings = this.member.authorizations.settings
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
    const authorizations = {
      definitions: this.manageDefinitions,
      deploy: this.manageDeploy,
      settings: this.manageSettings,
      translations: this.manageTranslations === 'all' ? ['ALL'] : this.languages.filter(l => l.code !== 'ALL').map(l => l.code)
    }

    if (this.isNew && this.selectedMember) {
      await this.i18nSvc.addMemberToProduct(this.selectedMember.id, this.selectedMember.email, authorizations, this.product.id)
    } else if (this.member) {
      await this.i18nSvc.updateMemberForProduct(this.member.id, authorizations, this.product.id)
    }

    this.modalRef.triggerOk()
  }

  onCancelClicked() {
    this.modalRef.triggerCancel()
  }
}
