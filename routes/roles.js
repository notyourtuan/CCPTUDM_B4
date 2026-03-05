const express = require('express');
const router = express.Router();
const { dataRole, dataUser } = require('../utils/data');

// GET tất cả roles
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Lấy danh sách roles thành công',
    data: dataRole
  });
});

// GET role theo ID
router.get('/:id', (req, res) => {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role không tồn tại'
    });
  }
  res.json({
    success: true,
    message: 'Lấy role thành công',
    data: role
  });
});

// GET tất cả users trong một role
router.get('/:id/users', (req, res) => {
  const role = dataRole.find(r => r.id === req.params.id);
  
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role không tồn tại'
    });
  }

  const users = dataUser.filter(u => u.role.id === req.params.id);

  res.json({
    success: true,
    message: `Lấy danh sách users trong role '${role.name}' thành công`,
    data: {
      role,
      userCount: users.length,
      users
    }
  });
});

// CREATE role mới
router.post('/', (req, res) => {
  const { name, description } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập tên và mô tả role'
    });
  }

  const newRole = {
    id: 'r' + (dataRole.length + 1),
    name,
    description,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataRole.push(newRole);
  res.status(201).json({
    success: true,
    message: 'Tạo role thành công',
    data: newRole
  });
});

// UPDATE role
router.put('/:id', (req, res) => {
  const role = dataRole.find(r => r.id === req.params.id);
  
  if (!role) {
    return res.status(404).json({
      success: false,
      message: 'Role không tồn tại'
    });
  }

  const { name, description } = req.body;
  
  if (name) role.name = name;
  if (description) role.description = description;
  role.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Cập nhật role thành công',
    data: role
  });
});

// DELETE role
router.delete('/:id', (req, res) => {
  const index = dataRole.findIndex(r => r.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Role không tồn tại'
    });
  }

  const deletedRole = dataRole.splice(index, 1);
  res.json({
    success: true,
    message: 'Xóa role thành công',
    data: deletedRole[0]
  });
});

module.exports = router;
