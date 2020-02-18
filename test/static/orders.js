let transactions;
function fetchtrans() {
    if (user["is_admin"]) {
        fetch("/trans").then(res => res.json()).then((data) => {
            console.log(data);
            transactions = data;
            updateTable(data);
        })
    }
    else {
        fetch("/trans/" + user["username"]).then(res => res.json()).then((data) => {
            console.log(data);
            transactions = data;
            updateTable(data);
        })
    }
}
fetchtrans();
setInterval(fetchtrans, 1000);
let table = document.getElementById("table");
function updateTable(data) {
    let count = 0;
    str = "";
    let order;
    for (let i = data.length - 1; i >= 0; i--) {
        const trans = data[i];
        str += '<tr><th scope="row"><input class="form-check-input" type="checkbox" id="checkbox1"><label class="form-check-label" for="checkbox1" class="label-table"></label></th>';
        str += '<td> #ID' + trans["id"] + '</td>';
        str += '<td>' + trans["from"]["name"] + '</td>';
        str += '<td>' + trans["from"]["username"] + '</td>' + '<td>';
        order = trans["order"];
        let arr = [];
        for (const key in order) {
            arr.push(order[key]["quantity"] + " " + order[key]["itemName"]);
        }
        arrstr = arr.join(" + ");
        str += arrstr + "</td><td>" + trans["total"] + "</td>"
        if (user["is_admin"]) {
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
        } else {
            if (trans["status"] == "Being Prepared") {
                count++;
                str += '<td style="color: red;"><b>Being Prepared</b></td><td style="padding: 0%;"><button id="' + (count++) + '"class="btn-floating btn-small red"><i class="white-text small material-icons">close</i></button></td>'
            }
            else if (trans["status"] == "Food Prepared") {
                str += '<td style="color: orange;"><b>Food Prepared</b>'
                count += 2;
            }
            else {
                str += '<td style="color: green;"><b>Food Delivered</b></td>';
                count += 2;
            }
        }
    }
    table.innerHTML = str;


}
document.onclick = (ev) => {
    console.log(ev.target.offsetParent.id);

    if ((ev.target.offsetParent.id) % 2 == 0 && user["is_admin"]) {
        if (transactions[transactions.length - 1 - (ev.target.offsetParent.id / 2)]["status"] == "Being Prepared") {
            transactions[transactions.length - 1 - (ev.target.offsetParent.id / 2)]["status"] = "Food Prepared";
            createNoti({
                "from": "admin",
                "to": transactions[transactions.length - 1 - (ev.target.offsetParent.id / 2)]["from"]["username"],
                "msg": "Food Prepared"
            });
        }
        else if (transactions[transactions.length - 1 - (ev.target.offsetParent.id / 2)]["status"] == "Food Prepared") {
            transactions[transactions.length - 1 - (ev.target.offsetParent.id / 2)]["status"] = "Food Delivered";
            createNoti({
                "from": "admin",
                "to": transactions[transactions.length - 1 - (ev.target.offsetParent.id / 2)]["from"]["username"],
                "msg": "Food Delivered"
            });
        }
    }
    else if ((ev.target.offsetParent.id) % 2 == 1) {
        console.log(transactions[transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2)])
        if (transactions[transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2)]["status"] == "Food Prepared" && user["is_admin"]) {
            transactions[transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2)]["status"] = "Being Prepared";
            createNoti({
                "from": "admin",
                "to": transactions[transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2)]["from"]["username"],
                "msg": "Sorry,Being Prepared"
            });
        }
        else if (transactions[transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2)]["status"] == "Being Prepared") {
            transactions.splice(transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2), 1);
            if (user["is_admin"]) {
                createNoti({
                    "from": "admin",
                    "to": transactions[transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2)]["from"]["username"],
                    "msg": "Sorry,Products Unavailable"
                });
            } else {
                createNoti({
                    "from": transactions[transactions.length - 1 - ((ev.target.offsetParent.id - 1) / 2)]["from"]["username"],
                    "to": "admin",
                    "msg": "Sorry,Order Deleted"
                });
            }
        }
    }
    updateTable(transactions);
    if (user["is_admin"]) {
        $.ajax({
            type: "post",
            url: "/trans/all",
            data: { trans: transactions },
            // dataType: "dataType",
            success: function (response) {
                console.log(response)
                console.log(transactions);
            }
        });
    }
    else {
        $.ajax({
            type: "post",
            url: "/trans/all/" + user["username"],
            data: { trans: transactions },
            // dataType: "dataType",
            success: function (response) {
                console.log(response)
                console.log(transactions);
            }
        });
    }
}