"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/', userController_1.getUsers);
router.post('/', userController_1.createUser);
router.put('/:id', userController_1.updateUser);
router.put('/byuser/:id', userController_1.updateByUser);
router.delete('/:id', userController_1.deleteUser);
// login
router.post('/login', userController_1.loginUser);
router.post('/checkuser', userController_1.checkUser);
exports.default = router;
