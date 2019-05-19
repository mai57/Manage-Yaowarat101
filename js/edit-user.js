
var datahash = window.location.hash.substr(1);

// console.log(datahash);


var request = new XMLHttpRequest();
request.open('GET', 'https://yaowarat101.net/manageuser/' + datahash, true);

// request.open('GET', 'https://yaowarat101.net/managequote', true);


request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    // console.log(data[0]);
    // console.log(data[0].Quote_staff);
    $("h4[id=iduser]").text(data[0].User_Id);
    $('input[name=name]').val(data[0].User_Name);
    $('input[name=password]').val(data[0].User_Password);
    $('input[name=tel]').val(data[0].User_Tel);
    $('input[name=email]').val(data[0].User_Email);
    $('textarea[name=address]').val(data[0].User_Address);
    $('select[name=gender]').val(data[0].User_Gender);
    $('select[name=setstatus]').val(data[0].User_Role);
}

request.send();





$(document).ready(function () {

    // process the form
    $('form').submit(function (event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'User_Id': $("h4[id=iduser]").text(),
            'User_Email': $('input[name=email]').val(),
            'User_Password': $('input[name=password]').val(),
            'User_Name': $('input[name=name]').val(),
            'User_Tel': $('input[name=tel]').val(),
            'User_Gender': $('select[name=gender]').val(),
            'User_Address': $('textarea[name=address]').val(),
            'User_Role': $('select[name=setstatus]').val(),
            // 'Product_tpye': $('select[name=tpyeproduct]').val(),
            // 'Product_percen': $('input[name=percengold]').val(),
            // 'Product_weight': $('input[name=weightproduct]').val(),
            // 'Product_length': $('input[name=lengthproduct]').val(),
            // 'Product_name': $('input[name=nameproduct]').val(),
            // 'Product_price': $('input[name=priceproduct]').val(),
            // 'Product_amount': $('input[name=amountproduct]').val(),
            // 'Product_deposit': $('input[name=depositproduct]').val(),
        };
        console.log(formData);

        postRequest('https://yaowarat101.net/manageuser', formData)
            .then(data => {
                // console.log(data);
                alert("บันทึกข้อมูล เสร็จสิ้น");
                window.location.assign("/manage.html");
            }) // Result from the `response.json()` call
            .catch(error => {
                console.error(error)
                alert("บันทึกข้อมูล ล้มเหลว !!! Error");
                window.location.reload();
            });

        function postRequest(url, data) {
            return fetch(url, {
                credentials: 'same-origin', // 'include', default: 'omit'
                method: 'PUT', // 'GET', 'PUT', 'DELETE', etc.
                body: JSON.stringify(data), // Coordinate the body type with 'Content-Type'
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
            })
                .then(response => response.json())
        }

        event.preventDefault();
    });

});

$("button[id=delete_user]").click(function () {
    var deletedata = $("h4[id=iduser]").text();
    // console.log(deletedata);
    
    var deletequote = new XMLHttpRequest();
    deletequote.open('POST', 'https://yaowarat101.net/deleteuser/' + deletedata, true);
    deletequote.send();
    window.location.assign("/manage.html");
});

$("button[id=back_user]").click(function () {
    window.history.back();
});

$("button[id=print_user]").click(function () {
    window.print();
});