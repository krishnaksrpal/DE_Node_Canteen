let transactions;
fetch("/trans").then(res => res.json()).then((data) => {
    console.log(data);
    transactions = data;
    updateTable(data);
})


let table = document.getElementById("table");
function updateTable(data) {
    let count = 0;
    str = "";
    let order;
    // transactions = data;
    data.forEach(trans => {
        str += '<tr><th scope="row"><input class="form-check-input" type="checkbox" id="checkbox1"><label class="form-check-label" for="checkbox1" class="label-table"></label></th>';
        str += '<td>' + trans["from"]["name"] + '</td>';
        str += '<td>' + trans["from"]["username"] + '</td>' + '<td>';
        order = trans["order"];
        let arr = [];
        for (const key in order) {
            arr.push(order[key]["quantity"] + " " + order[key]["itemName"]);
        }
        arrstr = arr.join(" + ");
        str += arrstr + "</td><td>" + trans["total"] + "</td>"
        if (trans["status"] == "Being Prepared") {
            str += '<td style="color: red;"><b>Being Prepared</b></td><td style="padding: 0%;"><button id="' + (count++) + '"class="btn-floating btn-small green"><i class="white-text small material-icons">check</i></button><button id="' + (count++) + '"class="btn-floating btn-small red"><i class="white-text small material-icons">close</i></button></td>'
        }
        else if (trans["status"] == "Food Prepared") {
            str += '<td style="color: orange;"><b>Food Prepared</b></td><td style="padding: 0%;"><button id="' + (count++) + '"class="btn-floating btn-small green"><i class="white-text small material-icons">check</i></button><button id="' + (count++) + '"class="btn-floating btn-small red"><i class="white-text small material-icons">close</i></button></td>'
        }
        else {
            str += '<td style="color: green;"><b>Food Delivered</b></td>';
            count += 2;
        }
    })
    table.innerHTML = str;


}
document.onclick = (ev) => {
    console.log(ev.target.offsetParent.id);

    if ((ev.target.offsetParent.id) % 2 == 0) {
        if (transactions[ev.target.offsetParent.id / 2]["status"] == "Being Prepared") {
            transactions[ev.target.offsetParent.id / 2]["status"] = "Food Prepared";
        }
        else if (transactions[ev.target.offsetParent.id / 2]["status"] == "Food Prepared") {
            transactions[ev.target.offsetParent.id / 2]["status"] = "Food Delivered";
        }
    }
    else {
        if (transactions[ev.target.offsetParent.id / 2]["status"] == "Food Prepared") {
            transactions[ev.target.offsetParent.id / 2]["status"] = "Being Prepared";
        }
    }
    updateTable(transactions);
    $.ajax({
        type: "post",
        url: "/trans/all",
        data: {trans:transactions},
        // dataType: "dataType",
        success: function (response) {
            console.log(response)
            console.log(transactions);
        }
    });
}