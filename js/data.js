var request = new XMLHttpRequest();
var requestStaff = new XMLHttpRequest();


request.open('GET', 'https://yaowarat101.net/managequote', true);
requestStaff.open('GET', 'https://yaowarat101.net/manageuser', true);

request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    // console.log(data);


    $(document).ready(function () {
        var table = $('#tablequote').DataTable({
            data: data,
            fixedHeader: true,
            responsive: true,
            
            columns: [
                
                { data: "Quote_id",width: "5%"  },
                { data: "Quote_date",width: "15%"  },
                { data: "Quote_staff",width: "15%"   },
                { data: "Buyer_name",width: "15%"  },
                { data: "Product_tpye",width: "15%"  }, 
                { data: "Product_name",width: "15%"  },
                {
                    data: null,
                    className: "dt-center",
                    mRender:  function (data, type, row) {
                        return '<a class="btn btn-secondary btn-sm" href="/editquote.html#' + data.Quote_id + '" style="margin: 2px; width: 100px;" >EDIT <i class="fas fa-pencil-alt"></i></a>' + '<a class="btn btn-light-green btn-sm" href="/viewquote.html#' + data.Quote_id + '" style="margin: 2px; width: 100px;">ViEW <i class="fas fa-eye"></i></a>'
                    },width: "20%" 
                },
            ],

        });

    });


}

requestStaff.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    // console.log(data);


    $(document).ready(function () {
        $('#tableStaff').DataTable({
            data: data,
            fixedHeader: true,
            responsive: true,
            columns: [
                { data: "User_Id",width: "5%" },
                { data: "User_Name" },
                { data: "User_Email" },
                { data: "User_Tel." },
                { data: "User_Gender" },
                {
                    data: null,
                    className: "dt-center",
                    mRender:  function (data, type, row) {
                        return '<a class="btn btn-secondary btn-sm" href="/edituser.html#' + data.User_Id + '" style="margin: 2px; width: 100px;" >EDIT <i class="fas fa-pencil-alt"></i></a>' + '<a class="btn btn-light-green btn-sm" href="/viewuser.html#' + data.User_Id + '" style="margin: 2px; width: 100px;">ViEW <i class="fas fa-eye"></i></a>'
                    },width: "20%" 
                },
            ]
        });
    });

}

requestStaff.send();
request.send();




