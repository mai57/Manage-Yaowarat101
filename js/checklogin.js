var request = new XMLHttpRequest()
var data;
request.open('GET', 'https://yaowarat101.net/manageuser', true)
request.onload = function () {
    // Begin accessing JSON data here
    data = JSON.parse(this.response)
    // console.log(data);


}

request.send()


$(document).ready(function () {

    // process the form
    $('form').submit(function (event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'User_Email': $('input[name=email]').val(),
            'User_Password': $('input[name=password]').val(),
        };
        // console.log(formData);
        // console.log(data);
        var checkEmail = false;
        data.forEach(val => {
            if(val.User_Email == formData.User_Email && val.User_Password == formData.User_Password){
                checkEmail = true;
                window.location.href = '/dashboard.html';
            }else{
                console.log("No");
            }
          });
          if (checkEmail == false) {
            alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
          }
        

        event.preventDefault();
    });

});