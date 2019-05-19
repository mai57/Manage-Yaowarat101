const express = require('express'); // Web Framework
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql'); // mySql Server client
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const https = require('https');
const request = require('request');
const cheerio = require('cheerio');



///////////////////// start config server mysql ////////////////////
const connConfig = {
    user: 'yaowarat101_root',
    password: 'Yaowarat101root*',
    host: 'mysql5-7.chaiyohosting.com',
    port: 3306,
    database: 'yaowarat101'
};

// const connConfig = {
// 	user: 'root',
// 	password: 'rootroot',
// 	host: 'localhost',
// 	database: 'yaowarat101'
// };

const connection = mysql.createConnection(connConfig);

const poolConnection = mysql.createPool(connConfig);



// connection.connect(function (err) {
// 	if (err) {
// 		console.log(err.code);
// 		console.log(err.fatal);
// 	}
// });

// Start server and listen on http://localhost:8081/
//https.createServer({
//	key: fs.readFileSync('server.key'),
//	cert: fs.readFileSync('server.cert')
//},app).listen(8081, function() {
//	console.log("app listening at port 8081")
//})




// var corsOptions = {
// 	// origin: 'http://192.168.1.198:4200',
// 	origin: ['http://192.168.1.198:4200','http://localhost:4200','https://www.yaowarat101.net'],
// 	optionsSuccessStatus: 200
// }



app.use(cors());
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {

    //     // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', '*');

    //     // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    //     // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    //     // Set to true if you need the website to include cookies in the requests sent
    //     // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    //     // Pass to next layer of middleware
    next();
});

var server = app.listen(app.get('port'), function () {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at port %s", port)
});






/////////////////////// end config server mysql ////////////////////

////////////////// start config directory file upload ////////////////
const dirProducts = './image/products';
var fileName = 'test';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dirProducts);
    },
    filename: (req, file, cb) => {
        cb(null, fileName + path.extname(file.originalname));
    }
})
let upload = multer({ storage: storage });

app.post('/upload', upload.single('photo'), function (req, res) {
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        return res.send({
            success: true
        })
    }

});




/////////////// upload orders
const dirOrders = './image/orders';
var fileNameOrder = '999999';
let storageOrder = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dirOrders);
    },
    filename: (req, file, cb) => {
        cb(null, fileNameOrder + path.extname(file.originalname));
    }
})
let uploadOrder = multer({ storage: storageOrder });
app.post('/uploadorder/:id', uploadOrder.single('photoorder'), function (req, res) {
    // console.log(req)
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });

    } else {
        console.log('file received');
        // console.log(req.file.mimetype);
        fs.createReadStream(dirOrders + "/" + req.file.filename).pipe(fs.createWriteStream(dirOrders + "/" + req.params.id + ".jpg"));
        return res.send({
            success: true
        })
    }

});
////////////////// end config directory file upload ////////////////



////////////////////// start api for product table //////////////////////


///////////////////////// get all product
app.get('/products', function (req, res) {
    $query = 'SELECT * from ywr_products';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    });


})

//Search by Name
// app.get('/products/search/:value', function (req, res) {
// 	$query = 'SELECT * from ywr_products WHERE p_Name LIKE "%' + req.params.value + '%" OR p_Id LIKE "%' + req.params.value + '%" OR p_Type LIKE "%' + req.params.value + '%"';
// 	// console.log($query)
// 	connection.query($query, function(err, rows, fields) {
// 		if(err){
//             console.log(err);
//             
//         }
//         res.end(JSON.stringify(rows));
//     });
// })


/////////////////////// get product by product id
app.get('/products/:p_Id', function (req, res) {
    $query = 'SELECT * from ywr_products WHERE p_Id = ' + req.params.p_Id;
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    });
})



/////////////////////// insert product
app.post('/products', function (req, res) {
    $p_Name = req.body.p_Name.toString();
    $p_Type = req.body.p_Type.toString();
    $p_PercentGold = req.body.p_PercentGold.toString();
    $p_Weight = req.body.p_Weight.toString();
    $p_Length = req.body.p_Length.toString();
    $p_Price = req.body.p_Price.toString();

    $query = 'INSERT INTO ywr_products (p_Type, p_Name, p_PercentGold, p_Weight, p_Length, p_Price) VALUES ("' + $p_Type + '","' + $p_Name + '","' + $p_PercentGold + '","' + $p_Weight + '","' + $p_Length + '","' + $p_Price + '")';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
        fileName = rows;
        fileName = fileName.insertId
    });
})


////////////////////// update product by product id
app.put('/products', function (req, res) {
    $p_Id = req.body.p_Id.toString();
    $p_Name = req.body.p_Name.toString();
    $p_Type = req.body.p_Type.toString();
    $p_PercentGold = req.body.p_PercentGold.toString();
    $p_Weight = req.body.p_Weight.toString();
    $p_Length = req.body.p_Length.toString();
    $p_Price = req.body.p_Price.toString();

    $query = 'UPDATE ywr_products SET p_Type = "' + $p_Type + '", p_Name = "' + $p_Name + '", p_PercentGold = "' + $p_PercentGold + '", p_Weight = "' + $p_Weight + '", p_Length = "' + $p_Length + '", p_Price = "' + $p_Price + '" WHERE p_Id = ' + $p_Id


    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})


/////////////////////// delete product by product id
app.post('/productsdelete/:p_Id', function (req, res) {
    $p_Id = req.params.p_Id.toString();
    $query = 'DELETE FROM ywr_products WHERE p_Id = ' + $p_Id


    // console.log($query)
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})

////////////////////// end api for product table //////////////////////



















////////////////////// start api for cart table //////////////////////


////////////////////// get product in cart by user id
app.get('/carts/:u_Id', function (req, res) {
    $query = 'SELECT * from ywr_cart WHERE u_Id = ' + req.params.u_Id;
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})


///////////////////// insert product in cart by user id
app.post('/carts/:u_Id', function (req, res) {
    $u_Id = req.params.u_Id;
    $p_Id = req.body.p_Id.toString();
    $p_Name = req.body.p_Name.toString();
    $p_Amount = req.body.p_Amount.toString();
    $p_Price = req.body.p_Price.toString();

    $query = 'INSERT INTO ywr_cart (u_Id, p_Id, p_Name, p_Amount, p_Price) VALUES ("' + $u_Id + '","' + $p_Id + '","' + $p_Name + '","' + $p_Amount + '","' + $p_Price + '")';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})




////////////////////// update product by user id and product id
app.put('/carts/:u_Id', function (req, res) {
    $u_Id = req.params.u_Id;
    $p_Id = req.body.p_Id.toString();
    $p_Amount = req.body.p_Amount.toString();

    $query = 'UPDATE ywr_cart SET p_Amount = "' + $p_Amount + '" WHERE u_Id = ' + $u_Id + ' AND p_Id = ' + $p_Id;


    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})


/////////////////////// delete product in cart by user id and product Id
app.get('/cartsdeleteall/:u_Id', function (req, res) {
    $p_Id = req.params.p_Id;
    $u_Id = req.params.u_Id;
    $query = 'DELETE FROM ywr_cart WHERE u_Id = ' + $u_Id;
    console.log($query)


    // console.log($query)
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json({ code: "successfully" })
    });
})




/////////////////////// delete product in cart by user id and product Id
app.get('/cartsdelete/:u_Id/:p_Id', function (req, res) {
    $p_Id = req.params.p_Id;
    $u_Id = req.params.u_Id;
    $query = 'DELETE FROM ywr_cart WHERE u_Id = ' + $u_Id + ' AND p_Id = ' + $p_Id;
    console.log($query)


    // console.log($query)
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json({ code: "successfully" })
    });
})

////////////////////// end api for cart table ///////////////////////









////////////////////// start api for user table /////////////////////


app.get('/user', function (req, res) {
    $query = 'SELECT * from ywr_user';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})


app.post('/user', function (req, res) {
    $u_Email = req.body.u_Email.toString();
    $u_Password = req.body.u_Password.toString();
    $u_Name = req.body.u_Name.toString();
    $u_Tel = req.body.u_Tel.toString();
    $u_Gender = req.body.u_Gender.toString();
    $u_Address = req.body.u_Address.toString();

    $query = 'INSERT INTO ywr_user (u_Email, u_Password, u_Name, u_Tel, u_Gender, u_Address) VALUES ("' + $u_Email + '","' + $u_Password + '","' + $u_Name + '","' + $u_Tel + '","' + $u_Gender + '","' + $u_Address + '")';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})


app.get('/user/email', function (req, res) {
    $query = 'SELECT u_Email,COUNT(u_Email),u_Role,u_Id,u_Name,u_Password,u_Point from ywr_user GROUP BY u_Email,u_Id,u_Role,u_Name,u_Password,u_Point';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})


app.get('/user/id/:id', function (req, res) {
    $query = 'SELECT * from ywr_user WHERE u_Id = ' + req.params.id;
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})


app.post('/useredit/id/:id', function (req, res) {
    $u_Name = req.body.u_Name;
    $u_Tel = req.body.u_Tel;
    $u_Address = req.body.u_Address;

    $query = 'UPDATE ywr_user SET u_Name="' + $u_Name + '", u_Tel="' + $u_Tel + '", u_Address="' + $u_Address + '" WHERE u_Id=' + req.params.id;
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})

app.post('/userupdatepoint/:id', function (req, res) {
    $u_Point = req.body.u_Point;


    $query = 'UPDATE ywr_user SET u_Point= u_Point + "' + $u_Point + '" WHERE u_Id=' + req.params.id;
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})

////////////////////// end api for user table /////////////////////

////////////////////// start api for get image /////////////////////
//
//app.use('/image/products/:picName', function (req, res) {
//	res.sendFile(path.join(__dirname, './image/products/' + req.params.picName));
//})
//
//app.use('/image/:picName', function (req, res) {
//	res.sendFile(path.join(__dirname, './image/' + req.params.picName));
//})
//
//
////////////////////// end api for get image /////////////////////




/////////////////////////////// end insert data order /////////////////////////////
// app.post('/checkout/', function (req, res) {
// 	var productlist;
// 	var userData;
// 	var orderId;
// 	var date = new Date().toLocaleString().slice(0, 19).replace('T', ' ');
// 	$query = 'SELECT * from ywr_user WHERE u_Id = ' + req.params.u_Id;

// 	connection.query($query, function (err, rows, fields) {
// 		if (err) {
// 			console.log(err);
// 			
// 		}
// 		userData = rows
// 		$queryforaddorder = 'INSERT INTO ywr_order (u_Id, u_Name, u_Address, u_Tel, o_Datetime, o_Status) VALUES ("' + userData[0].u_Id + '","' + userData[0].u_Name + '","' + userData[0].u_Address + '","' + userData[0].u_Tel + '","' + date + '","' + 'confirm checkout' + '")';
// 		connection.query($queryforaddorder, function (err, rows, fields) {
// 			if (err) console.log(err)
// 				orderId = rows.insertId
// 			$queryforproduct = 'SELECT * from ywr_cart WHERE u_Id = ' + req.params.u_Id;
// 			connection.query($queryforproduct, function (err, rows, fields) {
// 				if (err) {
// 					console.log(err);
// 					
// 				}
// 				productlist = rows

// 				for(i in productlist){

// 					$queryforaddorderproduct = 'INSERT INTO ywr_orderproduct (o_Id, p_Id) VALUES ("' + orderId +'","'+ productlist[i].p_Id + '")'
// 					connection.query($queryforaddorderproduct, function(err, rows, fields){
// 						if (err) {
// 							console.log(err);
// 							
// 						}
// 						res.end("succesfully")
// 					})
// 				}

// 			});

// 		});
// 	});
// })

/////////////////////////////// end insert data order /////////////////////////////



app.post('/checkout/', function (req, res) {
    var productlist;
    var userData;
    var orderId;
    var date = new Date().toLocaleString().slice(0, 19).replace('T', ' ');
    $query = '     INSERT INTO ywr_order (u_Id, u_Name, u_Address, u_Tel, o_Datetime, o_Status) VALUES                     ';

    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }

    });
})

/////////////////////////////// end insert data order /////////////////////////////



/////////////////////////////// get data order /////////////////////////////
app.get('/checkout/:u_Id', function (req, res) {
    var productlist;
    var userData;
    var orderId;
    var date = new Date().toLocaleString().slice(0, 19).replace('T', ' ');
    $query = 'SELECT * FROM ywr_order INNER JOIN ywr_orderproduct ON ywr_orderproduct.o_Id = ywr_order.o_Id INNER JOIN ywr_products ON ywr_products.p_Id = ywr_orderproduct.p_Id WHERE u_Id = ' + req.params.u_Id;
    // console.log($query)

    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})

app.get('/checkout/orders/:u_Id', function (req, res) {
    var productlist;
    var userData;
    var orderId;
    var date = new Date().toLocaleString().slice(0, 19).replace('T', ' ');
    $query = 'SELECT * FROM ywr_order WHERE u_Id = ' + req.params.u_Id;
    // console.log($query)

    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})

/////////////////////////////// get data order /////////////////////////////


/////////////////////////////// get data order /////////////////////////////
var o_Id;
app.post('/checkout/order/', function (req, res) {

    $u_Id = req.body.u_Id;
    $u_Name = req.body.u_Name;
    $u_Address = req.body.u_Address;
    $u_Tel = req.body.u_Tel;
    $o_Totalprice = req.body.o_Totalprice;
    var date = new Date().toLocaleString().slice(0, 19).replace('T', ' ');

    $query = 'INSERT INTO ywr_order (u_Id, u_Name, u_Address, u_Tel, o_Datetime, o_Status, o_Totalprice) VALUES ("' + $u_Id + '", "' + $u_Name + '", "' + $u_Address + '", "' + $u_Tel + '", "' + date + '", "รอการชำระเงิน", "' + $o_Totalprice + '")';
    // console.log(req.body)
    // console.log($query)


    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        o_Id = rows.insertId;
        res.json(rows)
    });
})

app.post('/checkout/orderproduct/', function (req, res) {
    // console.log(o_Id)
    req.body.forEach(data => {
        // console.log(data.c_Id)
        $query2 = 'INSERT INTO ywr_orderproduct (o_Id,p_Id,op_Amount) VALUES ("' + o_Id + '", "' + data.p_Id + '", "' + data.p_Amount + '")';

        poolConnection.query($query2, function (err, rows, fields) {
            if (err) {
                console.log(err);

            }
            res.json(rows);
        });
    });

    res.json({ code: "successfully" })

})




app.post('/orderupdate/:id', function (req, res) {

    $o_Status = req.body.status.toString();
    $o_Paymentmethod = req.body.method.toString();
    $o_Paymentdatetime = '' + req.body.date.toString() + ' ' + req.body.time.toString() + '';
    $o_Paymentamount = req.body.amount.toString();


    // $query = 'UPDATE ywr_order (u_Id, u_Name, u_Address, u_Tel, o_Datetime, o_Status) VALUES ("' + $u_Id + '", "' + $u_Name + '", "' + $u_Address + '", "' + $u_Tel + '", "' + date + '", "confirm checkout")';

    $query = 'UPDATE ywr_order SET o_Status="' + $o_Status + '", o_Paymentmethod="' + $o_Paymentmethod + '", o_Paymentdatetime="' + $o_Paymentdatetime + '", o_Paymentamount="' + $o_Paymentamount + '" WHERE o_Id = ' + req.params.id;

    // console.log($query)
    // console.log($query)

    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows)
    });
})



app.post('/orderupdatestatus/:id', function (req, res) {

    $o_Status = req.body.status.toString();


    // $query = 'UPDATE ywr_order (u_Id, u_Name, u_Address, u_Tel, o_Datetime, o_Status) VALUES ("' + $u_Id + '", "' + $u_Name + '", "' + $u_Address + '", "' + $u_Tel + '", "' + date + '", "confirm checkout")';

    $query = 'UPDATE ywr_order SET o_Status="' + $o_Status + '" WHERE o_Id = ' + req.params.id;

    // console.log($query)
    // console.log($query)

    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows)
    });
})





/////////////////////////////// get data order /////////////////////////////


// function handleDisconnect(connection) {
// 	connection.on('error', function(err) {
// 	  if (!err.fatal) {

// 	  }

// 	  if (err.code !== 'PROTOCOL_CONNECTION_LOST') {

// 	  }

// 	  console.log('Re-connecting lost connection: ' + err.stack);

// 	  connection = mysql.createConnection(connConfig);
// 	  handleDisconnect(connection);
// 	  connection.connect();
// 	});
//   }

//   handleDisconnect(connection);




app.get('/testapi', function (req, res) {
    res.json("web service api is running !");
})








app.get('/getgoldprice', function (req, res) {
    request('https://www.goldtraders.or.th/', (err, resp, body) => {
        if (!err && resp.statusCode === 200) {
            let $ = cheerio.load(body)
            let dataBuy = $('#DetailPlace_uc_goldprices1_lblBLBuy').text().trim();
            let dataSell = $('#DetailPlace_uc_goldprices1_lblBLSell').text().trim();

            res.json({ "dataBuy": dataBuy, "dataSell": dataSell });
        }
        else {
            res.json({ "dataBuy": "#####", "dataSell": "#####" });
        }

    })

})


////////////////////// start api for manage table /////////////////////


app.get('/manageuser', function (req, res) {
    $query = 'SELECT * from manage_user';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})

app.get('/manageuser/:User_Id', function (req, res) {
    $query = 'SELECT * from manage_user WHERE User_Id = ' + req.params.User_Id;
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    });
})

app.post('/manageuser', function (req, res) {
    $u_Email = req.body.User_Email.toString();
    $u_Password = req.body.User_Password.toString();
    $u_Name = req.body.User_Name.toString();
    $u_Tel = req.body.User_Tel.toString();
    $u_Gender = req.body.User_Gender.toString();
    $u_Address = req.body.User_Address.toString();

    $query = 'INSERT INTO manage_user (User_Email, User_Password, User_Name, User_Tel, User_Gender, User_Address) VALUES ("' + $u_Email + '","' + $u_Password + '","' + $u_Name + '","' + $u_Tel + '","' + $u_Gender + '","' + $u_Address + '")';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})

app.put('/manageuser', function (req, res) {
    $u_Id = req.body.User_Id.toString();
	$u_Email = req.body.User_Email.toString();
    $u_Password = req.body.User_Password.toString();
    $u_Name = req.body.User_Name.toString();
    $u_Tel = req.body.User_Tel.toString();
    $u_Gender = req.body.User_Gender.toString();
    $u_Address = req.body.User_Address.toString();
    $u_Role = req.body.User_Role.toString();
	
	

    $query = 'UPDATE manage_user SET User_Role = "' + $u_Role + '", User_Email = "' + $u_Email + '", User_Password = "' + $u_Password + '", User_Name = "' + $u_Name + '", User_Tel = "' + $u_Tel + '", User_Gender = "' + $u_Gender + '", User_Address = "' + $u_Address + '" WHERE User_Id = ' + $u_Id
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})

app.post('/deleteuser/:User_Id', function (req, res) {
    $u_Id = req.params.User_Id.toString();
    $query = 'DELETE FROM manage_user WHERE User_Id = ' + $u_Id


    // console.log($query)
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})



////////////////////// start api for price offer table /////////////////////
app.get('/managequote', function (req, res) {
    $query = 'SELECT * from manage_quote';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);

        }
        res.json(rows);
    });
})

app.post('/managequote', function (req, res) {
	$q_date = req.body.Quote_date.toString();
    $q_Name = req.body.Quote_staff.toString();
    $b_Name = req.body.Buyer_name.toString();
    $b_Tel = req.body.Buyer_tel.toString();
    $b_Email = req.body.Buyer_email.toString();
    $b_Address = req.body.Buyer_address.toString();
    $p_Type = req.body.Product_tpye.toString();
    $p_Percent = req.body.Product_percen.toString();
    $p_Weight = req.body.Product_weight.toString();
    $p_Length = req.body.Product_length.toString();
    $p_Name = req.body.Product_name.toString();
    $p_Price = req.body.Product_price.toString();
    $p_Amount = req.body.Product_amount.toString();
    $p_Deposit = req.body.Product_deposit.toString();
	$d_edit = req.body.Date_edit.toString();
    $n_edit = req.body.Name_edit.toString();
    // $all_Prices = req.body.all_Prices.toString();

    $query = 'INSERT INTO manage_quote (Quote_date, Quote_staff, Buyer_name, Buyer_tel, Buyer_email, Buyer_address, Product_tpye, Product_percen, Product_weight, Product_length, Product_name, Product_price, Product_amount, Product_deposit, Date_edit, Name_edit) VALUES ("' + $q_date + '","' + $q_Name + '","' + $b_Name + '","' + $b_Tel + '","' + $b_Email + '","' + $b_Address + '","' + $p_Type + '","' + $p_Percent + '","' + $p_Weight + '","' + $p_Length + '","' + $p_Name + '","' + $p_Price + '","' + $p_Amount + '","' + $p_Deposit + '","' + $d_edit + '","' + $n_edit + '")';
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})


app.get('/managequote/:Quote_id', function (req, res) {
    $query = 'SELECT * from manage_quote WHERE Quote_id = ' + req.params.Quote_id;
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err);
        }
        res.json(rows);
    });
})

app.put('/managequote', function (req, res) {
	$q_id = req.body.Quote_id.toString();
	$q_date = req.body.Quote_date.toString();
    $q_Name = req.body.Quote_staff.toString();
    $b_Name = req.body.Buyer_name.toString();
    $b_Tel = req.body.Buyer_tel.toString();
    $b_Email = req.body.Buyer_email.toString();
    $b_Address = req.body.Buyer_address.toString();
    $p_Type = req.body.Product_tpye.toString();
    $p_Percent = req.body.Product_percen.toString();
    $p_Weight = req.body.Product_weight.toString();
    $p_Length = req.body.Product_length.toString();
    $p_Name = req.body.Product_name.toString();
    $p_Price = req.body.Product_price.toString();
    $p_Amount = req.body.Product_amount.toString();
    $p_Deposit = req.body.Product_deposit.toString();
	$d_edit = req.body.Date_edit.toString();
    $n_edit = req.body.Name_edit.toString();
    // $all_Prices = req.body.all_Prices.toString();
	
	

    $query = 'UPDATE manage_quote SET Quote_date = "' + $q_date + '", Quote_staff = "' + $q_Name + '", Buyer_name = "' + $b_Name + '", Buyer_tel = "' + $b_Tel + '", Buyer_email = "' + $b_Email + '", Buyer_address = "' + $b_Address + '", Product_tpye = "' + $p_Type + '", Product_percen = "' + $p_Percent + '", Product_weight = "' + $p_Weight + '", Product_length = "' + $p_Length + '", Product_name = "' + $p_Name + '", Product_price = "' + $p_Price + '", Product_amount = "' + $p_Amount + '", Product_deposit = "' + $p_Deposit + '", Date_edit = "' + $d_edit + '", Name_edit = "' + $n_edit + '" WHERE Quote_id = ' + $q_id
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})



/////////////////////// delete Quote by Quote id
app.post('/deletequote/:Quote_id', function (req, res) {
    $q_Id = req.params.Quote_id.toString();
    $query = 'DELETE FROM manage_quote WHERE Quote_id = ' + $q_Id


    // console.log($query)
    poolConnection.query($query, function (err, rows, fields) {
        if (err) {
            console.log(err)

        }
        res.json(rows);
    });
})