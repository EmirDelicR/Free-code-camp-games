///< reference path="../../node_modules/@types/jquery/index.d.ts" />

class Game {
    status: boolean = false;
    start: boolean = false;
    strict: boolean = false;
    $startBtn: JQuery = $('.start');
    $strictBtn: JQuery = $('.strict');
    $display: JQuery = $('.count');
    numbers: number[] = []; 
    level: number = 0;
    userInput: number[] = [];
    sounds: string[] = [
        "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", 
        "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", 
        "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", 
        "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
    ];
    maxLevel: number = 21;

    public setStatus(status: boolean) {
        this.status = status;
        if(!status) {
            this.start = false;
            this.strict = false;
            this.updateClass('all');
            this.updateDisplay();
            this.numbers = [];
            this.level = 0;
        }
        
    }

    public setStart() {
        if(this.status) {
            this.start = !this.start;
        }
        this.updateDisplay();
    }

    public setStrict() {
        if(this.status) {
            this.strict = !this.strict;
        }
    }

    public updateClass(type: String) {
        switch(type) {
            case 'start':
                if(this.start) {
                    this.$startBtn.addClass('start-active');
                } else {
                    this.$startBtn.removeClass('start-active');
                }
            break;
            case 'strict':
                if(this.strict) {
                    this.$strictBtn.addClass('strict-active');
                } else {
                    this.$strictBtn.removeClass('strict-active');
                }
            break;
            default:
                this.$startBtn.removeClass('start-active');
                this.$strictBtn.removeClass('strict-active');
        }
    }

    private updateDisplay() {
        if(this.start) {
            this.$display.html('00');
        }else {
            this.$display.html('---');
        }
    }

    private showNumbersCount(num: number) {
        if(num < 10) {
            this.$display.html('0'+num);
        } else{
            this.$display.html(String(num));
        }
    }

    private generateNum() {
        return Math.floor(Math.random() * 4) + 1;
    }

    public play() {
        if(this.start) {
            let num = this.generateNum();
            this.numbers.push(num);
            this.startGame();  
        } else {
            this.numbers = [];
            this.level = 0;
        }
    }

    private startGame() {
        $('.circ-'+this.numbers[0]).addClass('circ-' + this.numbers[0] + '-active');
        this.playSound(this.numbers[0]);
        let self = this;
        this.delay(function() {
            $('.circ-'+self.numbers[0]).removeClass('circ-' + self.numbers[0] + '-active');
        }, 900);
    }
    
    private addClassToPads(elemNum: string) {
        $('.circ-' + elemNum).addClass('circ-' + elemNum + '-active');
        this.playSound(Number(elemNum));
        this.delay(function() {
            $('.circ-' + elemNum).removeClass('circ-' + elemNum + '-active');
        }, 950);
    }
    
    public main(elem: JQuery) {
        if(this.status && this.start) {
            let elemClass = elem.attr('class').split(' ')[1];
            let elemNum = elemClass.split('-')[1];
            this.userInput.push(Number(elemNum));
            this.addClassToPads(elemNum);

            if(!this.checkUserInput()) {
                this.displayError();
                $('.circ-' + elemNum).removeClass('circ-' + elemNum + '-active');
                this.userInput = [];
                if(this.strict) {
                    this.numbers = [];
                    this.level = 0;
                    this.setStart(); 
                    this.displayError();
                    this.updateClass('start');
                } else {
                    this.mainGame();
                }
            }
            if(this.userInput.length == this.numbers.length && this.start === true) {
                this.level++;
                if(this.level == this.maxLevel) {
                    this.displayWin();
                } else{
                    let num = this.generateNum();
                    this.numbers.push(num);
                    this.userInput = [];
                    this.mainGame();
                }
            }           
        }
         
    }

    private checkUserInput() {
        for(let i = 0; i<this.userInput.length; i++) {
            if(this.userInput[i] != this.numbers[i]) {
                return false;
            }
        }
        return true;
    }
    
    private displayError() {
        this.$display.html('&#9760;');
        let self = this;
        this.delay(function() {
            self.showNumbersCount(self.level);
        }, 950);
    }

    private displayWin() {
        this.$display.html('&#9812;');
    }

    private mainGame() {
        let self = this;
        let i = 0;
        let myInterval = setInterval(function() {
            self.addClassToPads(String(self.numbers[i]));
            i++;
            if(i == self.numbers.length) {
                clearInterval(myInterval);
                self.showNumbersCount(self.level);
            }
        }, 1000);

    }

    private playSound(elemNum: number) {
        let sound = new Audio(this.sounds[elemNum-1]);
        sound.play();
    }

    delay = ( function() {
        var timer = 0;
        return function(callback:any, ms: number) {
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

}


$( document ).ready(function() {

    let game = new Game();
    let $btnOnOff = $('#toggle-event');
    let $circle = $('.quarter-circle');
    let $start = $('.start');
    let $strict = $('.strict');
    let $toogleDiv = $('.toggle');
    $toogleDiv.removeClass('btn-success');
    $toogleDiv.addClass('btn-danger off');

    $btnOnOff.change(function() {
        let status = $(this).prop('checked');
        game.setStatus(status);
    });

    $start.on('click', function() {
        game.setStart();
        game.updateClass('start');
        game.play();
    });

    $strict.on('click', function() {
        game.setStrict();
        game.updateClass('strict');
    });

    $circle.on('click', function() {
        game.main($(this));
    });
    

});