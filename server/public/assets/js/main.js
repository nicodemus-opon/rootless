
$(".form-control").on("focus", function () {
    $(this).parent(".form-group").children("label").addClass("text-primary");
});
$(".form-group").on("click", function () {
    console.log("hdhdhd")
    $(this).children(".form-control").focus();
});
$(".form-control").on("blur", function () {
    $(this).parent(".form-group").children("label").removeClass("text-primary");
});
$(".switch_1").on("click", function () {
    console.log("ja")
    $("body").toggleClass("light");
});

// material
var buttons = document.getElementsByClassName('.btn');

Array.prototype.forEach.call(buttons, function(b){
  b.addEventListener('click', createRipple);
})

function createRipple(e)
{
  if(this.getElementsByClassName('ripple').length > 0)
    {
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