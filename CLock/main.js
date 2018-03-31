///< reference path="../../node_modules/@types/jquery/index.d.ts" />
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
        this.$fullBatery = $('.full');
        this.fullWidth = 380;
        this.sesTime = 0;
        this.brkTime = 0;
        this.$display = $('.sesType');
        this.isPaused = false;
        this.setValue = function (type, elem) {
            switch (type) {
                case '-':
                    _this.decrement(elem);
                    break;
                default:
                    _this.increment(elem);
                    break;
            }
        };
        this.increment = function (elem) {
            var val = Number(elem.html());
            if (val < 55) {
                elem.html(String(val + 1));
            }
        };
        this.decrement = function (elem) {
            var val = Number(elem.html());
            if (val > 1) {
                elem.html(String(val - 1));
            }
        };
        this.setTimeVal = function (sessionTime, breakTime) {
            _this.sesTime = sessionTime;
            _this.brkTime = breakTime;
        };
        this.startSession = function () {
            _this.resetAll();
            _this.$display.html("Session");
            var pxPreSec = _this.fullWidth / (_this.sesTime * 60);
            _this.interval = setInterval(function () {
                if (!_this.isPaused) {
                    _this.discharge(pxPreSec);
                }
            }, 1000);
        };
        this.startBreak = function () {
            _this.$display.html("Break");
            var pxPreSec = _this.fullWidth / (_this.brkTime * 60);
            _this.interval = setInterval(function () {
                if (!_this.isPaused) {
                    _this.breakTime(pxPreSec);
                }
            }, 1000);
        };
        this.discharge = function (pxPreSec) {
            _this.fullWidth -= pxPreSec;
            _this.$fullBatery.css("width", _this.fullWidth + "px");
            if (_this.fullWidth < 60) {
                _this.$fullBatery.addClass('danger');
            }
            if (_this.fullWidth < 1) {
                clearInterval(_this.interval);
                _this.fullWidth = 380;
                _this.$fullBatery.removeClass('danger').addClass('rest');
                _this.startBreak();
            }
        };
        this.breakTime = function (pxPreSec) {
            _this.fullWidth -= pxPreSec;
            _this.$fullBatery.css("width", _this.fullWidth + "px");
            if (_this.fullWidth < 60) {
                _this.$fullBatery.removeClass('rest').addClass('danger');
            }
            if (_this.fullWidth < 1) {
                _this.$fullBatery.removeClass('danger');
                _this.startSession();
            }
        };
        this.resetSession = function () {
            _this.startSession();
        };
        this.resetAll = function () {
            clearInterval(_this.interval);
            _this.fullWidth = 380;
            _this.$fullBatery.removeClass('danger').removeClass('rest');
        };
        this.pauseSession = function () {
            _this.isPaused = !_this.isPaused;
        };
    }
    return Game;
}());
$(document).ready(function () {
    var game = new Game();
    var $breakBtn = $('.break .btn');
    var $sessionBtn = $('.session .btn');
    var $breakElem = $('.break-leng');
    var $sessionElem = $('.session-leng');
    var $start = $('.start');
    var $pause = $('.pause');
    var $reset = $('.reset');
    $breakBtn.on('click', function (e) {
        game.setValue(e.delegateTarget.innerHTML, $breakElem);
    });
    $sessionBtn.on('click', function (e) {
        game.setValue(e.delegateTarget.innerHTML, $sessionElem);
    });
    $start.on('click', function () {
        var seesionVal = Number($sessionElem.html());
        var breakVal = Number($breakElem.html());
        game.setTimeVal(seesionVal, breakVal);
        game.startSession();
    });
    $reset.on('click', function () {
        game.resetSession();
    });
    $pause.on('click', function () {
        game.pauseSession();
    });
});
