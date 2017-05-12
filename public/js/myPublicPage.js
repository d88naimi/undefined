/**
 * Created by Hyungwu Pae on 5/11/17.
 */
(function(){
  const projectRow = $(".projectRow");
  const imageBox = $("#imageBox");

  projectRow.mouseenter(function (event) {

    var screenshot = $(this).attr('data-screenshot');
    console.log("SS: "+ screenshot);


    if( !screenshot){
      imageBox.css({"background-image": "url('/public/img/code_banner.png')"});
    }
    else{

     imageBox.css({"background-image": "url("+ screenshot +")"});
    }
  });

  projectRow.mouseleave(function (event) {
    imageBox.css({"background-image": "url('/public/img/star.gif')"});
  });

})();