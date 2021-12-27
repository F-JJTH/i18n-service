import { Component, OnInit } from '@angular/core';
import { APIService } from '@kizeo/i18n/data-access';

@Component({
  selector: 'kizeo-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent implements OnInit {

  products: any[] = []

  constructor(private api: APIService) {}

  async ngOnInit(): Promise<void> {
    this.api.ListProducts().then(res => {
      this.products = res.items
    })
  }

}
