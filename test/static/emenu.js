var products;
var disp;
if(user){
  $.ajax({
    type: "get",
    url: "/products",
    success: function (response) {
      console.log(response);
      products = response;
      disp=filter(products,"tag");
      updateArea(disp);
    }
  });
}else {
  location.replace("/login.html");
}
function filter(products,type){
  var send = [];
  var key;
  if(type == "tag"){
    key=["HOT","SPECIAL","SALE"]
  }
  else{
    key=[...type];
  }
  products.forEach(element => {
    if(key.includes(element["tag"])){
      send.push(element);
      console.log("here");
    } else  if(key.includes(element["type"])){
      send.push(element);
      console.log("here");
    }
  });
  console.log(send);
  return send;
}
var count=0;
$('*').click(function (e) { 
  // console.log($("#orders_notification"))
  
  if(e.target.classList.contains("doNav")){

  }
  else if(count<1){
    e.preventDefault();
    count += 1;
    // console.log(e,e.target.parentElement.classList.contains("buy"),e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0]);
    console.log(e,e.target.innerText);
    if(e.target.classList.contains("typechange")){
      let type = e.target.innerText;
      if(type == "HOT"){
        disp = filter(products,"tag")
      }
      else{
        disp = filter(products,[type])
      }
      updateArea(disp);
    }
    else if(!e.target.classList.contains("typechanger")){
      var atag = e.target.parentElement;
      var inputtag = e.target.parentElement.parentElement.parentElement.children[1].children[0];
      var product_detailtag = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0];
      if(atag.classList.contains("buy")){
        console.log(inputtag.value);
        let num=parseInt(inputtag.value);
        num += 1;
        inputtag.value = num;
      }
      else if(atag.classList.contains("unbuy")){
        console.log(inputtag.value);
        let num=parseInt(inputtag.value);
        num -= 1;
        inputtag.value = num;
      }
      else if(atag.classList.contains("addToCart")){
        console.log(product_detailtag.children[1].children[0].innerText);
        let num=parseInt(inputtag.value);
        let order = {
          itemName : product_detailtag.children[0].children[0].innerText,
          price : product_detailtag.children[1].children[0].innerText,
          quantity : num
        }
        if(!localStorage.getItem("order")){
          localStorage.setItem("order","[]");
        }
        var toPost = JSON.parse(localStorage.getItem("order"))
        toPost.push(order);
        console.log(toPost)
        localStorage.setItem("order",JSON.stringify(toPost));
        inputtag.value = 0;
        $("#orders_notification")[0].innerHTML = (toPost.length);
        console.log(toPost,toPost.length,$("#orders_notification"));
      }
    }
    setTimeout(()=>{
      count = 0;
    },100);
  } 
});


function updateArea(disp){
  $("#products_case").html("");
  disp.forEach(element => {
    let str = ' <div class="col-xs-12 col-md-6">' +
              '<div class="prod-info-main prod-wrap clearfix">' +
              '<div class="row">' +
              '<div class="col-md-5 col-sm-12 col-xs-12">' +
              '<div class="product-image">';
    str +=  '<img src="'+element["location"]+'" alt="194x228" class="img-responsive">';
    if(element["tag"] == "SPECIAL"){
      str +=  '<span class="tag3 special">' +
              'SPECIAL'+
              '</span></div></div>';
    }
    else{
      if(element["tag"]==""){
        str += '</div></div>';
      }
      else{
        str +=  '<span class="tag2 '+element["tag"].toLowerCase()+'">' +
                element["tag"]+
                '</span></div></div>';
      }
    }
    str +=  '<div class="col-md-7 col-sm-12 col-xs-12">' +
            '<div class="product-deatil">' +
            '<h5 class="name">' +
            '<a href="#">' +
            element["name"] +
            '</a></h5>' +
            '<p class="price-container">' +
            '<span>'+
            element["price"]+
            '</span>'+
            '<span>  Rs.</span>'+
            '</p></div>'+
            '<div class="description">' +
            '<p>'+element["desc"]+'</p>'+
            '</div><div class="product-info smart-form"><div class="row"><div class="col-md-3">'+
            '<a href="#"  class="btn-floating buy btn-small waves-effect waves-light green"><i class="material-icons">add</i></a>'+
            '</div><div class="col-md-5">'+
            '<input type="number" value="0" />'+
            '</div>'+
            '<div class="col-md-2">'+
            '<a href="#" class="btn-floating btn-small unbuy waves-effect waves-light blue"><i class="material-icons">remove</i></a>'+
            '</div>'+
            '<div class="col-md-2">'+
            '<a href="#" class="btn-floating btn-small addToCart waves-effect waves-light orange"><i class="material-icons">add_shopping_cart</i></a>'+
            '</div>'+
            '</div></div></div></div>';
  $("#products_case").append(str);
});
}




document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
  });
});