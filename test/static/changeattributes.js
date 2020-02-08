const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
if(localStorage.getItem("change")){
    var data = localStorage.getItem("change");
    var changeJson = JSON.parse(data);
    localStorage.removeItem("change");
    console.log(changeJson);
    if(changeJson["type"]!= "password"){
        $("#id_from").val(changeJson["from"]);
        $("#id_from").attr('disabled','disabled');
        $("#id_to").focus();
    }
    else{
        $("#id_from").attr("placeholder", "previous password");
        $("#id_from").attr("type", "password");
        $("#id_to").attr("type", "password");
        $("#id_cto").attr("type", "password");
        $("#forpass").removeClass("hidden");
    }
    $("#change_form").on('submit', function (e) {
        e.preventDefault();
        let from=$('#id_from').val();
        let to = $('#id_to').val();
        var dothis = true;
        // let to = "change";
        if(changeJson["type"]="password"){
            let cto = $('#id_cto').val();
            if(cto != to) {
                dothis = false;
            }
        }
        console.log(from, to);
        if(dothis){
            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                // dataType: "dataType",
                url: "/change/"+changeJson["type"],
                data: {
                    from : from,
                    to : to,
                    user : user
                },
                success: function (data, status, xhr) {
                    // console.log('status: ' + status + ', data: ' + data["type"]);
                    console.log(data);
                    if(data["msg"]=="done"){
                        localStorage.setItem("user",JSON.stringify(data["user"]))
                        M.toast({
                            'html':"<h5>"+ data["type"] +" changed</h5>",
                            'classes' : "green white-text rounded"
                        });
                        sleep(5000).then(
                            location.replace("/account.html")
                        )
                    }
                    else{
                        M.toast({
                            'html':"<h5>"+ data["msg"] +"</h5>",
                            'classes' : "red white-text rounded"
                        });
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
        else {
            M.toast({
                'html':"<h5>PASSSWORD AND CONFIRM PASSWORD DOES NOT MATCH</h5>",
                'classes' : "red white-text rounded"
            });
            $("#id_from").val("");
            $("#id_to").val("");
            $("#id_cto").val("");
            $("id_from").focus();
        }
    })
}
else {
    location.replace("/account.html");
}