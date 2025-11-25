// نظام التحليلات والإحصائيات - analytics.js

class DashboardAnalytics {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('platformUsers')) || [];
    }

    // إحصائيات الاستخدام اليومي
    getDailyStats() {
        const today = new Date().toDateString();
        const dailyLogins = this.users.filter(user => 
            user.lastLogin && new Date(user.lastLogin).toDateString() === today
        ).length;

        return {
            dailyLogins,
            newUsersToday: this.getNewUsersToday(),
            activeRate: ((dailyLogins / this.users.length) * 100).toFixed(1)
        };
    }

    // المستخدمين الجدد اليوم
    getNewUsersToday() {
        const today = new Date().toDateString();
        return this.users.filter(user => 
            user.createdAt && new Date(user.createdAt).toDateString() === today
        ).length;
    }

    // توزيع المستخدمين حسب النوع
    getUserDistribution() {
        const masters = this.users.filter(u => u.userType === '1');
        const students = this.users.filter(u => u.userType === '2');
        
        return {
            masters: masters.length,
            students: students.length,
            mastersPercentage: ((masters.length / this.users.length) * 100).toFixed(1),
            studentsPercentage: ((students.length / this.users.length) * 100).toFixed(1)
        };
    }

    // نشاط المستخدمين
    getUserActivity() {
        const now = new Date();
        const activity = {
            activeToday: 0,
            activeThisWeek: 0,
            activeThisMonth: 0,
            inactive: 0
        };

        this.users.forEach(user => {
            if (user.lastLogin) {
                const lastLogin = new Date(user.lastLogin);
                const diffTime = now - lastLogin;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays < 1) activity.activeToday++;
                else if (diffDays < 7) activity.activeThisWeek++;
                else if (diffDays < 30) activity.activeThisMonth++;
                else activity.inactive++;
            } else {
                activity.inactive++;
            }
        });

        return activity;
    }

    // معدل النمو
    getGrowthRate(days = 30) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);

        const newUsers = this.users.filter(user => 
            user.createdAt && new Date(user.createdAt) > pastDate
        ).length;

        return {
            newUsers,
            growthRate: ((newUsers / this.users.length) * 100).toFixed(1),
            period: days
        };
    }

    // إنشاء تقرير مفصل
    generateReport() {
        const dailyStats = this.getDailyStats();
        const distribution = this.getUserDistribution();
        const activity = this.getUserActivity();
        const growth = this.getGrowthRate();

        return {
            timestamp: new Date().toISOString(),
            summary: {
                totalUsers: this.users.length,
                overallGrowth: growth.growthRate + '%',
                activeRate: dailyStats.activeRate + '%'
            },
            dailyStats,
            distribution,
            activity,
            growth,
            recommendations: this.generateRecommendations(dailyStats, distribution, activity)
        };
    }

    // توليد توصيات بناءً على البيانات
    generateRecommendations(dailyStats, distribution, activity) {
        const recommendations = [];

        if (dailyStats.activeRate < 50) {
            recommendations.push('معدل النشاط اليومي منخفض. فكر في إرسال تذكيرات للمستخدمين.');
        }

        if (distribution.masters === 0) {
            recommendations.push('لا يوجد مسترين مسجلين. ركز على جذب مسترين جدد.');
        }

        if (activity.inactive > (this.users.length * 0.3)) {
            recommendations.push('نسبة المستخدمين غير النشطين مرتفعة. فكر في حملة إعادة تفعيل.');
        }

        return recommendations.length > 0 ? recommendations : ['الأداء جيد! حافظ على هذا المستوى.'];
    }
}

// نظام الرسوم البيانية
class ChartRenderer {
    static renderUserDistribution(chartId, distribution) {
        // محاكاة رسم رسم بياني (يمكن استبدالها بمكتبة charts حقيقية)
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            chartElement.innerHTML = `
                <div style="display: flex; align-items: end; height: 200px; gap: 20px; justify-content: center;">
                    <div style="text-align: center;">
                        <div style="background: var(--neon-purple); height: ${distribution.masters * 10}px; width: 60px; border-radius: 10px 10px 0 0;"></div>
                        <div style="margin-top: 10px;">مسترين<br>${distribution.masters}</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="background: var(--electric-blue); height: ${distribution.students * 10}px; width: 60px; border-radius: 10px 10px 0 0;"></div>
                        <div style="margin-top: 10px;">طلاب<br>${distribution.students}</div>
                    </div>
                </div>
            `;
        }
    }

    static renderActivityChart(chartId, activity) {
        const chartElement = document.getElementById(chartId);
        if (chartElement) {
            const total = activity.activeToday + activity.activeThisWeek + activity.activeThisMonth + activity.inactive;
            
            chartElement.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: between; align-items: center;">
                        <span>نشط اليوم:</span>
                        <div style="background: rgba(255,255,255,0.1); width: 100px; height: 20px; border-radius: 10px;">
                            <div style="background: var(--success-color); height: 100%; width: ${(activity.activeToday / total) * 100}%; border-radius: 10px;"></div>
                        </div>
                        <span>${activity.activeToday}</span>
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center;">
                        <span>نشط هذا الأسبوع:</span>
                        <div style="background: rgba(255,255,255,0.1); width: 100px; height: 20px; border-radius: 10px;">
                            <div style="background: var(--electric-blue); height: 100%; width: ${(activity.activeThisWeek / total) * 100}%; border-radius: 10px;"></div>
                        </div>
                        <span>${activity.activeThisWeek}</span>
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center;">
                        <span>نشط هذا الشهر:</span>
                        <div style="background: rgba(255,255,255,0.1); width: 100px; height: 20px; border-radius: 10px;">
                            <div style="background: var(--warning-color); height: 100%; width: ${(activity.activeThisMonth / total) * 100}%; border-radius: 10px;"></div>
                        </div>
                        <span>${activity.activeThisMonth}</span>
                    </div>
                    <div style="display: flex; justify-content: between; align-items: center;">
                        <span>غير نشط:</span>
                        <div style="background: rgba(255,255,255,0.1); width: 100px; height: 20px; border-radius: 10px;">
                            <div style="background: var(--danger-color); height: 100%; width: ${(activity.inactive / total) * 100}%; border-radius: 10px;"></div>
                        </div>
                        <span>${activity.inactive}</span>
                    </div>
                </div>
            `;
        }
    }
}

// تصدير الكلاسات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardAnalytics, ChartRenderer };
}
