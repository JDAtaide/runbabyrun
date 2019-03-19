// import { Tab2Page } from './../tab2/tab2.page';
import { Component, ViewChild } from '@angular/core';
import { DatabaseService } from '../database.service';
// import { Observable, interval } from 'rxjs';
// import { timer } from 'rxjs'
import { Router } from '@angular/router';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('runTimer') runTimer ;
  ArrayCorrida: Array<any> = [];

  countDownBool = false;
  hideCountdown =false; 
  goSign = false;

  runInProgress = false;
  running = false;
  newRun = true;
  totalHoras = 0;
  totalSegundos = 0;
  totalMinutes = 0;
  fastPace = false;
  faseMsg = '';
  // countdownTimer : any;
  count = 3;
  runMilisegundos = 0;
  runSegundos = 0;
  runMinutes = 0;
  runningTime = "00:00";
  totalTime = "00:00:00"
  runMinutesDisplay = "00";
  runSegundosDisplay = "00";

  totalHorasDisplay = "00";
  totalSegundosDisplay = "00";
  totalMinutesDisplay = "00";
 
  intervalId2 : any;


  constructor(private database : DatabaseService, private router: Router, private nativeAudio: NativeAudio){
   
  }
  
 

   
  Start() {
      this.newRun = false;
      this.countDownBool = true;
      this.GetReady();
  }
    
  GetReady(){
    this.runInProgress = false;
    let intervalId = setInterval(() => {
      
        this.count = this.count - 1;
        if(this.count === -1){ 
           this.goSign =true;
           this.hideCountdown =true; 
        }

        if(this.count === -2){ 
          clearInterval(intervalId);
          this.goSign =false;
          this.faseMsg ="Slow fase";
          this.running = true;
          
          this.count = 3;
          this.hideCountdown =false; 
          this.StartRun();
        }
    }, 1000)
  }
  


  Runtimer(){

    this.runSegundos = this.runSegundos + 1;
    this.totalSegundos = this.totalSegundos + 1;

    if (this.runSegundos == 59) {
      this.runMinutes =  this.runMinutes + 1;
      this.runSegundos = 0;
    }

    if (this.totalSegundos == 59) {
      this.totalMinutes =  this.totalMinutes + 1;
      this.totalSegundos = 0;
    }

    if (this.totalMinutes == 59) {
      this.totalHoras =  this.totalHoras + 1;
      this.totalMinutes = 0;
    }

//slowFase -> fastFase
    // if (this.runMinutes == 1 && this.fastPace == false) {
      if (this.runSegundos == 30 && this.fastPace == false) {
      this.playGoFastAlarm();
      this.faseMsg ="Fast fase";
      this.runSegundos = 0;
      this.runMinutes = 0;
      this.fastPace = true;
      }

      // > fastFase -> slowFase
     
      //  if (this.runMinutes == 4 && this.fastPace) {
      if (this.runSegundos == 30 && this.fastPace) {
        this.playGoSlowAlarm();
        this.faseMsg ="Slow fase";
          this.runSegundos = 0;
          this.runMinutes = 0;
          // this.runMilisegundos = 0;
          this.fastPace = false;
      }

      //Display
      this.totalSegundosDisplay = this.totalSegundos.toString();
      if (this.totalSegundos < 10) {
        this.totalSegundosDisplay = "0" + this.totalSegundos;
      }

      this.totalMinutesDisplay = this.totalMinutes.toString();
      if (this.totalMinutes < 10) {
        this.totalMinutesDisplay = "0" + this.totalMinutes;
      }

      this.totalHorasDisplay = this.totalHoras.toString();
      if (this.totalHoras < 10) {
        this.totalHorasDisplay = "0" + this.totalHoras;
      }

      this.runSegundosDisplay = this.runSegundos.toString();;
      if (this.runSegundos < 10) {
        this.runSegundosDisplay = "0" + this.runSegundos;
      }

      this.runMinutesDisplay = this.runMinutes.toString();;
      if (this.runMinutes < 10) {
        this.runMinutesDisplay = "0" + this.runMinutes;
      }


      //Display
      this.runningTime = (this.runMinutesDisplay + " : " + this.runSegundosDisplay);
      this.totalTime = (this.totalHorasDisplay + " : " + this.totalMinutesDisplay + " : " + this.totalSegundosDisplay);
    
  } 


  StartRun(){
  
    this.countDownBool = false;
    this.runInProgress = true;
    this.intervalId2 =  setInterval(() => { this.Runtimer()}, 1000)
  }


  Pause() {
    clearInterval(this.intervalId2);
    this.running = false;
  }

  Resume() {
  this.intervalId2 = setInterval(() => { this.Runtimer()}, 1000);
  this.running = true;
  }

  Terminar() {
      alert("corrida guardada!" +"\n" +  this.totalTime);
      this.SaveRun();
      this.Restart();
    }

  Restart() {
    this.runningTime = "00:00";
    this.totalTime = "00:00:00"
    this.runMilisegundos = 0;
    this.totalSegundos = 0;
    this.totalMinutes = 0;
    this.runSegundos = 0;
    this.runMinutes = 0;
    this.fastPace = false;
    this.newRun = true;
    this.faseMsg = '';
    this.runInProgress =false;
  }

  SaveRun(){
    let dateToday = Date.now();
    this.database.SaveRun(dateToday,  this.totalTime).then( (data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    })
  }


  playGoFastAlarm(){
    this.nativeAudio.preloadSimple('beep1', 'assets/Sounds/analog-watch-alarm_daniel-simion.mp3').then(() => {
      // this.nativeAudio.play('beep1');
      this.nativeAudio.play('beep1', () => this.nativeAudio.unload('beep1'));
     
      });
  }

  playGoSlowAlarm(){
    this.nativeAudio.preloadSimple('beep2', 'assets/Sounds/beep2.mp3').then(() => {
      // this.nativeAudio.play('beep2');
      this.nativeAudio.play('beep2', () => this.nativeAudio.unload('beep2'));
      // this.nativeAudio.unload('beep2');
      });
  }
  
}