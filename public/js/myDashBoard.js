/**
 * Created by Hyungwu Pae on 5/8/17.
 */
(function($) {
  const skills = ['jQuery', 'Angular', 'MongoDB', 'MySQL', 'Django', 'React', 'Sass', 'LESS', 'Express', 'ES6', 'Typescript', 'Firebase'];
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

    if(typedText < 1) return;

    //if user typed or selected the skill which exists in the skills array
    if(skills.indexOf(typedText) > -1) return addToSkillList(typedText);

    //else

    const filteredSkills = skills.filter((skl, i) => {
      return skl.toLowerCase().includes(typedText.toLowerCase()) && selectedSkills.indexOf(skl) < 0
    });

    //this means we should reduce options element list
    if(filteredSkills.length < $('#skill-list').children().length) {
      $('#skill-list').children().each(function (idx, elem) {
        // remove if this skill name is not matched anymore
        if(!filteredSkills.includes($(elem).attr("value"))) $(elem).remove();
      });
    } else if (filteredSkills.length === $('#skill-list').children().length) {
      // do nothing
    } else { //re render skills
      filteredSkills.forEach(skl => $('#skill-list').append($("<option>").attr("value", skl)));
    }
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



})(jQuery);