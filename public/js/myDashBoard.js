/**
 * Created by Hyungwu Pae on 5/8/17.
 */
(function ($) {

  /**
   * VARIABLES
   */
  let selectedSkillNames = [];
  let selectedSkillIds = [];
  let skillsArray = [];
  let skillNames = [];
  let selectedPjtId;

  $.get('/api/skill')
    .then(results => {
      skillsArray = results;
      console.log(skillsArray);
      skillNames = skillsArray.map(skill => skill.name);
    });



  /**
   * EVENT LISTEN
   */
  //profile image animation
  $('.mypic').hover(function () {
    $('.mypic').toggleClass('heartbeat');
  });

  //change show public
  $('#addBtn').on("click", function (event) {
    $.put("/api/project/" + $(this).attr('data-id'), {showToPublic: true}, function (result) {
      // need to redirect to this same page after each project added
    });
  });


  // Add skill input auto completion.
  $('#input-skill').on('input', function (ev) {
    const typedText = $(this).val();
    console.log(typedText)
    if (typedText.length < 2) return;

    //if user typed or selected the skill which exists in the skills array
    const index = skillNames.indexOf(typedText);
    if (index > -1) return addToSkillTable(typedText, skillsArray[index].id);

    //else
    const filteredSkills = skillNames.filter((name, i) => {
      return name.toLowerCase().includes(typedText.toLowerCase()) && selectedSkillNames.indexOf(name) < 0
    });

    //delete previous <option> tags
    $('#skill-list').empty();

    //re render skills
    filteredSkills.forEach(skl => $('#skill-list').append($("<option>").attr("value", skl)));
  });



  //change project screenshot
  $('#projectImage').on('click', function () {
    $('#project-image-input').trigger('click');
  });

  $('#project-image-input').change(function () {
    const file = this.files[0];
    if (!file) return alert('No file selected.');
    const reader = new FileReader();
    reader.onload = function (e) {
      $('#projectImage').attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
  });


  //change user's photo
  $('#change-photo').on('click', function () {
    $('#profile-image-input').trigger('click');
  });

  //on select a new profile image file
  $('#profile-image-input').change(function () {
    const file = this.files[0];
    if (!file) return alert('No file selected.');
    showLoadingCircle();
    getSignedRequestAndUpload(file)
      .then(url => {
        $('.image-container img').attr('src', url);
        saveProfileImageUrl(url);
      });
  });


  // Edit project button loading info to modal
  $('.editBtn').on("click", function (event) {
    $('#modal-title').html("Edit your project");
    $('#createSubmitButton').css({display: 'none'});
    $('#editSubmitButton').css({display: 'inline-block'});
    event.preventDefault();

    selectedPjtId = $(this).attr('data-id');
    const editName = $(this).attr('data-name');
    const editDescription = $(this).attr('data-description');
    const editRole = $(this).attr('data-role');
    const editTeamMate = $(this).attr('data-teamMate');
    const editURL = $(this).attr('data-url');
    const editScreenshot = $(this).attr('data-screenshot') || "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQFEeGt4l7ksmLOwwBkvt5IaQYiQnbRvRscbCRBP823VxROxGGX";

    //reset selectedSkills
    emptySkillTable();
    initSelectedSkills();

    //set selected skill
    if($(this).attr('data-skills')) {
      const selectedSkills = JSON.parse($(this).attr('data-skills'));
      console.log(selectedSkills);
       selectedSkills.forEach(skill => {
        addToSkillTable(skill.name, skill.id);
      });
    }

    $("#editProjectModal").modal('toggle');
    $("#projectImage").attr('src', editScreenshot);
    $("#input1").val(editName);
    $("#input2").val(editDescription);
    $("#input3").val(editRole);
    $("#input4").val(editTeamMate);
    $("#input5").val(editURL);
  });

  //Add project button click
  $('#addButton').on("click", function (event) {
    event.preventDefault();

    //reset selectedSkills
    emptySkillTable();
    initSelectedSkills();

    $('#modal-title').html("Tell us about your project");
    $('#editSubmitButton').css({display: 'none'});
    $('#createSubmitButton').css({display: 'inline-block'});
    $("#editProjectModal").modal('toggle'); //share editProfileModal with "edit project"

  });

  //Input validation
  $('#input1, #input5').on('keyup', function () {
    const nameInput = $('#input1');
    const urlInput = $('#input5');
    const name = nameInput.val();
    const isValidUrl = isUrlValid(urlInput.val());
    if(name && isValidUrl) { //valid input
      urlInput.css({'border-color': 'limegreen'});
      nameInput.css({'border-color': 'limegreen'});
      $('#editSubmitButton, #createSubmitButton').prop("disabled", false);
    }
    else { //invalid
      $('#editSubmitButton, #createSubmitButton').prop("disabled", true);
      if(!name) nameInput.css({'border-color': 'red'});
      if(!isValidUrl) urlInput.css({'border-color': 'red'});
    }
  });

  // Save EDITED Project: submit button on edit modal
  $('#editSubmitButton').on("click", submitProjectInfo.bind(null, false));

  // Create a new Project
  $('#createSubmitButton').on("click", submitProjectInfo.bind(null, true));


  /**
   * Functions
   */

  function getSignedRequestAndUpload(file) {
    const url = '/api/image/s3-signed-req?';
    return $.ajax({
      url: url,
      type: 'GET',
      data: {
        'file-name': file.name,
        'file-type': file.type
      }
    }).then(res => {
      file.name = res.filename;
      return uploadFile(file, res.signedRequest, res.url);
    }).catch(e => alert('Could not upload file.'));
  }

  function uploadFile(file, signedRequest, url) {
    return $.ajax({
      type: 'PUT',
      url: signedRequest,
      data: file,
      contentType: false,
      enctype: 'multipart/form-data',
      processData: false
    }).then(() => {
      return url;
    });
  }

  function saveProfileImageUrl(photo) {
    $.ajax({
      type: 'PUT',
      url: '/api/user/profile-image',
      data: {photo}
    }).then(() => {
      hideLoadingCircle();
      const alert = $('#upload-complete-alert');
      alert.fadeIn('slow', function () {
        setTimeout(() => alert.fadeOut(), 3000);
      });
    })
  }

  function showLoadingCircle() {
    $('#loading-wrapper').css('display', 'block');
  }

  function hideLoadingCircle() {
    $('#loading-wrapper').css('display', 'none');
  }

  function addToSkillTable(skillName, skillId) {
    $('#skillTable').append(
      $('<tr>').append(
        $('<h3>').append($('<span class="label label-primary">')
          .append($('<span class="glyphicon glyphicon-remove">'))
          .text(skillName))
      )
    );
    console.log("HERE CALLED")
    $('#input-skill').val('');
    selectedSkillNames.push(skillName);
    selectedSkillIds.push(skillId)
  }

  function emptySkillTable() {
    console.log("HERE");
    $('#skillTable').children().remove();
  }

  //submit project CREATED or EDITED
  function submitProjectInfo(forCreate) {
    const url = $("#input5").val();
    const name = $("#input1").val();
    const description = $("#input2").val();
    const role = $("#input3").val();
    const teamMate = $("#input4").val();
    const skills = selectedSkillIds;

    let newInfo = {
      name,
      description,
      role,
      teamMate,
      url,
      skills: JSON.stringify(skills)
    };

    showLoadingCircle();
    $("#editProjectModal").modal('toggle');

    //if we have project screenshot to upload
    const screenshotFile = $('#project-image-input')[0].files[0];
    if(screenshotFile) {
      getSignedRequestAndUpload(screenshotFile)
        .then(screenshot => {
          newInfo.screenshot = screenshot;
          saveProject(newInfo, forCreate);
        });
    }
    //no screenshot update
    else saveProject(newInfo, forCreate);
  }

  function saveProject(data, forCreate) {
    const type = forCreate ? 'POST' : 'PUT';
    const url = '/api/project' + (forCreate ? '' : `/${selectedPjtId}`);

    return $.ajax({ type, url, data })
      .then(projectObj => {
        // console.log(projectObj);
        if(forCreate) createProjectView(projectObj);
        else UpdateProjectView(projectObj);
      });
  }

  function UpdateProjectView(projectObj) {
    const updatedProject = projectObj.project;
    const skills = projectObj.skills;
    const tds = $(`#project${updatedProject.id} td`);
    tds.eq(0).html(updatedProject.name);
    tds.eq(1).find('img').attr('src', updatedProject.screenshot);
    tds.eq(2).html(updatedProject.description);

    tds.eq(4).find('button').attr({
      'data-name': updatedProject.name,
      'data-role': updatedProject.role,
      'data-description': updatedProject.description,
      'data-url': updatedProject.url,
      'data-screenshot': updatedProject.screenshot,
      'data-teamMate': updatedProject.teamMate,
      'data-skills': JSON.stringify(skills)
    });

    hideLoadingCircle();
  }

  function createProjectView(projectObj) {
    const createdProject = projectObj.project;
    const skills = projectObj.skills;
    const newProjectTrElem = $('<tr id=`project${createdProject.id}`>')
      .append($('<td>').html(createdProject.name))
      .append($('<td class="text-center">').append( $('<img class="projectThumbnail" alt="project thumbnail">').attr('src', createdProject.screenshot)) )
      .append($('<td class="descField">').html(createdProject.description))
      .append($('<td>').append( $('<button class="btn btn-danger addBtn">').attr('data-id', createdProject.id).html('Add') ))
      .append($('<td>').append( $('<button class="btn btn-warning editBtn">').attr({
          'data-name': createdProject.name,
          'data-role': createdProject.role,
          'data-description': createdProject.description,
          'data-url': createdProject.url,
          'data-screenshot': createdProject.screenshot,
          'data-teamMate': createdProject.teamMate,
          'data-skills': JSON.stringify(skills)
        })
          .html('Edit')
      ));

    $('#projectBox tbody').append(newProjectTrElem);
    hideLoadingCircle();

  }

  function initSelectedSkills() {
    selectedSkillNames = [];
    selectedSkillIds = [];
  }


  function isUrlValid(url) {
    if(!url) return true;
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
  }

})(jQuery);