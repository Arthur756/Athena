import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(private loadingCtrl: LoadingController,
    private authService: AuthService,
              private toastCtrl: ToastController,
              private router: Router) { }

  ngOnInit() {
  }

  async login(){
    await this.presentLoading();

    this.router.navigate(['/folder/inbox']);

    try{
      await this.authService.login(this.userLogin);
    } catch(error) {
      this.presentToast(error.message);
    } finally{
      this.loading.dismiss();
      } 

  }

  async register(){
    await this.presentLoading();

    try{
      await this.authService.register(this.userRegister);
    } catch(error) {
      let message: string;

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = "Este e-mail já está em uso!";
          break;

        case 'auth/invalid-email':
          message = "E-mail inválido";
          break;
      }

      this.presentToast(message)
    } finally{
      this.loading.dismiss();
    }  
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({message: 'Aguarde...'});
    return this.loading.present();

  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
