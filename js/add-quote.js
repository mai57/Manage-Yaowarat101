var d = new Date();

var month = d.getMonth() + 1;
var day = d.getDate();

var output = (day < 10 ? '0' : '') + day + '/' +
    (month < 10 ? '0' : '') + month + '/' +
    d.getFullYear();

// console.log(output);

var user_anme = Cookies.get('user_name');
$("input[name=namestaff]").val(user_anme);
$("label[id=date]").text(output);

$(document).ready(function () {

    // process the form
    $('form').submit(function (event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'Quote_date': output,
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
            'Date_edit': output,
            'Name_edit': $('input[name=namestaff]').val(),
        };
        console.log(formData);

        postRequest('https://yaowarat101.net/managequote', formData)
            .then(data => {
                console.log(data);
                alert("บันทึกข้อมูล เสร็จสิ้น");
                window.location.reload();
            }) // Result from the `response.json()` call
            .catch(error => {
                console.error(error)
                alert("บันทึกข้อมูล ล้มเหลว !!! Error");
                window.location.reload();
            });

        function postRequest(url, data) {
            return fetch(url, {
                credentials: 'same-origin', // 'include', default: 'omit'
                method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
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
        // $( "input[name=allprice]" ).val( price *  amount );
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
        // $( "input[name=allprice]" ).val( price *  amount );
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
        // $( "input[name=allprice]" ).val( price *  amount );
    })
    .change();

$("button[id=print_quote]").click(function () {
    window.print();
});