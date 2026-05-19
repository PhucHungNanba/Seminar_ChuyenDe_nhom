const User = require('../models/User');

// GET /api/users - Lấy danh sách toàn bộ user (với query search và role)
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    let filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { email: searchRegex },
        { phone: searchRegex },
        { fullName: searchRegex }
      ];
    }

    // Phải dùng .select('-password') để loại bỏ chuỗi hash password khỏi response
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    console.error('Get All Users Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error', code: 500 });
  }
};

// PUT /api/users/:id - Cập nhật thông tin user (fullName, phone, role)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, role } = req.body;

    // Validate role nếu có truyền lên
    if (role && !['Admin', 'Pharmacist', 'Customer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Vai trò không hợp lệ', code: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, phone, role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng', code: 404 });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin người dùng thành công',
      user: updatedUser
    });
  } catch (err) {
    console.error('Update User Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error', code: 500 });
  }
};

// DELETE /api/users/:id - Xóa tài khoản user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng', code: 404 });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa tài khoản người dùng thành công'
    });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error', code: 500 });
  }
};
