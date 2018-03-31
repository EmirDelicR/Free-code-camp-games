/**
 * Chace the DOOM
 */

var circle = $('.quarter-circle');
var btnOnOff = $('#toggle-event');
var status = false;


btnOnOff.change(function() {
    status = $(this).prop('checked');
})
console.log(status);    
if(status == true) {
    circle.on('click', function() {
        console.log( $(this).attr('class').split(' ')[1]);
    });
}