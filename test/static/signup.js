const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
if(user){
    location.replace("index.html");
}
console.log($("#student_form"));
$("#student_form").submit(function (e) { 
    e.preventDefault();
    let type=$("#student_form")[0][0].value;
    let fullname=$("#student_form")[0][1].value;
    let username=$("#student_form")[0][2].value;
    let enrollment=$("#student_form")[0][3].value;
    let password=$("#student_form")[0][4].value;
    let cpassword=$("#student_form")[0][5].value;
    let email=$("#student_form")[0][6].value;
    let phone_no=$("#student_form")[0][7].value;
    let security_question=$("#student_form")[0][8].value;
    let answer=$("#student_form")[0][9].value;
    // let type="student";
    // let fullname="krishna r pal";
    // let username="170390107022";
    // let enrollment="170390107022";
    // let password="8956";
    // let cpassword="8956";
    // let email="krr@gamil.com";
    // let phone_no="987654321";
    // let security_question="What is your Pet Name?";
    // let answer="none";
    console.log(type,fullname,username,enrollment,password,cpassword,email,phone_no,security_question,answer);
    if(password == cpassword){
        $.ajax({
            type: "post",
            url: "/signup",
            data: {
                // type:type,
                fullname:fullname,
                username:username,
                enrollment:enrollment,
                password:password,
                // cpassword:cpassword,
                email:email,
                phone_no:phone_no,
                security_question:security_question,
                answer:answer 
            },
            // dataType: "application/json",
            success: function (data, status, xhr) {
                // console.log('status: ' + status + ', data: ' + data["type"]);
                console.log(data);
                if(data["msg"] == "User registered"){
                    let user = data["user"];
                    M.toast({
                        'html':"<h5> Logged in as "+ user["fullname"].toUpperCase()+"</h5>",
                        'classes' : "green white-text rounded"
                    });
                    localStorage.setItem("user",JSON.stringify(user));
                    setTimeout(()=>{
                        location.replace("index.html")
                    },2000);
                }
                else if(data["msg"] == "User with same name exists"){
                    // let user = data["user"];
                    M.toast({
                        'html':"<h5>"+ data["msg"].toUpperCase()+"</h5>",
                        'classes' : "red white-text rounded"
                    });
                    // localStorage.setItem("user",JSON.stringify(user));
                    // sleep(2000).then(
                    //     location.replace("/index.html")
                    // )
                }
            },
            error: function (jqXhr, textStatus, errorMessage) {
                    console.log('Error' + errorMessage);
                    // var r = jQuery.parseJSON(errorMessage.responseText);
                    // console.log("Message: " + r.Message);
                    // console.log("StackTrace: " + r.StackTrace);
                    // console.log("ExceptionType: " + r.ExceptionType);
                    // console.log(errorMessage.responseText);
            }
        });
    }
    else{
        M.toast({
            'html':"<h5> Passwords are not same </h5>",
            'classes' : "red white-text rounded"
        });
    }
});