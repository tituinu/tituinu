$(document).ready(function(){
  AOS.init();
  $('.scroll').on('click', function(e) {  
     e.preventDefault();
    $('html, body').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 500, 'linear');
  });
  $(window).click(function(e) {
     if($(".navbar-collapse").hasClass("show")){
        $('.navbar-collapse').removeClass("show"); 
        e.preventDefault();
        }
  });
   $('.navbar-collapse').click(function(event){
       event.stopPropagation();
   });
   $(window).scroll(function(){
      var sticky = $('.header'),
         scroll = $(window).scrollTop();
      if (scroll >= 53) $("body").addClass('menu-fixed');
      else $("body").removeClass('menu-fixed');
   });
});