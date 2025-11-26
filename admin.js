// admin.js - نظام إدارة المستخدمين (مُحسّن)

class UserManagement {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('platformUsers')) || [];
  }

  // إنشاء معرف فريد
  generateUserId(governorate, userType, studentId) {
    const cityCode = '249'; // عين شمس
    const schoolCode = '23'; // نهضة عين شمس
    // تطهير القيم وإجبارهم كـ string
    return String(governorate) + String(cityCode) + String(userType) + String(schoolCode) + String(studentId).padStart(3, '0');
  }

  // إضافة مستخدم جديد
  addUser(userData) {
    if (!userData || !userData.id) throw new Error('بيانات المستخدم غير كاملة');

    // التحقق من عدم وجود معرف مكرر
    if (this.users.find(user => user.id === userData.id)) {
      throw new Error('المعرف موجود مسبقاً');
    }

    const newUser = {
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };

    this.users.push(newUser);
    this.saveToStorage();
    return newUser.id;
  }

  // تحديث مستخدم
  updateUser(userId, updates) {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveToStorage();
    return true;
  }

  // حذف مستخدم
  deleteUser(userId) {
    const before = this.users.length;
    this.users = this.users.filter(user => user.id !== userId);
    if (this.users.length === before) {
      throw new Error('المستخدم غير موجود للحذف');
    }
    this.saveToStorage();
    return true;
  }

  // إعادة تعيين كلمة المرور
  resetPassword(userId, newPassword = '123456') {
    return this.updateUser(userId, { password: newPassword });
  }

  // الحصول على إحصائيات المستخدمين
  getStatistics() {
    const totalUsers = this.users.length;
    const masters = this.users.filter(u => String(u.userType) === '1');
    const students = this.users.filter(u => String(u.userType) === '2');

    const today = new Date().toDateString();
    const activeToday = this.users.filter(u => u.lastLogin && new Date(u.lastLogin).toDateString() === today).length;

    return {
      totalUsers,
      totalMasters: masters.length,
      totalStudents: students.length,
      activeToday
    };
  }

  // البحث عن مستخدمين
  searchUsers(query) {
    if (!query) return this.users;
    const q = String(query).toLowerCase();
    return this.users.filter(user =>
      String(user.id).toLowerCase().includes(q) ||
      (user.fullName && user.fullName.toLowerCase().includes(q)) ||
      (user.userType && String(user.userType).toLowerCase().includes(q))
    );
  }

  // الحفظ في التخزين المحلي
  saveToStorage() {
    localStorage.setItem('platformUsers', JSON.stringify(this.users));
  }

  // تصدير البيانات
  exportData() {
    return JSON.stringify(this.users, null, 2);
  }

  // استيراد البيانات
  importData(jsonData) {
    try {
      const importedUsers = JSON.parse(jsonData);
      if (!Array.isArray(importedUsers)) throw new Error('تنسيق البيانات غير صحيح');
      this.users = importedUsers;
      this.saveToStorage();
      return true;
    } catch (error) {
      throw new Error('بيانات غير صالحة');
    }
  }
}


// نظام تسجيل الدخول
class Authentication {
  static login(userId, password) {
    // التحقق من المالك
    if (userId === '00000000000' && password === 'Admin@2024') {
      const owner = { id: userId, userType: 'owner', fullName: 'مالك النظام' };
      localStorage.setItem('currentUser', JSON.stringify(owner));
      return { success: true, userType: 'owner', userData: owner };
    }

    // التحقق من المستخدمين العاديين
    const users = JSON.parse(localStorage.getItem('platformUsers')) || [];
    const user = users.find(u => u.id === userId && u.password === password);

    if (user) {
      // تحديث آخر دخول
      user.lastLogin = new Date().toISOString();
      localStorage.setItem('platformUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(user));

      return {
        success: true,
        userType: user.userType,
        userData: user
      };
    }

    return { success: false, error: 'المعرف أو كلمة المرور غير صحيحة' };
  }

  static logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }

  static getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('currentUser'));
    } catch (e) {
      return null;
    }
  }
}


// نظام الإحصائيات
class Analytics {
  static getPlatformStats() {
    const users = JSON.parse(localStorage.getItem('platformUsers')) || [];
    const masters = users.filter(u => String(u.userType) === '1');
    const students = users.filter(u => String(u.userType) === '2');

    // إحصائيات أكثر تفصيلاً
    const now = new Date();
    const activeUsers = users.filter(u => {
      if (!u.lastLogin) return false;
      const lastLogin = new Date(u.lastLogin);
      if (isNaN(lastLogin)) return false;
      return (now - lastLogin) < (24 * 60 * 60 * 1000); // نشط خلال 24 ساعة
    }).length;

    return {
      totalUsers: users.length,
      totalMasters: masters.length,
      totalStudents: students.length,
      activeUsers,
      inactiveUsers: users.length - activeUsers,
      growthRate: this.calculateGrowthRate(users)
    };
  }

  static calculateGrowthRate(users) {
    if (!Array.isArray(users) || users.length < 2) return 0;

    const now = new Date();
    const recentUsers = users.filter(u => {
      if (!u.createdAt) return false;
      const created = new Date(u.createdAt);
      if (isNaN(created)) return false;
      return (now - created) < (30 * 24 * 60 * 60 * 1000); // آخر 30 يوم
    }).length;

    return ((recentUsers / users.length) * 100).toFixed(1);
  }

  static getUserActivity() {
    const users = JSON.parse(localStorage.getItem('platformUsers')) || [];
    const activity = {
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    };

    const now = new Date();
    users.forEach(user => {
      if (!user.lastLogin) return;
      const lastLogin = new Date(user.lastLogin);
      if (isNaN(lastLogin)) return;
      const diffTime = now - lastLogin;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 1) activity.today++;
      if (diffDays < 7) activity.thisWeek++;
      if (diffDays < 30) activity.thisMonth++;
    });

    return activity;
  }
}


// تصدير الكلاسات للاستخدام في بيئات CommonJS (اختياري)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserManagement, Authentication, Analytics };
}
