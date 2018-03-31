///< reference path="../../node_modules/@types/jquery/index.d.ts" />
var Game = /** @class */ (function () {
    function Game() {
        this.status = false;
        this.start = false;
        this.strict = false;
        this.$startBtn = $('.start');
        this.$strictBtn = $('.strict');
        this.$display = $('.count');
        this.numbers = [];
        this.level = 0;
        this.userInput = [];
        this.sounds = [
            "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3",
            "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3",
            "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3",
            "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
        ];
        this.maxLevel = 21;
        this.delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
    }
    Game.prototype.setStatus = function (status) {
        this.status = status;
        if (!status) {
            this.start = false;
            this.strict = false;
            this.updateClass('all');
            this.updateDisplay();
            this.numbers = [];
            this.level = 0;
        }
    };
    Game.prototype.setStart = function () {
        if (this.status) {
            this.start = !this.start;
        }
        this.updateDisplay();
    };
    Game.prototype.setStrict = function () {
        if (this.status) {
            this.strict = !this.strict;
        }
    };
    Game.prototype.updateClass = function (type) {
        switch (type) {
            case 'start':
                if (this.start) {
                    this.$startBtn.addClass('start-active');
                }
                else {
                    this.$startBtn.removeClass('start-active');
                }
                break;
            case 'strict':
                if (this.strict) {
                    this.$strictBtn.addClass('strict-active');
                }
                else {
                    this.$strictBtn.removeClass('strict-active');
                }
                break;
            default:
                this.$startBtn.removeClass('start-active');
                this.$strictBtn.removeClass('strict-active');
        }
    };
    Game.prototype.updateDisplay = function () {
        if (this.start) {
            this.$display.html('00');
        }
        else {
            this.$display.html('---');
        }
    };
    Game.prototype.showNumbersCount = function (num) {
        if (num < 10) {
            this.$display.html('0' + num);
        }
        else {
            this.$display.html(String(num));
        }
    };
    Game.prototype.generateNum = function () {
        return Math.floor(Math.random() * 4) + 1;
    };
    Game.prototype.play = function () {
        if (this.start) {
            var num = this.generateNum();
            this.numbers.push(num);
            this.startGame();
        }
        else {
            this.numbers = [];
            this.level = 0;
        }
    };
    Game.prototype.startGame = function () {
        $('.circ-' + this.numbers[0]).addClass('circ-' + this.numbers[0] + '-active');
        this.playSound(this.numbers[0]);
        var self = this;
        this.delay(function () {
            $('.circ-' + self.numbers[0]).removeClass('circ-' + self.numbers[0] + '-active');
        }, 900);
    };
    Game.prototype.addClassToPads = function (elemNum) {
        $('.circ-' + elemNum).addClass('circ-' + elemNum + '-active');
        this.playSound(Number(elemNum));
        this.delay(function () {
            $('.circ-' + elemNum).removeClass('circ-' + elemNum + '-active');
        }, 950);
    };
    Game.prototype.main = function (elem) {
        if (this.status && this.start) {
            var elemClass = elem.attr('class').split(' ')[1];
            var elemNum = elemClass.split('-')[1];
            this.userInput.push(Number(elemNum));
            this.addClassToPads(elemNum);
            if (!this.checkUserInput()) {
                this.displayError();
                $('.circ-' + elemNum).removeClass('circ-' + elemNum + '-active');
                this.userInput = [];
                if (this.strict) {
                    this.numbers = [];
                    this.level = 0;
                    this.setStart();
                    this.displayError();
                    this.updateClass('start');
                }
                else {
                    this.mainGame();
                }
            }
            if (this.userInput.length == this.numbers.length && this.start === true) {
                this.level++;
                if (this.level == this.maxLevel) {
                    this.displayWin();
                }
                else {
                    var num = this.generateNum();
                    this.numbers.push(num);
                    this.userInput = [];
                    this.mainGame();
                }
            }
        }
    };
    Game.prototype.checkUserInput = function () {
        for (var i = 0; i < this.userInput.length; i++) {
            if (this.userInput[i] != this.numbers[i]) {
                return false;
            }
        }
        return true;
    };
    Game.prototype.displayError = function () {
        this.$display.html('&#9760;');
        var self = this;
        this.delay(function () {
            self.showNumbersCount(self.level);
        }, 950);
    };
    Game.prototype.displayWin = function () {
        this.$display.html('&#9812;');
    };
    Game.prototype.mainGame = function () {
        var self = this;
        var i = 0;
        var myInterval = setInterval(function () {
            self.addClassToPads(String(self.numbers[i]));
            i++;
            if (i == self.numbers.length) {
                clearInterval(myInterval);
                self.showNumbersCount(self.level);
            }
        }, 1000);
    };
    Game.prototype.playSound = function (elemNum) {
        var sound = new Audio(this.sounds[elemNum - 1]);
        sound.play();
    };
    return Game;
}());
$(document).ready(function () {
    var game = new Game();
    var $btnOnOff = $('#toggle-event');
    var $circle = $('.quarter-circle');
    var $start = $('.start');
    var $strict = $('.strict');
    var $toogleDiv = $('.toggle');
    $toogleDiv.removeClass('btn-success');
    $toogleDiv.addClass('btn-danger off');
    $btnOnOff.change(function () {
        var status = $(this).prop('checked');
        game.setStatus(status);
    });
    $start.on('click', function () {
        game.setStart();
        game.updateClass('start');
        game.play();
    });
    $strict.on('click', function () {
        game.setStrict();
        game.updateClass('strict');
    });
    $circle.on('click', function () {
        game.main($(this));
    });
});
