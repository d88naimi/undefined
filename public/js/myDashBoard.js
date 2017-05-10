/**
 * Created by Hyungwu Pae on 5/8/17.
 */
(function($) {
  // const skills = ['jQuery', 'Angular', 'MongoDB', 'MySQL', 'Django', 'React', 'Sass', 'LESS', 'Express', 'ES6', 'Typescript', 'Firebase'];
  let skills = [];
  $.get('/api/skill')
    .then(res => {
      skills = res.skills.map(skillObj => skillObj.name);
    });

  let selectedSkills = [];

  $('#addButton').on("click", function(event) {
    event.preventDefault();

    $("#addProjectModal").modal('toggle');

  });

  $('#addBtn').on("click", function(event) {

    $.put("/updateSelected", {id: $(this).data('id')}, function(result){
      console.log("Update project successful");
      // need to redirect to this same page after each project added
    });
  });

  $("#makeProject").on("click", function(event){

    $.get("/portfolio/:id");

  });

  // Add skill input auto completion.
  $('#input-skill').on('input', function (ev) {
    const typedText = $(ev.target).val();

    if(typedText.length < 2) return;

    //if user typed or selected the skill which exists in the skills array
    if(skills.indexOf(typedText) > -1) return addToSkillList(typedText);

    //else
    const filteredSkills = skills.filter((skl, i) => {
      return skl.toLowerCase().includes(typedText.toLowerCase()) && selectedSkills.indexOf(skl) < 0
    });

    //delete previous <option> tags
    $('#skill-list').empty();

    //re render skills
    filteredSkills.forEach(skl => $('#skill-list').append($("<option>").attr("value", skl)));
  });

  function addToSkillList(skillName) {
    $('#skillTable').append(
      $('<tr>').append(
        $('<span class="label label-primary">').text(skillName)
      )
    );
    $('#input-skill').val('');
    selectedSkills.push(skillName);
  }


  //change user's photo
  $('#change-photo').on('click', function () {
    $('#image-file-input').trigger('click');
  });

  //on select file
  $('#image-file-input').change(function (ev) {
    const files = event.target.files;
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    }
    showLoadingCircle();
    getSignedRequest(file);
  });

  function getSignedRequest(file) {
    const url = '/api/image/s3-signed-req?';
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        'file-name': file.name,
        'file-type': file.type
      }
    }).then(res => {
      console.log(res);
      file.name = res.filename;
      uploadFile(file, res.signedRequest, res.url);
    }).catch(e => alert('Could not upload file.'));
  }

  function uploadFile(file, signedRequest, url) {
    $.ajax({
      type: 'PUT',
      url: signedRequest,
      data: file,
      contentType: false,
      enctype: 'multipart/form-data',
      processData: false
    }).then(() => {
      $('.image-container img').attr('src', url);
      saveProfileImageUrl(url);
    });
  }

  function saveProfileImageUrl(photo) {
    $.ajax({
      type: 'PUT',
      url: '/api/image/profile-image',
      data: {photo}
    }).then(() => {
      hideLoadingCircle();
      const alert = $('#upload-complete-alert');
      alert.fadeIn('slow', function () {
        setTimeout(() => alert.fadeOut(), 3000);
      });
    })
  }

  function showLoadingCircle () {
    $('#loading-wrapper').css('display', 'block');
  }

  function hideLoadingCircle () {
    $('#loading-wrapper').css('display', 'none');
  }

// edit button loading info to modal
   $('.editBtn').on("click", function(event) {
    event.preventDefault();

    var editID= $(this).attr('data-id');
    var editName= $(this).attr('data-name');
    var editDescription= $(this).attr('data-description');
    var editRole= $(this).attr('data-role');
    var editTeamMate= $(this).attr('data-teamMate');
    var editURL= $(this).attr('data-url');
    var editScreenshot =$(this).attr('data-screenshot');

    if(editScreenshot === null || "{{this.screenshot}}"){
      editScreenshot = "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQFEeGt4l7ksmLOwwBkvt5IaQYiQnbRvRscbCRBP823VxROxGGX"
    };


    $("#editProjectModal").modal('toggle');
    $("#projectImage").attr('src', editScreenshot).attr('data-id', editID);      
    $("#input1").val(editName);
    $("#input2").val(editDescription);
    $("#input3").val(editRole);
    $("#input4").val(editTeamMate);
    $("#input5").val(editURL);
    
  });

   $('.mypic').hover(function(){
      $('.mypic').toggleClass('heartbeat');
   });

// submit button on edit modal
   $('#editSubmitButton').on("click", function(event) {
    event.preventDefault();

    var projectID = $("#projectImage").attr('data-id');
    var name= $("#input1").val();
    var desc= $("#input2").val();
    var role= $("#input3").val();
    var teammate= $("#input4").val();
    var url= $("#input5").val();
    var screenshot =$('#projectImage').attr('src');

    var newInfo={
      name: name,
      decription: desc,
      role: role,
      teamMate: teammate,
      url: url,
      screenshot: screenshot
    };

    showLoadingCircle();
    $("#editProjectModal").modal('toggle'); 

      $.ajax({
      type: 'PUT',
      url: "/api/project/"+projectID,
      data: newInfo
    }).then(res => {

      hideLoadingCircle();
      

      $("[data-rowId='"+res.id+"'] td:nth-child(1)").html(name);
      $("[data-rowId='"+res.id+"'] td:nth-child(2)").html(desc);

      });
    });



})(jQuery);