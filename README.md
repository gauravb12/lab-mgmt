# Lab Management

This is an exemplary Store Management or Lab Management application, with UserSignup, UserLogin, CartFacility (/w and w/o login), ProductView etc. This has been developed with the following stack: 

- NodeJS (Backend)
- ExpressJS (Node Framework)
- MongoDB (Database)

## Development

To run this project locally, get `NodeJS` and `MongoDB` installed, then clone this repository and run following,

`git clone https://github.com/gauravb12/lab-mgmt.git` <br/>
`cd lab-mgmt` <br/>
`npm install` <br/>
`node app` <br/>

You can visit the application now, on your broweser at `http://localhost:3000`.

By now, there are no products in the store, as the database for products is not ready. To get products into the database, you need to add some tuples into the collection. To get those, proceed as in a terminal,

`$ mongo` <br/>
`$ use labmgmt` <br/>
`$ db.items.insert({pdtID: 'PDT001', pdtName: 'Product 1'})` <br/>
`$ db.items.insert({pdtID: 'PDT002', pdtName: 'Product 2'})` <br/>
`$ db.items.insert({pdtID: 'PDT003', pdtName: 'Product 3'})` <br/>
`$ db.items.insert({pdtID: 'PDT004', pdtName: 'Product 4'})` <br/>

**Note:** The above `mongo` commands have field names in certain pattern. Inserting some else pattern would cause errors.

The above, commands have inserted some sample products into the database. 
Once the above steps are over, you can revisit the application on `http://localhost:3000` to see the products populated in the `Store` tab.

## Screenshots

#### Home Page 
![Home Page](/screenshots/shot-1.png)

#### Store Page (with products added)
![Store Page](/screenshots/shot-2.png)

#### Cart Page (with Items added)
![Cart Page](/screenshots/shot-3.png)

#### SignUp Page
![SignUp Page](/screenshots/shot-4.png)

#### Profile Page showing account details
![Profile Page](/screenshots/shot-5.png)