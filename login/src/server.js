const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'openstreetmap',
    fetch: (url) => fetch(url)
};

const geocoder = NodeGeocoder(options);
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

const url = 'mongodb://localhost:27017/';

const dbName = 'Customers';
const dbName2 = 'stores';
const dbName3 = 'storeDatabase';
const dbName4 = 'orders';


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

client.connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/signup', (req, res) => {
    res.send('Hello World!');

});
app.post('/signup', async (req, res) => {
    const { name, phone, email, password, location } = req.body;
    try {
        console.log(location);
        const geoResponse = await geocoder.geocode(location);
        const { latitude, longitude } = geoResponse[0];
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('ids');
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            phone,
            email,
            password: hashedPassword,
            location,
            coordinates: {
                latitude,
                longitude
            }
        };

        await collection.insertOne(newUser);

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('ids');
        const user = await collection.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: "No such customer exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Login successful", user: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/osignup', (req, res) => {
});
app.post('/osignup', async (req, res) => {
    const { name, phone, shop, email, password, collect, back_img, location } = req.body;

    try {
        const geoResponse = await geocoder.geocode(location);
        const { latitude, longitude } = geoResponse[0];
        await client.connect();
        const db2 = client.db(dbName2);
        const collection = db2.collection('st');
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            phone,
            shop,
            email,
            password: hashedPassword,
            collect,
            back_img,
            location,
            coordinates: {
                latitude,
                longitude
            }
        };
        // await client.connect();
        const db3 = client.db(dbName3);
        await collection.insertOne(newUser);

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
        // await client.close();
    }
});

app.post('/ologin', async (req, res) => {
    const { name, password } = req.body;

    try {
        await client.connect();
        const db2 = client.db(dbName2);
        const collection = db2.collection('st');
        const user = await collection.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: "No such customer exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.json({ message: "Login successful", user: user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

app.get('/stores', async (req, res) => {
    try {
        await client.connect();
        const db2 = client.db(dbName2);
        const collection = db2.collection('st');
        const stores = await collection.find({}).toArray();
        res.json({ store: stores });
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    } finally {
        await client.close();
    }
});

app.get('/items', async (req, res) => {
    try {
        const collect = req.query.collect;
        await client.connect();
        const db3 = client.db(dbName3);
        const collection = db3.collection(collect);
        const items = await collection.find({}).toArray();
        res.json({ item: items });
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    } finally {
        await client.close();
    }
});

app.post('/addItems', async (req, res) => {
    const collect = req.query.collect;
    const newItem = {
        name: req.body.name,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity),
        description: req.body.description,
        image: req.body.image,
    };

    try {
        await client.connect();
        const db3 = client.db(dbName3);
        const collection = db3.collection(collect);
        await collection.insertOne(newItem);
        res.json({ message: "Added" });
    } catch (err) {
        console.error("Error inserting item:", err);
        res.json({ message: err });
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});


app.delete('/delItem', async (req, res) => {
    const collect = req.query.collect;
    const name = req.query.itemId;
    try {
        await client.connect();
        const db3 = client.db(dbName3);
        const collection = db3.collection(collect);
        await collection.deleteOne({ 'name': name });
        console.log(name);
        console.log("deleted");
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error("Error deleting item:", err);
        res.json({ message: err });
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

app.put('/update', async (req, res) => {
    const collect = req.query.collect;
    const itemId = req.query.itemId;
    const updatedData = req.body;

    try {
        await client.connect();
        const db3 = client.db(dbName3);
        const collection = db3.collection(collect);

        const result = await collection.updateOne(
            { 'name': itemId },
            { $set: updatedData }
        );

        if (result.modifiedCount === 1) {
            console.log(`Updated the item: ${itemId}`);
            res.json({ message: "Updated" });
        } else {
            console.log(`No item found with the id: ${itemId}`);
            res.json({ message: "No item found" });
        }
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: "Error updating item" });
    }
});

app.post('/orders', async (req, res) => {
    const collect = req.query.collect;
    const order = req.body;

    try {
        await client.connect();
        const db4 = client.db(dbName4);
        console.log(order);
        const collection = db4.collection(collect);
        await collection.insertOne(order);
        // await client.connect();
        const db3 = client.db(dbName3);
        const collection2 = db3.collection(collect);
        const orderCart = order.cart;

        // Update the quantity of items in the database
        for (const itemName in orderCart) {
            const item = orderCart[itemName];
            const quantity = parseInt(item.quantity);
            await collection2.updateOne(
                { 'name': itemName },
                { $inc: { 'quantity': -quantity } }
            );
        }

        res.json({ message: "Added" });
    } catch (err) {
        console.error("Error inserting order:", err);
        res.status(500).json({ message: err.message });
    } finally {
        await client.close();
        // await client.close();
    }
});

app.get('/forders', async (req, res) => {
    const collect = req.query.collect;

    try {
        await client.connect();
        const db4 = client.db(dbName4);
        const collection = db4.collection(collect);
        const items = await collection.find({}).toArray();
        res.json({ item: items });
    } catch (err) {
        console.error("Error inserting order:", err);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

app.get('/corders', async (req, res) => {
    const email = req.query.customer;
    try {
        await client.connect();
        const db4 = client.db(dbName4);
        const collections = await db4.listCollections().toArray();
        // const email=JSON.parse(customer);
        console.log(email);
        const items = [];

        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name;
            const collection = db4.collection(collectionName);
            const itemsFromCollection = await collection.find({ "user.email": email }).toArray();
            items.push(...itemsFromCollection);
        }
        console.log("From");
        // console.log(collections);
        res.json({ item: items });
    } catch (err) {
        console.error("Error retrieving orders:", err);
        res.status(500).send('Server Error');
    } finally {
        await client.close();
    }
});

app.put('/updateOr', async (req, res) => {
    const collect = req.query.collect; // Assuming collect is the collection name
    const itemId = req.query.itemId;
    const updatedData = req.body;

    try {
        await client.connect();
        const db4 = client.db(dbName4);
        const collection = db4.collection(collect);
        // await client.connect();
        const db3 = client.db(dbName3);
        const collection2 = db3.collection(collect);
        console.log(itemId);
        const result = await collection.updateOne(
            { '_id': new ObjectId(itemId) }, // Assuming you're using MongoDB ObjectId
            { $set: updatedData }
        );



        if (result.modifiedCount === 1) {
            if (updatedData.status === 'rejected') {
                // Get the order details
                const order = await collection.findOne({ '_id': new ObjectId(itemId) });
                const orderCart = order.cart;

                // Update the quantity of items in the database
                for (const itemName in orderCart) {
                    const item = orderCart[itemName];
                    await collection2.updateOne(
                        { 'name': itemName },
                        { $inc: { 'quantity': +item.quantity } }
                    );
                }
            }
            console.log(`Updated the item: ${itemId}`);
            res.json({ message: "Updated" });
        } else {
            console.log(`No item found with the id: ${itemId}`);
            res.json({ message: "No item found" });
        }
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ message: "Error updating item" });
    } finally {
        await client.close();
        // await client.close();
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
