// $(document).ready(function() {

$("#userQuery").on("click",
function findUser(qs) {
    var qs = $("#typeahead").val();
    var option = {
        type: 'GET',
        url: '/api/user/find-users/' + qs
    }
    $.ajax(option)
        .then(function(result) {
            var foundUsers = result.users;
            for(var i = 0; i<foundUsers.length; i++){
                console.log(foundUsers[i]);
            }
        });
})

// });

