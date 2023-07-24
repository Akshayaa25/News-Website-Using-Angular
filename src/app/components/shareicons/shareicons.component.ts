import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-shareicons',
  templateUrl: './shareicons.component.html',
  styleUrls: ['./shareicons.component.css']
})
export class ShareiconsComponent implements OnInit{
  article: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data.article);
    
    this.article = this.data.article;
  }
}
