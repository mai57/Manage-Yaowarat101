$(document).ready(function () {

    // process the form
    $('form').submit(function (event) {

        // get the form data
        // there are many ways to get this data using jQuery (you can use the class or id also)
        var formData = {
            'User_Email': $('input[name=email]').val(),
            'User_Password': $('input[name=password]').val(),
            'User_Name': $('input[name=name]').val(),
            'User_Tel': $('input[name=tel]').val(),
            'User_Gender': $('select[name=gender]').val(),
            'User_Address': $('textarea[name=address]').val(),
        };
        console.log(formData);
        
        postRequest('https://yaowarat101.net/manageuser', formData)
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