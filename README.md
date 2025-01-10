# One Shop - Shopping Website
**MERN STACK E-Commerce Website**

This web application allows users to buy products from a variety of stores. The stores will be displayed in an order based on the distance between the Customer's location and the Shop's location. Once a shop owner registers, their store will be added to the list and now the owner can manage their inventory(add, update or delete products).

## Features
### Customer
- **Stores Display**: Users can see the list of stores sorted according to their location.
- **Items Display**: Users can see the set of products of the selected store.
- **Cart**: Users can add items to their cart. Further in the cart section they can increase or decrease the quantity as well as remove the item.
- **Orders**: Users can check their orders and the status whether the orders were accepted or rejected.
- **Customized Options**: Users can move between stores with each store having a different cart

### Owner
- **Inventory**: Owners can check their inventory where they can update the price or quantity of products or even delete items/
- **Add Item**: Here owners can add a new item to their inventory.
- **Orders**: Owners can have a look at new pending orders. They can even go through accepted and rejected orders.
- **Updation of Items**: Based on the status of orders, the quantity of the products will be updated automatically.

## Technologies Used
1. Frontend: *React*                   
2. Backend: *Node.js*, *Express.js*           
3. API: *Open Street Map* (To convert location into latitude and longitude to easily calculate distance between two locations)
4. Database: *MongoDB*


## Prerequisites
- Node.js
- npm
- Javascript
- HTML & CSS
- MongoDB Shell
- MongoDB Compass(Optional)
  
## Installation

### Clone the repository:

``` bash
git clone https://github.com/yourusername/OneShop-local.git
cd OneShop-local
```

### Install dependencies:
``` bash
cd login
npm install
```

### Run the Server:
#### Backend:
**Note:** You must be in the src folder for this step (OneShop-local/login/src)
``` bash
cd login # Assuming you are in the root directory
cd src
node server.js
```

#### Frondend:
**Note:** You must be in the login folder for this step (OneShop-local/login)
``` bash
cd login # Assuming you are in the root directory
npm start
```
## Contributing
1. Fork the repository.
2. Create a new branch: git checkout -b feature/your-feature-name.
3. Make your changes and commit them: git commit -m 'Add some feature'.
4. Push to the branch: git push origin feature/your-feature-name.
5. Submit a pull request.
  
