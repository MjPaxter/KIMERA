$('body').prepend('<div class="fit-em-calculation" style="width: 1em;position: absolute;"></div>');
var em = parseInt($('.fit-em-calculation').css('width'));

$('.fit').each(function(){
  $(this).wrapInner('<span class="fit-inner"></span>');
  var el = $(this);
  var inner = el.find('.fit-inner');
  var fitWidth = parseInt(el.css('width'));
  var innerWidth = parseInt(inner.css('width'));
  var increment = fitWidth / em;
  var chars = el.text().length;
  
  var factor = fitWidth / innerWidth;
  var calc = em * factor;
  $(this).css('font-size', calc + 'px');
  $(this).css('display', 'block');
});