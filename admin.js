// نظام إدارة المستخدمين - admin.js

class UserManagement {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('platformUsers')) || [];
    }

    // إنشاء معرف فريد
    generateUserId(governorate, userType, studentId) {
        const cityCode = '249'; // عين شمس
        const schoolCode = '23'; // نهضة عين شمس
        return governorate + cityCode + userType + schoolCode + studentId;
    }

    // إضافة مستخدم جديد
    addUser(userData) {
        // التحقق من عدم وجود معرف مكرر
        if (this.users.find(user => user.id === userData.id)) {
            throw new Error('المعرف موجود مسبقاً');
        }

        this.users.push({
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        });

        this.saveToStorage();
        return userData.id;
    }

    // تحديث مستخدم
    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            throw new Error('المستخدم غير موجود');
        }

        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        this.saveToStorage();
    }

    // حذف مستخدم
    deleteUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
        this.saveToStorage();
    }

    // إعادة تعيين كلمة المرور
    resetPassword(userId, newPassword) {
        this.updateUser(userId, { password: newPassword });
    }

    // الحصول على إحصائيات المستخدمين
    getStatistics() {
        const totalUsers = this.users.length;
        const masters = this.users.filter(u => u.userType === '1');
        const students = this.users.filter(u => u.userType === '2');
        
        return {
            totalUsers,
            totalMasters: masters.length,
            totalStudents: students.length,
            activeToday: this.users.filter(u => {
                const today = new Date().toDateString();
                return u.lastLogin && new Date(u.lastLogin).toDateString() === today;
            }).length
        };
    }

    // البحث عن مستخدمين
    searchUsers(query) {
        return this.users.filter(user => 
            user.id.includes(query) ||
            user.fullName.includes(query) ||
            user.userType.includes(query)
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
            return { success: true, userType: 'owner', userData: null };
        }

        // التحقق من المستخدمين العاديين
        const users = JSON.parse(localStorage.getItem('platformUsers')) || [];
        const user = users.find(u => u.id === userId && u.password === password);

        if (user) {
            // تحديث آخر دخول
            user.lastLogin = new Date().toISOString();
            localStorage.setItem('platformUsers', JSON.stringify(users));
            
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
        return JSON.parse(localStorage.getItem('currentUser'));
    }
}

// نظام الإحصائيات
class Analytics {
    static getPlatformStats() {
        const users = JSON.parse(localStorage.getItem('platformUsers')) || [];
        const masters = users.filter(u => u.userType === '1');
        const students = users.filter(u => u.userType === '2');
        
        // إحصائيات أكثر تفصيلاً
        const activeUsers = users.filter(u => {
            const lastLogin = new Date(u.lastLogin);
            const today = new Date();
            return (today - lastLogin) < (24 * 60 * 60 * 1000); // نشط خلال 24 ساعة
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
        if (users.length < 2) return 0;
        
        const recentUsers = users.filter(u => {
            const created = new Date(u.createdAt);
            const now = new Date();
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
            if (user.lastLogin) {
                const lastLogin = new Date(user.lastLogin);
                const diffTime = now - lastLogin;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays < 1) activity.today++;
                if (diffDays < 7) activity.thisWeek++;
                if (diffDays < 30) activity.thisMonth++;
            }
        });

        return activity;
    }
}

// تصدير الكلاسات للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserManagement, Authentication, Analytics };
}
