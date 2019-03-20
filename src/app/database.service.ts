import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public db: SQLiteObject;
  public isOpen: boolean;

  constructor(
    public storage: SQLite
  ) {
    if (!this.isOpen) {
      this.storage = new SQLite();
      this.storage.create({ name: 'data.db', location: 'default' }).then((db: SQLiteObject) => {
        this.db = db;

        db.executeSql('CREATE TABLE IF NOT EXISTS corridas (id  INTEGER PRIMARY KEY AUTOINCREMENT, runDate INTEGER, totalTime TEXT)', []);
        this.isOpen = true;
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  SaveRun(runDate: number, totalTime: string) {
    return new Promise((resolve, reject) => {
      let sql = 'INSERT INTO corridas (runDate, totalTime) VALUES (?, ?)';

      this.db.executeSql(sql, [runDate, totalTime]).then((data) => {

        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  GetCorridas() {
    
    return new Promise((resolve, reject) => {
      this.db.executeSql('SELECT * FROM corridas', []).then((data) => {
        let arrayCorridas = [];
        // alert('lenght = ' +data.rows.length);
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            arrayCorridas.push({
              id: data.rows.item(i).id,
              runDate: data.rows.item(i).runDate,
              totalTime: data.rows.item(i).totalTime
            });
          }
        }
        resolve(arrayCorridas);
      }, (error) => {
        reject(error);
      })
    })
  }



  Delete(id) {
    return new Promise((resolve, reject) => {

      let sql = 'DELETE FROM corridas WHERE ID = ?';
      this.db.executeSql(sql, [id]).then((data) => {

        resolve(data);
      }, (error) => {
        reject(error);
      })
    })
  }


  GetHighScore() {
    return new Promise((resolve, reject) => {

      let sql = 'SELECT ID, totalTime,runDate  FROM corridas WHERE totalTime = (SELECT MIN(totalTime) FROM corridas)';

      this.db.executeSql(sql, []).then((data) => {

        let highScore = data.rows.item(0);
        console.log(highScore);

        resolve(highScore);
      }, (error) => {
        reject(error);
      })
    })
  }

  
  ElimiarDT() {
    return new Promise((resolve, reject) => {

      alert("trigger2");
      let sql = 'DROP TABLE IF EXISTS data.db;';
      this.db.executeSql(sql, []).then((data) => {

        alert("database deleted");
        
        resolve(data);
      }, (error) => {
        reject(error);
      })
    })
  }


  RecreateDT() {
    return new Promise((resolve, reject) => {

      let sql = 'CREATE TABLE IF NOT EXISTS corridas (id  INTEGER PRIMARY KEY AUTOINCREMENT, runDate INTEGER, totalTime TEXT)';
      this.db.executeSql(sql, []).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      })
    })
  }

}
