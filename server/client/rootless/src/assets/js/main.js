global.jQuery = require("jquery");
var $ = global.jQuery;
window.$ = $;

$(document.body).on("focus", ".form-control", function () {
  $(this).parent(".form-group").children("label").addClass("text-primary");
});
$(document.body).on("click", ".form-group", function () {
  $(this).children(".form-control").focus();
});
$(document.body).on("blur", ".form-control", function () {
  $(this).parent(".form-group").children("label").removeClass("text-primary");
});
$(document.body).on("click",".switch_1", function () {
  $("body").toggleClass("light");
});

// material
var buttons = $('.btn');
console.log(buttons)
Array.prototype.forEach.call(buttons, function (b) {
  b.addEventListener('click', createRipple);
})

function createRipple(e) {
  if (this.getElementsByClassName('ripple').length > 0) {
    this.removeChild(this.childNodes[1]);
  }

  var circle = document.createElement('div');
  this.appendChild(circle);

  var d = Math.max(this.clientWidth, this.clientHeight);
  circle.style.width = circle.style.height = d + 'px';

  circle.style.left = e.clientX - this.offsetLeft - d / 2 + 'px';
  circle.style.top = e.clientY - this.offsetTop - d / 2 + 'px';

  circle.classList.add('ripple');
}
// end material
console.log("mainnn")