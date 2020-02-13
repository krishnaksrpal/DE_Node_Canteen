var user;

function checkUser(){
    if(localStorage.getItem("user")){
        user=localStorage.getItem("user");
        user= JSON.parse(user);
        $("#login_account_nav")[0].innerHTML= user["username"];
        $("#login_account_nav")[0].href="/account.html";
        $("#signup_logout_nav")[0].innerHTML= "Logout";
        $("#signup_logout_nav")[0].href="/index.html";
        $("#signup_logout_nav")[0].onclick=()=>{logout()};
        var p=$("#signup_logout_nav")[0].onclick;
        console.log(p);
    }
    else {
        $("#login_account_nav")[0].innerHTML= "Login";
        $("#login_account_nav")[0].href="/login.html";
        $("#signup_logout_nav")[0].innerHTML= "Signup";
        $("#signup_logout_nav")[0].href="/signup.html";
    }
    if(user["is_counseller"]){
        let lis = document.createElement("li");
        let list = document.getElementById("nav");
        lis.innerHTML = "<a href='/uploader'>Upload Data</a>";
        nav.append(lis);
    }
    if(user["is_admin"]){
        let lis = document.createElement("li");
        let list = document.getElementById("nav");
        lis.innerHTML = "<a href='/admin'>Admin</a>";
        list.append(lis);
    }
}
function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("order");
    user=undefined;
    location.replace("/index.html");
    // checkUser();
}
checkUser();
console.log(user);
