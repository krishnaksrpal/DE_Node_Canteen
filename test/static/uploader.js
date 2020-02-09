if (!user){
    location.replace("/login.html");
}
if(user){
    if(!user["is_counseller"]){
        location.replace("../index.html");
    }
}
