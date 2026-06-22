var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var authMiddleware = require('../middlewares/authMiddleware');
var BorrowTransaction = require('../models/BorrowTransaction');
var Equipment = require('../models/Equipment');
//creating user api
router.post('/create_user_api', (req, res) => {
    const { name, email, phoneNumber, department, password, role } = req.body;
    
    if(!name || !email || !phoneNumber || !department || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = new User({
        name,
        email,
        phoneNumber,
        department,
        password: bcrypt.hashSync(password, 10),
        role: role || 'User'
    });

    newUser.save()
        .then(() => {
            res.status(201).json({ message: 'User created successfully' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});


//list of all users

router.get('/list_users_api', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});


//update user details 
router.put('/update_user_api/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, phoneNumber, department, password, role } = req.body;

    const updateData = { name, email, phoneNumber, department, role };
    if (password) updateData.password = bcrypt.hashSync(password, 10);

    User.findByIdAndUpdate(userId, updateData, { new: true })
    .then(updatedUser => {
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    });
}); 



//delete user
router.delete('/delete_user_api/:id', (req, res) => {
    const userId = req.params.id;

    User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});



//user login api
router.post('/userlogin_api', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    // find by email and compare hashed password
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(401).json({ message: 'Invalid email or password' });
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Server Error' });
                }
                if (!match) return res.status(401).json({ message: 'Invalid email or password' });
                // Generate a JWT token
                const token = jwt.sign(
{
    userId: user._id,
    role: user.role
},
process.env.JWT_SECRET,
{
    expiresIn: "1d"
}
);
                // Send the token in the response
                res.status(200).json({ message: 'Login successful', token });
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});

//equipmwnt listing

router.get("/equipments", async (req, res) => {

    const equipments = await Equipment.find();

    const modifiedEquipments = equipments.map(item => ({
        ...item.toObject(),
        availability:
            item.status === "Available"
                ? "Available"
                : "Unavailable"
    }));

    res.json({
        success: true,
        data: modifiedEquipments
    });

});


//borrow equipment api

router.post("/borrow", authMiddleware, async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            equipmentId,
            quantity,
            expectedReturnDate
        } = req.body;
console.log(req.body)
        if (!equipmentId || !quantity || !expectedReturnDate) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const equipment = await Equipment.findById(equipmentId);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        if (equipment.status !== "Available") {
            return res.status(400).json({
                success: false,
                message: "Equipment is not available"
            });
        }

        if (equipment.availableQuantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity exceeds available quantity"
            });
        }

        const transaction = await BorrowTransaction.create({
            borrower: userId,
            equipment: equipmentId,
            quantity,
            borrowDate: new Date(),
            expectedReturnDate,
            status: "Borrowed"
        });

        equipment.availableQuantity -= quantity;

        await equipment.save();

        return res.status(201).json({
            success: true,
            message: "Equipment borrowed successfully",
            data: transaction
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});





router.patch("/return/:transactionId", authMiddleware, async (req, res) => {

    try {

        const { transactionId } = req.params;

        const transaction = await BorrowTransaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transaction.status === "Returned") {
            return res.status(400).json({
                success: false,
                message: "Equipment already returned"
            });
        }

        const equipment = await Equipment.findById(transaction.equipment);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        equipment.availableQuantity += transaction.quantity;

        await equipment.save();

        transaction.status = "Returned";
        transaction.returnDate = new Date();

        await transaction.save();

        return res.status(200).json({
            success: true,
            message: "Equipment returned successfully",
            data: transaction
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


//list of user borrow transactions

router.get("/my-transactions", authMiddleware, async (req, res) => {

    try {

        const userId = req.user.id;

        const transactions = await BorrowTransaction.find({ borrower: userId })
            .populate("equipment", "equipmentName category serialNumber")
            .sort({ borrowDate: -1 });

        return res.status(200).json({
            success: true,
            message: "User transactions retrieved successfully",
            data: transactions
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


//user active borrow transactions

router.get("/my-active-transactions", authMiddleware, async (req, res) => {

    try {

        const userId = req.user.id;

        const transactions = await BorrowTransaction.find({ borrower: userId, status: "Borrowed" })
            .populate("equipment", "equipmentName category serialNumber")
            .sort({ borrowDate: -1 });

        return res.status(200).json({
            success: true,
            message: "User active transactions retrieved successfully",
            data: transactions
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});
module.exports = router;
