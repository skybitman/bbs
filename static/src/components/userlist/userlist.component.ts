import { Component, OnInit } from '@angular/core';
import { UserService, User } from "../../providers";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  userlist: Array<User> = [];
  constructor(private user: UserService, private modal: NgbModal) { }
  ngOnInit() {
    this.user.getAll().subscribe(userlist => {
      this.userlist = userlist;
    })
  }
  openEdit(key: string) {
    const modalRef = this.modal.open(ModalComponent);
    modalRef.result.then(result => {
      if (result.ok) {
        this.edit(result.name, key);
      }
    }, err => {

    })
  }
  edit(name, key: string) {
    let data = new FormData();
    data.append('alias', name);
    data.append('user', key);
    this.user.newOrModifyUser(data).subscribe(res => {
      this.userlist = [];
      this.user.getAll().subscribe(userlist => {
        this.userlist = userlist;
      })
    })
  }
  remove(ev: Event, key: string) {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    let data = new FormData();
    data.append('user', key);
    this.user.remove(data).subscribe(isOk => {
      if (isOk) {
        this.userlist = [];
        this.user.getAll().subscribe(userlist => {
          this.userlist = userlist;
        })
      }
    })
  }
}