if (user) {

    let notifications;
    function fetchnoti() {
        fetch("/noti/" + user["username"]).then(res => res.json()).then((data) => {
                console.log(data,"noti");
                data.forEach(ele => {
                    M.toast({
                        'html':ele["msg"],
                        'classes' : "green white-text rounded"
                    });    
                });
                
            })
    }
    fetchnoti();
    setInterval(() => {
        fetchnoti();
    }, 10000);
}
function createNoti(data){
    $.ajax({
        type: "post",
        url: "/noti",
        data: {noti:data},
        // dataType: "dataType",
        success: function (response) {
            console.log(response)
            // console.log(transactions);
        }
    });
}