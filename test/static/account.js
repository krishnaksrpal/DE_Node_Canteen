var user;
var num;
var assign={};
function updateTable(){
    if(localStorage.getItem("user")){
        var str="";
        user=localStorage.getItem("user");
        user= JSON.parse(user);
        num =0;
        for (const key in user) {
            str+="<tr>";
            if(key!="coupons"&&key!="balance"&&key!="attendence"){
                str+=  "<td>" + key + "</td>";
                str+=  "<td>" + user[key] + "</td>";
            }
            num += 1;
            assign[num] = key;
            if(key == "superuser"){
                if(user[key]){
                    str+=  "<td>"+
                    '<a class="btn-floating btn-small waves-effect waves-light green" id="btn'+num+'"><i class="material-icons">create</i></a>' 
                    +"</td>";
                }
                else{
                    str+=  "<td>"+
                    '<a class="btn-floating btn-small waves-effect waves-light red" id="btn'+num+'"><i class="material-icons">block</i></a>'
                    +"</td>";
                }
            }
            else if(key=="coupons" || key=="balance"||key=="attendence"){
                if(key=="coupons"){
                    var coupons = user[key];
                    var dates = [];
                    var couponStr = "";
                    // console.log(coupons[0]["expire-date"]);
                    coupons.forEach(element => {
                        dates.push(new Date(element["expire-date"]))
                    });
                    var date = (new Date(Math.min(...dates)).toString().substring(4,15));
                    $("#NoOfCoupons").html(coupons.length);
                    $("#expiry-date").html(date);
                }else if(key=="balance"){
                    var bal = user[key];
                    var balstr ="";
                    balstr +=   '<span class="flow-text">' + bal["value"] + '+ <br></span>'+
                                '<span class="blue-text">' + bal["deducts"]["value"] + ' (To be deducted on ' + new Date(bal["deducts"]["date"]).toString().substring(4,15) +')</span>';
                    $("#balance-content").html(balstr);
                }else if(key == "attendence"){
                    var att = user[key];
                    var attstr1 = "";
                    attstr1 +=  '<span class="flow-text">' + att["value"] + ' <br></span>'+
                                '<span class="blue-text"> Updated on ' + new Date(att["updatedOn"]).toString().substring(4,15) +'</span>';
                    $("#attendenceval").html(attstr1);
                    var currentatt = att["noOfLectures"] * (att["value"]/100);
                    var needed = att["totalLectures"] * 0.75;
                    var str1='';
                    if(needed<=currentatt){
                        str1 +=  '<span class="flow-text"> you are alright with your attendence <br></span>'
                    }else{
                        var actuallyneeded = needed - currentatt;
                        var inhow = att["totalLectures"]-att["noOfLectures"];
                        str1 +=  '<span class="flow-text">you should attend ' + actuallyneeded + 'lectures <br></span>'+
                                '<span class="blue-text"> of ' + inhow +' lectures to maintain attendence</span>';
                    }
                    $("#doit").html(str1);
                }
            }
            else if(key == "enrollment"){
                str+=  "<td>"+
                '<a class="btn-floating btn-small waves-effect waves-light red" id="btn'+num+'"><i class="material-icons">block</i></a>'
                +"</td>";
            }
            else{
                str+=  "<td>"+
                '<a class="btn-floating btn-small waves-effect waves-light green" id="btn'+num+'"><i class="material-icons">create</i></a>' 
                +"</td>";
            }
            // str+=  "<td>" +"OK" + "</td>";
            str+="</tr>"; 
        }
        num+=1;
        assign[num] = "password";
        user[assign[num]]="TAKE FROM USER";
        str+="<tr>";
            str+=  "<td>" + "password" + "</td>";
            str+=  "<td>" + "********" + "</td>";
            str+=  "<td>"+
                    '<a class="btn-floating btn-small waves-effect waves-light green" id="btn'+num+'"><i class="material-icons">create</i></a>' 
                    +"</td>";
        str+="</tr>";
        $("#account_data")[0].innerHTML=str;
        console.log("done");
    }
    else{
        location.replace("/index.html");
    }
}
updateTable();
$(".btn-floating").click(function (e) { 
    e.preventDefault();
    let id = e.currentTarget.id;
    // console.log(e.currentTarget.id);
    id=id.substring(3,4);
    console.log(id,num);
    console.log(user[assign[id]]);
    let change =  {
        type :  assign[id],
        from :  user[assign[id]]
    } 
    localStorage.setItem("change",JSON.stringify(change));
    location.replace("/changeattributes.html");
});
if(user["is_counseller"] || user["is_admin"]){
    $("#remove")[0].innerHTML = "";
}
