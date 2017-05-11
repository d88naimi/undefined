// $(document).ready(function() {

$("#userQuery").on("click",
    function findUser(ev) {
        console.log("IS THIS CALLED?")
        var url = '/api/user/search/?qs=' + $("#search").val().trim();
    
        $.get(url)
            .then(function(result) {
                var foundUsers = result.users;
            // for(var i = 0; i<foundUsers.length; i++){
            //     console.log(foundUsers[i]);
            // }
        });
})

// });

