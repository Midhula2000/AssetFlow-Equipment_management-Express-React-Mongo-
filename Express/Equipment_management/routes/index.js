var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var Equipment = require('../models/Equipment');
var BorrowTransaction = require('../models/BorrowTransaction');
var authMiddleware = require('../middlewares/authMiddleware');





//admin login api
router.post('/adminlogin_api', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

  
    User.findOne({ email, role: 'admin' })
        .then(user => {
            if (!user) return res.status(401).json({ message: 'Invalid email or password' });
            if (user.password !== password) return res.status(401).json({ message: 'Invalid email or password' });
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
            res.status(200).json({ message: 'Admin login successful', token});
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});
          
            






//for equipment create api
  router.post('/create_equipment_api', (req, res) => {
    const { equipmentName, category, 
availableQuantity
, serialNumber, status } = req.body;
    console.log(req.body);

    if(!equipmentName || !category || !
availableQuantity
 || !serialNumber) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    const new_equipment = new Equipment({
        equipmentName: equipmentName,
        category: category,
        availableQuantity: availableQuantity,
        serialNumber: serialNumber,
        status: status || 'Available'
    });

    // Save the equipment to the database using promises
    new_equipment.save()
        .then(() => {
            res.status(201).json({ message: 'Equipment created successfully' });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});



//list of all equipment

router.get('/list_equipment_api', (req, res) => {
    Equipment.find()
        .then(equipment => {
            res.status(200).json(equipment);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});


router.get('/get_equipment_api/:id', (req, res) => {
    const equipmentId = req.params.id;

    if (!equipmentId) {
        return res.status(400).json({ message: 'Equipment ID is required' });
    }

    Equipment.findById(equipmentId) 
        .then(equipment => {
            if (!equipment) {
                return res.status(404).json({ message: 'Equipment not found' });
            }
            res.status(200).json(equipment);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        });
});
// for updating products


router.put('/update_equipment_api/:id', (req, res) => {
    const equipmentId = req.params.id;
    const {
        equipmentName,
        name,
        category,
        availableQuantity,
        
        serialNumber,
        status
    } = req.body;

    const updateData = {
        equipmentName: equipmentName || name,
        category,
        availableQuantity: availableQuantity ,
        serialNumber,
        status
    };

    // Remove undefined fields so we don't overwrite existing values with undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    Equipment.findByIdAndUpdate(equipmentId, updateData, { new: true, runValidators: true })
        .then(updatedEquipment => {
            if (!updatedEquipment) {
                return res.status(404).json({ message: 'Equipment not found' });
            }
            res.status(200).json({ message: 'Equipment updated successfully', equipment: updatedEquipment });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});


// for deleting products

router.delete('/delete_equipment_api/:id', (req, res) => {
    const equipmentId = req.params.id;

    Equipment.findByIdAndDelete(equipmentId)
        .then(deletedEquipment => {
            if (!deletedEquipment) {
                return res.status(404).json({ message: 'Equipment not found' });
            }
            res.status(200).json({ message: 'Equipment deleted successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});






// router.get('/createAdmin', (req, res) => {
//   const newUser = new User({
//     email: 'admin@gmail.com',
//     password: '11223344',
//     role: 'admin',
//     name: 'Admin User',
//     phoneNumber: '1234567890',
//     department: 'Administration'
//   });

//   newUser.save()
//     .then(() => {
//       res.send('Admin created');
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     });
// });


router.get("/admin/transactions", authMiddleware, async (req, res) => {

    try {

        console.log("req.user =", req.user);

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const transactions = await BorrowTransaction
            .find()
            .populate("borrower", "name email department")
            .populate("equipment", "equipmentName category");

        return res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

//View Active Borrowings


router.get("/admin/transactions/active", authMiddleware, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const transactions = await BorrowTransaction
            .find({
                status: "Borrowed"
            })
            .populate("borrower", "name email department")
            .populate("equipment", "equipmentName category");

        return res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



//View Returned Items



router.get("/admin/transactions/returned", authMiddleware, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const transactions = await BorrowTransaction
            .find({
                status: "Returned"
            })
            .populate("borrower", "name email department")
            .populate("equipment", "equipmentName category");

        return res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});
router.get("/admin/dashboard", authMiddleware, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Total Equipment Records
        const totalEquipment =
            await Equipment.countDocuments();

        // Total Available Quantity
        const availableEquipmentResult =
            await Equipment.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$availableQuantity"
                        }
                    }
                }
            ]);

        const availableEquipment =
            availableEquipmentResult.length > 0
                ? availableEquipmentResult[0].total
                : 0;

        // Total Borrowers
        const totalBorrowers =
            await User.countDocuments({
                role: "user"
            });

        // Active Borrowings
        const activeBorrowings =
            await BorrowTransaction.countDocuments({
                status: "Borrowed"
            });

        // Returned Items
        const returnedItems =
            await BorrowTransaction.countDocuments({
                status: "Returned"
            });

        return res.status(200).json({
            success: true,
            data: {
                totalEquipment,
                availableEquipment,
                totalBorrowers,
                activeBorrowings,
                returnedItems
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});
//Count of currently borrowed equipment


//toggle availability to "Available", "Maintenance", "Retired"

router.put("/toggle_availability/:id", authMiddleware, async (req, res) => {

    try {
        const equipmentId = req.params.id;
        const { status } = req.body;

        if (!["Available", "Maintenance", "Retired"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const equipment = await Equipment.findById(equipmentId);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        equipment.status = status;
        await equipment.save();

        return res.status(200).json({
            success: true,
            message: "Equipment status updated successfully",
            data: equipment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

});



//active borrower

router.get("/admin/active-borrowers", authMiddleware, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const activeBorrowers = await BorrowTransaction
            .find({ status: "Borrowed" })
            .populate("borrower", "name email")
            .select("borrower");

        const uniqueBorrowers = [];

        const borrowerIds = new Set();

        activeBorrowers.forEach(transaction => {

            const borrower = transaction.borrower;

            if (
                borrower &&
                !borrowerIds.has(borrower._id.toString())
            ) {

                borrowerIds.add(
                    borrower._id.toString()
                );

                uniqueBorrowers.push(borrower);

            }

        });

        return res.status(200).json({
            success: true,
            count: uniqueBorrowers.length,
            data: uniqueBorrowers
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});



//particular user borrow transactions

router.get("/my-active-transactions/:id", authMiddleware, async (req, res) => {

    try {
userid = req.params.id;
      

        const transactions = await BorrowTransaction.find({ borrower: userid, status: "Borrowed" })
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
