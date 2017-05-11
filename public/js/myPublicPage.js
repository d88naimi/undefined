/**
 * Created by Hyungwu Pae on 5/11/17.
 */
(function(){
  const projectRow = $(".projectRow");
  const imageBox = $("#imageBox");
  projectRow.mouseenter(function (event) {

    const screenshot = $(this).data('screenshot').toString();

    if( screenshot === "{{projectInfo.screenshot}}" || "undefined" || null){
      imageBox.css({"background-image": "url('/public/img/code_banner.png')"});
    }
    else{

      $("#imageBox").css({"background-image": "url("+ screenshot +")"});
    }
  });

  projectRow.mouseleave(function (event) {
    imageBox.css({"background-image": "url('/public/img/star.gif')"});
  });

})();