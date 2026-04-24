import express from "express";
import { deleteUser, forgetPassword, getSingleUser, getUsers, loginUser, logout, profile, registerUser, resetPassword, updatePassword, updateProfile, updateUserRole } from "../controller/userController.js";
import { roleBasedAccess, verifyUser } from "../helper/userAuth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post('/register',upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.post('/password/forget', forgetPassword);
router.post('/reset/:token', resetPassword);
router.get('/profile', verifyUser, profile);
router.put('/password/update', verifyUser, updatePassword);
router.put('/profile/update', verifyUser,upload.single("avatar"), updateProfile);


router.route('/admin/user/:id')
.get(verifyUser,roleBasedAccess("admin"),getSingleUser)
.put(verifyUser,roleBasedAccess("admin"),updateUserRole)
.delete(verifyUser,roleBasedAccess("admin"),deleteUser);

router.get('/admin/users', verifyUser,roleBasedAccess("admin"),getUsers);

export default router;