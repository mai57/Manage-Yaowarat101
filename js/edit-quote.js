
var datahash = window.location.hash.substr(1);

// console.log(datahash);


var request = new XMLHttpRequest();
request.open('GET', 'https://yaowarat101.net/managequote/' + datahash, true);

// request.open('GET', 'https://yaowarat101.net/managequote', true);


request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    // console.log(data[0]);
    // console.log(data[0].Quote_staff);
    $("h4[id=idquote]").text(data[0].Quote_id);
    $("label[id=date]").text(data[0].Quote_date);
    $('input[name=namestaff]').val(data[0].Quote_staff);
    $('input[name=namebuyer]').val(data[0].Buyer_name);
    $('input[name=telbuyer]').val(data[0].Buyer_tel);
    $('input[name=emailbuyer]').val(data[0].Buyer_email);
    $('textarea[name=addressbuyer]').val(data[0].Buyer_address);
    $('select[name=tpyeproduct]').val(data[0].Product_tpye);
    $('input[name=percengold]').val(data[0].Product_percen);
    $('input[name=weightproduct]').val(data[0].Product_weight);
    $('input[name=lengthproduct]').val(data[0].Product_length);
    $('input[name=nameproduct]').val(data[0].Product_name);
    $('input[name=priceproduct]').val(data[0].Product_price);
    $('input[name=amountproduct]').val(data[0].Product_amount);
    $('input[name=depositproduct]').val(data[0].Product_deposit);
    $("input[name=residual]").val((data[0].Product_price * data[0].Product_amount) - data[0].Product_deposit);
    $("input[name=allprice]").val(data[0].Product_price * data[0].Product_amount);
}

request.send();

$("input[name=priceproduct]")
    .change(function () {
        var price = $('input[name=priceproduct]').val();
        var amount = $('input[name=amountproduct]').val();
        var deposit = $('input[name=depositproduct]').val();
        // $( "select option:selected" ).each(function() {
        //   str += $( this ).text() + " ";
        // });
        $("input[name=residual]").val((price * amount) - deposit);
        $("input[name=allprice]").val(price * amount);

    })
    .change();

$("input[name=amountproduct]")
    .change(function () {
        var price = $('input[name=priceproduct]').val();
        var amount = $('input[name=amountproduct]').val();
        var deposit = $('input[name=depositproduct]').val();

        // $( "select option:selected" ).each(function() {
        //   str += $( this ).text() + " ";
        // });
        $("input[name=residual]").val((price * amount) - deposit);
        $("input[name=allprice]").val(price * amount);

    })
    .change();

$("input[name=depositproduct]")
    .change(function () {
        var price = $('input[name=priceproduct]').val();
        var amount = $('input[name=amountproduct]').val();
        var deposit = $('input[name=depositproduct]').val();
        // $( "select option:selected" ).each(function() {
        //   str += $( this ).text() + " ";
        // });
        // console.log((price *  amount) -  deposit);
        $("input[name=residual]").val((price * amount) - deposit);
        $("input[name=allprice]").val(price * amount);

    })
    .change();


$(document).ready(function () {

    // process the form
    $('form').submit(function (event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'Quote_id': $("h4[id=idquote]").text(),
            'Quote_date': $("label[id=date]").text(),
            'Quote_staff': $('input[name=namestaff]').val(),
            'Buyer_name': $('input[name=namebuyer]').val(),
            'Buyer_tel': $('input[name=telbuyer]').val(),
            'Buyer_email': $('input[name=emailbuyer]').val(),
            'Buyer_address': $('textarea[name=addressbuyer]').val(),
            'Product_tpye': $('select[name=tpyeproduct]').val(),
            'Product_percen': $('input[name=percengold]').val(),
            'Product_weight': $('input[name=weightproduct]').val(),
            'Product_length': $('input[name=lengthproduct]').val(),
            'Product_name': $('input[name=nameproduct]').val(),
            'Product_price': $('input[name=priceproduct]').val(),
            'Product_amount': $('input[name=amountproduct]').val(),
            'Product_deposit': $('input[name=depositproduct]').val(),
        };
        // console.log(formData);

        postRequest('https://yaowarat101.net/managequote', formData)
            .then(data => {
                // console.log(data);
                alert("บันทึกข้อมูล เสร็จสิ้น");
                window.location.assign("/customer.html");
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

$("button[id=delete_quote]").click(function () {
    var deletedata = $("h4[id=idquote]").text();

    
    var deletequote = new XMLHttpRequest();
    deletequote.open('POST', 'https://yaowarat101.net/deletequote/' + deletedata, true);
    deletequote.send();
    window.location.assign("/customer.html");
});

$("button[id=cancel_user]").click(function () {
    window.history.back();
});

$("button[id=print_quote]").click(function () {
    window.print();
});