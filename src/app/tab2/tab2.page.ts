import { Injectable, NgZone, ElementRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import { AlertController } from '@ionic/angular';





@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})

export class Tab2Page {
  ArrayCorrida: Array<any> = [];
  // private todo: FormGroup;
  fastestRunTime = "";
  fastestRunDate = ""
 
  element: HTMLElement = document.getElementsByClassName('myBtn')[0] as HTMLElement;

  constructor(private database: DatabaseService, private alertController: AlertController, private zone: NgZone) {
    this.doRefresh(0);
  }



  ngOnInit() {
    this.GetCorridas();
  }




  doRefresh(refresher) {

    if (refresher != 0) {

      alert("Refresh me");
      this.GetHighScore();
      refresher.complete();
    }

  };






  GetHighScore() {
    this.database.GetHighScore().then((data: any) => {

      this.zone.run(() => {
       
        this.fastestRunTime = data.totalTime;
        this.fastestRunDate = data.runDate;
      });

      this.fastestRunTime = data.totalTime;
      this.fastestRunDate = data.runDate;
    }, (error) => {
      console.log(error);
    })
  }

  GetCorridas() {




    this.database.GetCorridas().then((data: any) => {

      this.zone.run(() => { this.ArrayCorrida = data.slice().reverse(); })
      if (this.ArrayCorrida.length == 0) {
        alert("There are no records! ");
      } else { this.GetHighScore(); }


      console.log(this.ArrayCorrida);
    }, (error) => {
      console.log(error);
    })




  }


  async PromtDelete(id) {

    let deleteAlert = await this.alertController.create({

      message: "Alerta",
      subHeader: "Tem a certeza que deseja eliminar esta corrida?",
      buttons: [{
        text: "Cancelar",
        role: 'cancel',
      },
      {
        text: "Confirmar",
        handler: () => {
          this.Delete(id);
        }
      }]
    });

    await deleteAlert.present();
  }
  Delete(id) {
    this.database.Delete(id).then((data) => {

      alert("Corrida Eliminada");
      this.GetCorridas();
    }, (error) => {
      console.log(error);
    })
  }
}

