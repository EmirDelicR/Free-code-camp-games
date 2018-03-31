///< reference path="../../node_modules/@types/jquery/index.d.ts" />

class Game {

    private interval: any;
    $fullBatery: JQuery = $('.full');
    private fullWidth: number = 380;
    private sesTime: number = 0;
    private brkTime: number = 0;
    $display: JQuery = $('.sesType');
    isPaused: boolean = false; 

    public setValue = (type: string, elem: JQuery) => {
        switch(type) {
          case '-':
            this.decrement(elem);
            break;  
          default:
            this.increment(elem);
            break;
        }
    };

    private increment = (elem: JQuery) => {
      let val = Number(elem.html()); 
      if(val < 55) {
        elem.html(String(val + 1));
      }
    };

    private decrement = (elem: JQuery) => {
      let val = Number(elem.html()); 
      if(val > 1) {
        elem.html(String(val - 1));
      }
    };

    public setTimeVal = (sessionTime: number, breakTime: number) => {
      this.sesTime = sessionTime;
      this.brkTime = breakTime;
    };

    public startSession = () => {
        this.resetAll();
        this.$display.html("Session");
        let pxPreSec = this.fullWidth / (this.sesTime*60); 
        this.interval =  setInterval(() => { 
          if(!this.isPaused){
            this.discharge(pxPreSec);
          }
        }, 1000); 
    };

    private startBreak = () => {
        this.$display.html("Break");
        let pxPreSec = this.fullWidth / (this.brkTime*60);
        this.interval =  setInterval(() => { 
          if(!this.isPaused){
            this.breakTime(pxPreSec);
          }  
        }, 1000); 
    };

    private discharge = (pxPreSec: number) => {
      this.fullWidth -= pxPreSec;
      this.$fullBatery.css("width", this.fullWidth+"px");
      if(this.fullWidth < 60) {
        this.$fullBatery.addClass('danger');
      }
      if(this.fullWidth < 1) {
        clearInterval(this.interval);
        this.fullWidth = 380;
        this.$fullBatery.removeClass('danger').addClass('rest');
        this.startBreak();
      } 
    };

    private breakTime = (pxPreSec: number) => {
      this.fullWidth -= pxPreSec;
      this.$fullBatery.css("width", this.fullWidth+"px");
      if(this.fullWidth < 60) {
        this.$fullBatery.removeClass('rest').addClass('danger');
      }
      if(this.fullWidth < 1) {
        this.$fullBatery.removeClass('danger');
        this.startSession();
      } 
    };

    public resetSession = () => {
      this.startSession();
    };

    private resetAll = () => {
      clearInterval(this.interval);
      this.fullWidth = 380;
      this.$fullBatery.removeClass('danger').removeClass('rest');
    };

    public pauseSession = () => {
        this.isPaused = !this.isPaused;
    };
}

$( document ).ready(function() {

  let game = new Game();
  let $breakBtn = $('.break .btn');
  let $sessionBtn = $('.session .btn');
  let $breakElem = $('.break-leng');
  let $sessionElem = $('.session-leng');
  let $start = $('.start');
  let $pause = $('.pause');
  let $reset = $('.reset');

  $breakBtn.on('click', (e) => {
    game.setValue(e.delegateTarget.innerHTML, $breakElem);
  });

  $sessionBtn.on('click', (e) => {
    game.setValue(e.delegateTarget.innerHTML, $sessionElem);
  });

  $start.on('click', () => { 
    let seesionVal = Number($sessionElem.html());
    let breakVal = Number($breakElem.html());
    game.setTimeVal(seesionVal, breakVal);
    game.startSession();
  });

  $reset.on('click', () => {
    game.resetSession();
  });

  $pause.on('click', () => {
    game.pauseSession();
  });

});