const express = require('express');
const router = express.Router();
const { dataUser, dataRole } = require('../utils/data');

// GET tất cả users
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Lấy danh sách users thành công',
    data: dataUser
  });
});

// GET user theo username
router.get('/:username', (req, res) => {
  const user = dataUser.find(u => u.username === req.params.username);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User không tồn tại'
    });
  }

  res.json({
    success: true,
    message: 'Lấy user thành công',
    data: user
  });
});

// CREATE user mới
router.post('/', (req, res) => {
  const { username, password, email, fullName, roleId } = req.body;
  
  if (!username || !password || !email || !fullName || !roleId) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập đầy đủ thông tin user'
    });
  }

  if (dataUser.find(u => u.username === username)) {
    return res.status(400).json({
      success: false,
      message: 'Username đã tồn tại'
    });
  }

  const role = dataRole.find(r => r.id === roleId);
  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Role không tồn tại'
    });
  }

  const newUser = {
    username,
    password,
    email,
    fullName,
    avatarUrl: 'https://i.sstatic.net/l60Hf.png',
    status: true,
    loginCount: 0,
    role: {
      id: role.id,
      name: role.name,
      description: role.description
    },
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataUser.push(newUser);
  res.status(201).json({
    success: true,
    message: 'Tạo user thành công',
    data: newUser
  });
});

// UPDATE user
router.put('/:username', (req, res) => {
  const user = dataUser.find(u => u.username === req.params.username);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User không tồn tại'
    });
  }

  const { password, email, fullName, status, roleId } = req.body;
  
  if (password) user.password = password;
  if (email) user.email = email;
  if (fullName) user.fullName = fullName;
  if (status !== undefined) user.status = status;
  
  if (roleId) {
    const role = dataRole.find(r => r.id === roleId);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role không tồn tại'
      });
    }
    user.role = {
      id: role.id,
      name: role.name,
      description: role.description
    };
  }
  
  user.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Cập nhật user thành công',
    data: user
  });
});

// DELETE user
router.delete('/:username', (req, res) => {
  const index = dataUser.findIndex(u => u.username === req.params.username);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'User không tồn tại'
    });
  }

  const deletedUser = dataUser.splice(index, 1);
  res.json({
    success: true,
    message: 'Xóa user thành công',
    data: deletedUser[0]
  });
});

module.exports = router;
