/**
 * Created by Hyungwu Pae on 5/11/17.
 */
(function(){
  const projectRow = $(".projectRow");
  const imageBox = $("#imageBox");

  projectRow.mouseenter(function (event) {

    var screenshot = $(this).attr('data-screenshot');


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


 projectRow.on('click',function (event) {

    var watchers= $(this).attr('data-watchers');
    var stargazers= $(this).attr('data-stargazers');
    var forks= $(this).attr('data-forks');
    var img= $(this).attr('data-screenshot');
    if(!watchers){
      watchers ='0';
    }
     if(!stargazers){
      stargazers ='0';
    }
     if(!forks){
      forks ='0';
    }
    $("#modalClickImage").attr("src", img);
    $("#watchers").html(watchers);
    $("#stargazers").html(stargazers);
    $("#forks").html(forks);

    $('#myModal').modal('toggle');
 });



})();