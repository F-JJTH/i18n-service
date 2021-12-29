import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzSelectModeType } from 'ng-zorro-antd/select';
import { SelectLanguageCodes, SelectLanguageOption } from './select-language-option.interface';

@Component({
  selector: 'kizeo-select-language',
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.css'],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectLanguageComponent), multi: true}],
})
export class SelectLanguageComponent implements OnInit, ControlValueAccessor {

  options: SelectLanguageOption[] = [
    { label: 'French',  code: SelectLanguageCodes.FR },
    { label: 'English', code: SelectLanguageCodes.EN },
    { label: 'Spanish', code: SelectLanguageCodes.ES },
    { label: 'Deutsch', code: SelectLanguageCodes.DE },
  ]

  _value: SelectLanguageOption | null = null

  _disabled: boolean = false

  @Input() mode: NzSelectModeType = 'default'

  @Input() excludeLanguages: string[] = []

  constructor() { }

  ngOnInit(): void {
  }

  getFilteredOptions() {
    return this.options.filter(option => !this.excludeLanguages.includes(option.code))
  }

  _onChange = (value: any) => {}

  _onTouched = () => {}

  writeValue(value: SelectLanguageOption | null): void {
    this._value = value
  }
  registerOnChange(fn: any): void {
    this._onChange = fn
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled
  }

}
