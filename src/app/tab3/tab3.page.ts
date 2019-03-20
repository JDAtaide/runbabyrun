import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  

  constructor(private database: DatabaseService, private alertController: AlertController) {
   
  }
  
  async PromptElimiarDT() {

    let deleteAlert = await this.alertController.create({

      message: "Do you wish to eliminate database?",
      subHeader: "Danger!",
      buttons: [{
        text: "Cancelar",
        role: 'cancel',
      },
      {
        text: "Confirmar",
        handler: () => {
          this.ElimiarDT();
        }
      }]
    });

    await deleteAlert.present();
  }
  ElimiarDT() {
    alert("trigger pulled");
    this.database.ElimiarDT().then((data) => {

     
   
    }, (error) => {
      console.log(error);
    })
  }
}
