import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-notif-toast',
  templateUrl: './notif-toast.component.html',
  styleUrls: ['./notif-toast.component.scss'],
})
export class NotifToastComponent implements OnInit {
  @Input() message!: string;

 
  constructor(public toastController: ToastController) {}

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 2000,position:'top'
    });
    toast.present();
  }

  ngOnInit() {
    this.presentToast()
  }

}
