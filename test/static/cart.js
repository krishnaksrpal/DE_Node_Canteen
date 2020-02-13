var order = JSON.parse(localStorage.getItem("order"));
var sendcoupons = JSON.stringify(user["coupons"]);
var sendbalance = JSON.stringify(user["balance"]);
var assign,show,total;
if(order){
    show = makeShow(order);
    dispData(show);
}
else{
    location.replace("emenu.html");
}

function dispData(show){
    $("#cart-material").html("");   
    var arr = makeTable(show);
    //arr contains str,assign 0->str , 1->assign
    $("#cart-material").append(arr[0]);
    assign=arr[1];
    show = arr[2];
    var arr = makeTotal(show);
    $("#cart-material").append(arr[0]);
    total=arr[1];
    var str = forModal(total);
    $("#lastCheckout").html(str);
    console.log("dispData");
}

function forModal(total){
    let str = "";
    let remain = total;
    $("#needed").html(total);
    if(user["balance"]){
        if(user["balance"]["deducts"]){
            str += "<tr><td> previously used coupon </td>"+'<td>'+user["balance"]["deducts"]["value"]+"</td>";
            if(remain>user["balance"]["deducts"]["value"]){
                str+="<td>" + user["balance"]["deducts"]["value"] + "</td>";
                remain = remain - user["balance"]["deducts"]["value"];
                delete user["balance"]["deducts"];
            }else {
                str+="<td>" + remain + "</td>";
                user["balance"]["deducts"]["value"] -= remain;
                remain = 0; 
            }
            str+="</tr>";
        }
    }
    if(user["coupons"]){
        var coupons = user["coupons"];
        str += "<tr><td>coupons</td><td>" + (coupons.length*20) + "</td>";
        let used = 0 ;
        // remain = 30;
        console.log(coupons,remain,user["balance"]);
        if(remain>(coupons.length*20)){
            remain -= (coupons.length*20);
            used += (coupons.length*20);
            delete user["coupons"];
            console.log("here i am");
        }else {
            coupons.sort(GetSortOrderdes("expire-date"));
            let copy = coupons;
            let i;
            for(i=coupons.length-1;i>=0;i--){
                if(remain>=20){
                    remain-=20;
                    used += 20;
                    copy.splice(i);
                }
                else if(remain == 0){
                    break;
                }
                else {
                    let deductsvalue = 20 - remain;
                    used += remain;
                    remain = 0;
                    user["balance"]["deducts"] = {}
                    user["balance"]["deducts"]["value"] = deductsvalue;
                    user["balance"]["deducts"]["date"] = copy[i]["expire-date"];
                    copy.splice(i);
                }
            }
        }
        str += "<td>" + used +"</td></tr>"
        console.log(coupons,remain,user["balance"]);
    }
    if(user["balance"]){
        str+="<tr><td>balance in wallet</td><td>"+user['balance']['value']+"</td>";
        if(remain>user["balance"]["value"]){
            str+="<td>"+user["balance"]["value"]+"</td></tr>";
            remain-=user["balance"]["value"];
            user["balance"]["value"]=0;
        }else{
            str+="<td>"+remain+"</td></tr>";
            remain=0;
        }
    }
    if(remain!=0){
        str+= '<tr><td>cash</td><td colspan="2" class="left">'+remain+"</td>";
    }
    return str;
}

function GetSortOrderdes(prop) {  
    return function(a, b) {
        if(prop == "expire-date"){
            if((new Date(a[prop]))>(new Date(b[prop]))){
                return -1;
            }else if((new Date(a[prop]))<(new Date(b[prop]))){
                return 1;
            }
            return 0;
        }  
        else {
            if (a[prop] > b[prop]) {  
                return -1;  
            } else if (a[prop] < b[prop]) {  
                return 1;  
            }
            return 0;  
        } 
    }  
}
function makeTotal(show){
    let total = 0;
    let str=''
    for (const key in show) {
        total += show[key]["quantity"]*show[key]["price"];
    }
    str += '<tr><th colspan="4" class="center">Total</th><td>'+total+'</td></tr>';
    return [str,total];
}

function makeShow(order){
    let show={}
    order.forEach(element => {
        if(show[element["itemName"]]){
            show[element["itemName"]]["quantity"] += element["quantity"];
        }else{
            show[element["itemName"]] = element;
        }
        // console.log(show);
        //show contains all the items in the order; 
    });
    return show;
}

function makeTable(show){
    var assign={};
    show = checkShow(show);
    let str;
    let num=0;
    for (const key in show) {
        // console.log(show[key]);
        // show[key] contains a single item of the order;
        str+="<tr>"
        for (const key1 in show[key]) {
            // console.log(show[key][key1]);
            str +=  "<td>"+
                    show[key][key1]+
                    "</td>";
        }
        str +=  "<td>";  
        str +=  '<a class="btn-floating btn-small blue"><i class="material-icons" id="btn'+(num++)+'">add</i></a>';
        console.log(0);
        str +=  '<a class="btn-floating btn-small red"><i class="material-icons" id="btn'+(num++)+'">remove</i></a>';
        console.log(1);
        str +=  '<a class="btn-floating btn-small orange"><i class="material-icons" id="btn'+(num)+'">delete</i></a>';
        console.log(2);  
        str +=  "</td>";
        console.log(key,assign);
        assign[num--]=key;
        assign[num--]=key;
        assign[num]=key;
        num += 3;
        str += "<td>" + show[key]["price"] * show[key]["quantity"] + "</td>";
        str += "</tr>";
        // $("#cart-material").append(str);
    }
    console.log("MakeTable");
    return [str,assign,show];
}
// $(".material-icons").click(function (e) { 
//     // e.preventDefault();
//     let num=parseInt(e.target.id.substring(3,4));
//     console.log(parseInt(e.target.id.substring(3,4)),assign);
//     console.log(show[assign[num]]);
//     if(num%3==0){
//         show[assign[num]]["quantity"]++;
//     }else if(num%3==1){
//         show[assign[num]]["quantity"]--;
//     }else if(num%3==2){
//         delete show[assign[num]];
//     }
//     dispData(show);
//     console.log("here");    
// });
function checkShow(show){
    console.log(show);
    for (const key in show) {
        if(show[key]["quantity"]<=0){
            delete show[key];
        }
    }
    console.log(show);
    return show;
}
var limiter=0;
$('*').click((e)=>{
    if(e.target.classList.contains("material-icons")){
        limiter++;
        console.log(limiter);
        if(limiter==1){
            let num=parseInt(e.target.id.substring(3,4));
            console.log(parseInt(e.target.id.substring(3,4)),assign);
            console.log(show[assign[num]]);
            if(num%3==0){
                show[assign[num]]["quantity"]++;
            }else if(num%3==1){
                show[assign[num]]["quantity"]--;
            }else if(num%3==2){
                delete show[assign[num]];
            }
            dispData(show);
            console.log("here");
        }    
    }
    setTimeout(()=>{
        limiter=0;
    },100);
})

function clearOrder(){
    order={};
    show={};
    localStorage.removeItem("order");
    dispData(show);
    setTimeout(()=>{
        location.replace("index.html");
    },2000);
}

function makeOrder(){
    $.ajax({
        type: "post",
        url: "/trans",
        data: {
            from    :   {
                name: user["fullname"],
                username: user["username"]
            },
            to      :   "admin",
            total   :   total,
            order : show,
            status : "Being Prepared"
        },
        // dataType: "dataType",
        success: function (response) {
            console.log(response);
            // clearOrder();
            $.ajax({
                type: "post",
                url: "/change/balance",
                data: {
                    user:user,
                    from : sendbalance,
                    to : user["balance"]
                },
                // dataType: "dataType",
                success: function (response) {
                    console.log(response)
                    data = response;
                    if(data["msg"]=="done"){
                        localStorage.setItem("user",JSON.stringify(data["user"]))
                    }
                }
            });
            $.ajax({
                type: "post",
                url: "/change/coupons",
                data: {
                    user:user,
                    from : sendcoupons,
                    to : user["coupons"]
                },
                // dataType: "dataType",
                success: function (response) {
                    console.log(response)
                    data=response;
                    if(data["msg"]=="done"){
                        localStorage.setItem("user",JSON.stringify(data["user"]))
                    }
                }
            });
            setTimeout(()=>{
                // M.toast({
                //     'html':"<h5>"+ response["total"] +" sent to "+response["to"]+"</h5>",
                //     'classes' : "green white-text rounded"
                // })
                M.toast({
                    'html':"<h5>Order Sent!</h5>",
                    'classes' : "green white-text rounded"
                })
                clearOrder();
                setTimeout(()=>{
                    location.replace("admin/orders.html");
                },2000)
            },100);
        }
    });
}

$(document).ready(function(){
    $('.modal').modal();
  });







//   let form = document.getElementById("f1");// action mat likhna
//   form.onsubmit = func1;

//   function func1(){
//       let select = document.getElementById("sel");
//       if(select.value == "ahem"){
//           location.replace("ahem.html")
//       }
//       else{
//           location.replace("baroda")
//       }
//   }