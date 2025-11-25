// نظام شريط التنقل المتقدم
class NavigationSystem {
    constructor() {
        this.isExpanded = false;
        this.init();
    }

    init() {
        this.createNavigation();
        this.setupEventListeners();
    }

    createNavigation() {
        // إنشاء هيكل الشريط
        const navHTML = `
            <div class="nav-toggle" onclick="navigation.toggleNav()">⌃</div>
            <div class="nav-items-container">
                <a href="owner-dashboard.html" class="nav-item" data-page="owner">
                    <div class="nav-icon">👑</div>
                    <div class="nav-label">المالك</div>
                </a>
                <a href="master-dashboard.html" class="nav-item" data-page="master">
                    <div class="nav-icon">👨‍🏫</div>
                    <div class="nav-label">المستر</div>
                </a>
                <a href="student-dashboard.html" class="nav-item" data-page="student">
                    <div class="nav-icon">🎓</div>
                    <div class="nav-label">الطالب</div>
                </a>
                <a href="chat.html" class="nav-item chat-item" data-page="chat">
                    <div class="nav-icon">💬</div>
                    <div class="nav-label">الشات</div>
                    <div class="nav-notification"></div>
                </a>
                <a href="reports.html" class="nav-item" data-page="reports">
                    <div class="nav-icon">📊</div>
                    <div class="nav-label">التقارير</div>
                </a>
                <a href="settings.html" class="nav-item" data-page="settings">
                    <div class="nav-icon">⚙️</div>
                    <div class="nav-label">الإعدادات</div>
                </a>
                <a href="login.html" class="nav-item" data-page="logout">
                    <div class="nav-icon">🚪</div>
                    <div class="nav-label">خروج</div>
                </a>
            </div>
        `;

        const navElement = document.createElement('div');
        navElement.className = 'bottom-nav';
        navElement.innerHTML = navHTML;
        
        document.body.appendChild(navElement);
    }

    setupEventListeners() {
        // النقر خارج الشريط لطيعه
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.bottom-nav') && this.isExpanded) {
                this.collapseNav();
            }
        });

        // تحديد الصفحة النشطة
        this.setActivePage();
    }

    toggleNav() {
        if (this.isExpanded) {
            this.collapseNav();
        } else {
            this.expandNav();
        }
    }

    expandNav() {
        const nav = document.querySelector('.bottom-nav');
        const toggle = document.querySelector('.nav-toggle');
        
        nav.classList.add('expanded');
        toggle.innerHTML = '⌄';
        toggle.style.top = '-20px';
        this.isExpanded = true;
    }

    collapseNav() {
        const nav = document.querySelector('.bottom-nav');
        const toggle = document.querySelector('.nav-toggle');
        
        nav.classList.remove('expanded');
        toggle.innerHTML = '⌃';
        toggle.style.top = '-25px';
        this.isExpanded = false;
    }

    setActivePage() {
        const currentPage = this.getCurrentPage();
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === currentPage) {
                item.classList.add('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('owner-dashboard')) return 'owner';
        if (path.includes('master-dashboard')) return 'master';
        if (path.includes('student-dashboard')) return 'student';
        if (path.includes('chat')) return 'chat';
        if (path.includes('reports')) return 'reports';
        if (path.includes('settings')) return 'settings';
        return 'home';
    }

    // إشعارات الشات
    showChatNotification() {
        const chatItem = document.querySelector('.nav-item[data-page="chat"]');
        const notification = chatItem.querySelector('.nav-notification');
        notification.style.display = 'block';
    }

    hideChatNotification() {
        const notification = document.querySelector('.nav-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }
}

// تهيئة النظام
const navigation = new NavigationSystem();
