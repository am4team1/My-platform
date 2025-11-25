// نظام تنقل مبسط بدون تعقيد
function initSimpleNavigation() {
    const navHTML = `
        <div class="bottom-nav">
            <a href="owner-dashboard.html" class="nav-item">
                <div class="nav-icon">👑</div>
                <div class="nav-label">المالك</div>
            </a>
            <a href="master-dashboard.html" class="nav-item">
                <div class="nav-icon">👨‍🏫</div>
                <div class="nav-label">المستر</div>
            </a>
            <a href="student-dashboard.html" class="nav-item">
                <div class="nav-icon">🎓</div>
                <div class="nav-label">الطالب</div>
            </a>
            <a href="chat.html" class="nav-item">
                <div class="nav-icon">💬</div>
                <div class="nav-label">الشات</div>
            </a>
            <a href="login.html" class="nav-item">
                <div class="nav-icon">🚪</div>
                <div class="nav-label">خروج</div>
            </a>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', navHTML);
    
    // تحديد الصفحة النشطة
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        if (item.href.includes(currentPage)) {
            item.classList.add('active');
        }
        
        item.addEventListener('click', function(e) {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// تهيئة التنقل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initSimpleNavigation);
