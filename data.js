var fs = require("fs");
var _ = require("lodash");
var users_file = fs.readFileSync("users.json");
var users = JSON.parse(users_file);
var transactions_file = fs.readFileSync("transactions.json");
var transactions = JSON.parse(transactions_file);
var products_file = fs.readFileSync("products.json");
var products = JSON.parse(products_file);
var notification_file = fs.readFileSync("notifications.json");
var notifications = JSON.parse(notification_file);

// console.log(users);
function get_users() {
    users_file = fs.readFileSync("users.json");
    users = JSON.parse(users_file);
    return users;
}
function get_trans() {
    transactions_file = fs.readFileSync("transactions.json");
    transactions = JSON.parse(transactions_file);
    return transactions;
}
function get_noti() {
    notification_file = fs.readFileSync("notifications.json");
    notifications = JSON.parse(notification_file);
    return notifications;
}
function get_products() {
    products_file = fs.readFileSync("products.json");
    products = JSON.parse(products_file);
    return products;
}
function allNoti(notis) {
    fs.writeFileSync("notifications.json", JSON.stringify(notis, null, 2), () => { })
}
function saveNoti(noti) {
    notification_file = fs.readFileSync("notifications.json");
    notifications = JSON.parse(notification_file);
    notifications.push(noti);
    fs.writeFileSync("notifications.json", JSON.stringify(notifications, null, 2), () => { })
}
function saveTrans(tran) {
    transactions.push(tran);
    fs.writeFile("transactions.json", JSON.stringify(transactions, null, 2), () => { });
}
function allTrans(trans) {
    fs.writeFile("transactions.json", JSON.stringify(trans, null, 2), () => { })
}
function saveUser(user) {
    // let key =  user["username"];
    // delete user["username"];
    // users[key] = user;
    // console.log(users,user)
    users.push(user);
    fs.writeFile("users.json", JSON.stringify(users, null, 2), () => { });

    // console.log(users , user);
}
function changeUser(user, i) {
    let wr = _.cloneDeep(user)
    users[i] = wr;
    fs.writeFile("users.json", JSON.stringify(users, null, 2), () => { });

}
// console.log(module)
module.exports.getUsers = get_users;
module.exports.getProducts = get_products;
module.exports.getNoti = get_noti;
module.exports.save = saveUser;
module.exports.change = changeUser;
module.exports.savetrans = saveTrans;
module.exports.getTrans = get_trans;
module.exports.allTrans = allTrans;
module.exports.allNoti = allNoti;
module.exports.saveNoti = saveNoti;
// console.log(module)