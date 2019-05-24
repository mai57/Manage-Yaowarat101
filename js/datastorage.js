// console.log(Cookies.get('user_id'));
var user_id = Cookies.get('user_id');

if (user_id == null || undefined) {
    alert("โปรดเข้าสู่ระบบเพื่อจะดำเนินการต่อ / Please login to continue")
    window.location.href = '/';
}

var requeststatus = new XMLHttpRequest();
requeststatus.open('GET', 'https://yaowarat101.net/manageuser/' + user_id, true);

// request.open('GET', 'https://yaowarat101.net/managequote', true);


requeststatus.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    // console.log(data[0])
    if (data[0].User_Role == "admin") {
        $("li[id=user_role], a[id=user_role], div[id=user_role]").removeClass("dp-none");
    }

}

requeststatus.send();

$(document).ready(function () {
    $("a[id=logout]").click(function () {
        Cookies.remove('user_id');
        Cookies.remove('user_name');
        // localStorage.removeItem("user_id");
        // localStorage.removeItem("user_name");
        window.location.href = '/';
    });
});