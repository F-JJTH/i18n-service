import { Component, Input, OnInit } from '@angular/core';
import { I18nService, Member, MemberAuthorization, Product } from '@kizeo/i18n/data-access';
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

  manageValidations = false
  manageDefinitions = false
  manageSettings = false
  manageDeploy = false
  manageTranslations = 'none'
  languages: {code: string}[] = []

  memberOptions: any[] = []

  isNew = false

  constructor(
    private readonly modalRef: NzModalRef,
    private readonly i18nSvc: I18nService,
  ) {}

  async ngOnInit() {
    this.isNew = !this.member

    if (this.member) {
      this.manageValidations = this.member.validator ?? false
      this.manageDefinitions = this.member.definitions
      this.manageSettings = this.member.settings
      this.manageDeploy = this.member.deploy
      this.manageTranslations = this.member.translations?.includes('ALL') ? 'all' : this.member.translations?.length ? 'specific' : 'none'
      this.languages = (this.member.translations as string[]).map(t => ({code: t}))
    }

    if (this.isNew) {
      this.memberOptions = await this.i18nSvc.listUsers()
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
    const authorizations: MemberAuthorization = {
      validator: this.manageValidations,
      definitions: this.manageDefinitions,
      deploy: this.manageDeploy,
      settings: this.manageSettings,
      translations: this.manageTranslations === 'all' ? ['ALL'] : this.manageTranslations === 'none' ? [] : this.languages.filter(l => l.code !== 'ALL').map(l => l.code)
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

  isValidForm(): boolean {
    return (!!this.selectedMember || !!this.member) &&
      (
        this.manageDefinitions ||
        this.manageSettings ||
        this.manageDeploy ||
        this.manageValidations ||
        this.manageTranslations === 'all' || (this.manageTranslations === 'specific' && !!this.languages.length)
      )
  }
}
