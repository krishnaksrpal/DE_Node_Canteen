const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
if(user){
    location.replace("index.html");
}
var user;
$("#login_form").on('submit', function (e) {
    e.preventDefault();
    formUsername=$('#id_username').val();
    formPassword = $('#id_password').val();
    console.log(formUsername);
    $.ajax({
        type: "get",
        url: "/login",
        data: {
            username:formUsername,
            password:formPassword
        },
        // dataType: "application/json",
        // ContentType: "application/x-www-form-urlencoded",
        success: function(result,status,xhr){
            console.log('here' , result);
            if(result["obj"]){
                user = result["obj"];
                M.toast({
                    'html':"<h5> Logged in as "+ user["fullname"].toUpperCase()+"</h5>",
                    'classes' : "green white-text rounded"
                });
                localStorage.setItem("user",JSON.stringify(user));
                setTimeout(()=>{
                    location.replace("index.html");
                },2000);
            }
        },
        error: function(xhr,status,error){
            console.log('here ' ,xhr, error);
            if(error == "Not Found"){
                console.log("here");
                let error= "such user does not exist".toUpperCase();
                M.toast({
                    'html':"<h5>"+ error +"</h5>",
                    'classes' : "red white-text rounded"
                });
            }
            else if(error == "Forbidden"){
                let error= "the password you entered was wrong".toUpperCase();
                M.toast({
                    'html':"<h5>"+ error +"</h5>",
                    'classes' : "green white-text rounded"
                });
            }
        }
    });
    
});


// $("#login_form").onSubmit(function (e) { 
// });