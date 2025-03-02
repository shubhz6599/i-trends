$('label').on("click",function() {
    $index = $(this).prevAll().length;
    
    if($index === 1) {
      $('.container').css('background', '#ffa6c3');
    } else if($index === 3) {
      $('.container').css('background', '#c988f8');
    } else if($index === 5) {
      $('.container').css('background', '#7ce2dd');
    } else {
      $('.container').css('background', '#ffd284');
    }
  });