// نظام الشريط السفلي الحديث
class ModernNavigation {
    constructor() {
        this.isExpanded = true;
        this.init();
    }

    init() {
        this.createNavigation();
        this.setupEventListeners();
        this.setActivePage();
    }

    createNavigation() {
        const navHTML = `
            <div class="modern-nav">
                <div class="nav-toggle" onclick="modernNav.toggleNav()">
                    ${this.isExpanded ? '⌄' : '⌃'}
                </div>
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
                        <div class="nav-notification" style="display: none;"></div>
                    </a>
                    <a href="login.html" class="nav-item" data-page="logout">
                        <div class="nav-icon">🚪</div>
                        <div class="nav-label">خروج</div>
                    </a>
                </div>
            </div>
        `;

        const navElement = document.createElement('div');
        navElement.innerHTML = navHTML;
        document.body.appendChild(navElement);
        
        this.navElement = document.querySelector('.modern-nav');
        this.toggleElement = document.querySelector('.nav-toggle');
    }

    setupEventListeners() {
        // النقر خارج الشريط لطيعه
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.modern-nav') && this.isExpanded) {
                this.collapseNav();
            }
        });

        // منع الانتقال للصفحة إذا كان الشريط مطوي
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.isExpanded) {
                    e.preventDefault();
                    this.expandNav();
                }
            });
        });
    }

    toggleNav() {
        if (this.isExpanded) {
            this.collapseNav();
        } else {
            this.expandNav();
        }
    }

    expandNav() {
        this.navElement.classList.remove('collapsed');
        this.toggleElement.innerHTML = '⌄';
        this.isExpanded = true;
    }

    collapseNav() {
        this.navElement.classList.add('collapsed');
        this.toggleElement.innerHTML = '⌃';
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
        return 'home';
    }

    showChatNotification() {
        const notification = document.querySelector('.nav-notification');
        if (notification) {
            notification.style.display = 'block';
        }
    }

    hideChatNotification() {
        const notification = document.querySelector('.nav-notification');
        if (notification) {
            notification.style.display = 'none';
        }
    }
}

// تهيئة النظام
const modernNav = new ModernNavigation();
