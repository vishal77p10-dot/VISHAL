const menuTrigger = document.getElementById('menuTrigger');
const sidebar = document.getElementById('sidebar');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const themeToggle = document.getElementById('themeToggle');
const themeToggleSetting = document.getElementById('themeToggleSetting');
const languageSelect = document.getElementById('languageSelect');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const confirmModal = document.getElementById('confirmModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');

let sidebarLocked = false;

menuTrigger.addEventListener('click', () => {
    menuTrigger.classList.toggle('active');
    sidebar.classList.toggle('open');
    sidebarLocked = !sidebarLocked;
    
    if (sidebarLocked) {
        sidebar.classList.add('locked');
    } else {
        sidebar.classList.remove('locked');
    }
});

sidebar.addEventListener('mouseenter', () => {
    if (!sidebarLocked) {
        sidebar.classList.add('open');
    }
});

sidebar.addEventListener('mouseleave', () => {
    if (!sidebarLocked) {
        sidebar.classList.remove('open');
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetPage = item.getAttribute('data-page');
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        const activePage = document.getElementById(targetPage);
        activePage.classList.add('active');
        
        if (window.innerWidth < 768 && !sidebarLocked) {
            sidebar.classList.remove('open');
        }
    });
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    
    const toggleOptions = themeToggleSetting.querySelectorAll('.toggle-option');
    toggleOptions.forEach(option => {
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

themeToggleSetting.querySelectorAll('.toggle-option').forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme');
        setTheme(theme);
    });
});

languageSelect.addEventListener('change', (e) => {
    const language = e.target.value;
    localStorage.setItem('language', language);
    console.log('Language changed to:', language);
});

const savedLanguage = localStorage.getItem('language') || 'en';
languageSelect.value = savedLanguage;

deleteAccountBtn.addEventListener('click', () => {
    confirmModal.classList.add('active');
});

cancelDelete.addEventListener('click', () => {
    confirmModal.classList.remove('active');
});

confirmDelete.addEventListener('click', () => {
    confirmModal.classList.remove('active');
    alert('Account deletion functionality would be implemented here');
});

confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        confirmModal.classList.remove('active');
    }
});

function generateCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    calendarDays.innerHTML = '';
    
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = daysInPrevMonth - i;
        calendarDays.appendChild(dayDiv);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = day;
        
        if (day === currentDay) {
            dayDiv.classList.add('today');
        }
        
        calendarDays.appendChild(dayDiv);
    }
    
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day other-month';
        dayDiv.textContent = i;
        calendarDays.appendChild(dayDiv);
    }
}

generateCalendar();

function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function animateProgress(progressElement, targetProgress) {
    const circle = progressElement.querySelector('.progress-fill');
    const valueElement = progressElement.querySelector('.progress-value');
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (targetProgress / 100) * circumference;
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
        animateCounter(valueElement, targetProgress, 1500);
    }, 300);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('circular-progress')) {
                const progress = parseInt(entry.target.getAttribute('data-progress'));
                animateProgress(entry.target, progress);
            }
            
            if (entry.target.classList.contains('stat-number')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }
            
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.circular-progress').forEach(el => observer.observe(el));
document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));

function drawActivityChart() {
    const canvas = document.getElementById('activityChart');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const data = [45, 52, 48, 65, 58, 72, 68];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const pointSpacing = chartWidth / (data.length - 1);
    
    const theme = document.documentElement.getAttribute('data-theme');
    const lineColor = theme === 'dark' ? '#667eea' : '#667eea';
    const fillColor = theme === 'dark' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)';
    const textColor = theme === 'dark' ? '#cbd5e0' : '#718096';
    const gridColor = theme === 'dark' ? '#4a5568' : '#e2e8f0';
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    const points = data.map((value, index) => ({
        x: padding + index * pointSpacing,
        y: padding + chartHeight - (value / maxValue) * chartHeight
    }));
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, canvas.height - padding);
    ctx.lineTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currPoint = points[i];
        const cpX = prevPoint.x + (currPoint.x - prevPoint.x) / 2;
        
        ctx.bezierCurveTo(
            cpX, prevPoint.y,
            cpX, currPoint.y,
            currPoint.x, currPoint.y
        );
    }
    
    ctx.lineTo(points[points.length - 1].x, canvas.height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, fillColor);
    gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
        const prevPoint = points[i - 1];
        const currPoint = points[i];
        const cpX = prevPoint.x + (currPoint.x - prevPoint.x) / 2;
        
        ctx.bezierCurveTo(
            cpX, prevPoint.y,
            cpX, currPoint.y,
            currPoint.x, currPoint.y
        );
    }
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = textColor;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], point.x, canvas.height - padding + 20);
    });
}

setTimeout(drawActivityChart, 100);

window.addEventListener('resize', drawActivityChart);

const themeObserver = new MutationObserver(() => {
    drawActivityChart();
});

themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});

const uploadCertBtn = document.getElementById('uploadCertBtn');
const addCertCard = document.getElementById('addCertCard');
const certFileInput = document.getElementById('certFileInput');
const certificatesEmpty = document.getElementById('certificatesEmpty');
const certificatesGrid = document.getElementById('certificatesGrid');

let certificates = JSON.parse(localStorage.getItem('certificates')) || [];

function displayCertificates() {
    if (certificates.length > 0) {
        certificatesEmpty.style.display = 'none';
        certificatesGrid.style.display = 'grid';
        
        certificatesGrid.innerHTML = '';
        
        const addCard = document.createElement('button');
        addCard.className = 'add-certificate-card';
        addCard.innerHTML = '<span class="add-icon">+</span><span>Upload Certificate</span>';
        addCard.addEventListener('click', () => certFileInput.click());
        certificatesGrid.appendChild(addCard);
        
        certificates.forEach((cert, index) => {
            const certCard = document.createElement('div');
            certCard.className = 'certificate-card';
            certCard.innerHTML = `
                <img src="${cert.data}" alt="${cert.name}" class="certificate-preview">
                <div class="certificate-name">${cert.name}</div>
                <button class="delete-btn" onclick="deleteCertificate(${index})">×</button>
            `;
            certificatesGrid.appendChild(certCard);
        });
    } else {
        certificatesEmpty.style.display = 'flex';
        certificatesGrid.style.display = 'none';
    }
}

uploadCertBtn.addEventListener('click', () => certFileInput.click());

certFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            certificates.push({
                name: file.name,
                data: event.target.result
            });
            localStorage.setItem('certificates', JSON.stringify(certificates));
            displayCertificates();
        };
        reader.readAsDataURL(file);
    }
    certFileInput.value = '';
});

function deleteCertificate(index) {
    certificates.splice(index, 1);
    localStorage.setItem('certificates', JSON.stringify(certificates));
    displayCertificates();
}

window.deleteCertificate = deleteCertificate;

displayCertificates();

const addResourceBtn = document.getElementById('addResourceBtn');
const addResourceCard = document.getElementById('addResourceCard');
const resourceFileInput = document.getElementById('resourceFileInput');
const resourcesEmpty = document.getElementById('resourcesEmpty');
const resourcesGrid = document.getElementById('resourcesGrid');

let resources = JSON.parse(localStorage.getItem('resources')) || [];

function displayResources() {
    if (resources.length > 0) {
        resourcesEmpty.style.display = 'none';
        resourcesGrid.style.display = 'grid';
        
        resourcesGrid.innerHTML = '';
        
        const addCard = document.createElement('button');
        addCard.className = 'add-resource-card';
        addCard.innerHTML = '<span class="add-icon">+</span><span>Add Resource</span>';
        addCard.addEventListener('click', () => resourceFileInput.click());
        resourcesGrid.appendChild(addCard);
        
        resources.forEach((resource, index) => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            
            if (resource.type.startsWith('image/')) {
                resourceCard.innerHTML = `
                    <img src="${resource.data}" alt="${resource.name}" class="resource-preview">
                    <div class="resource-name">${resource.name}</div>
                    <button class="delete-btn" onclick="deleteResource(${index})">×</button>
                `;
            } else {
                resourceCard.innerHTML = `
                    <div class="resource-preview" style="background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; color: white; font-size: 3rem;">📄</div>
                    <div class="resource-name">${resource.name}</div>
                    <button class="delete-btn" onclick="deleteResource(${index})">×</button>
                `;
            }
            
            resourcesGrid.appendChild(resourceCard);
        });
    } else {
        resourcesEmpty.style.display = 'flex';
        resourcesGrid.style.display = 'none';
    }
}

addResourceBtn.addEventListener('click', () => resourceFileInput.click());

resourceFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resources.push({
                name: file.name,
                type: file.type,
                data: event.target.result
            });
            localStorage.setItem('resources', JSON.stringify(resources));
            displayResources();
        };
        reader.readAsDataURL(file);
    });
    
    resourceFileInput.value = '';
});

function deleteResource(index) {
    resources.splice(index, 1);
    localStorage.setItem('resources', JSON.stringify(resources));
    displayResources();
}

window.deleteResource = deleteResource;

displayResources();

const svgNS = "http://www.w3.org/2000/svg";
const progressCircles = document.querySelectorAll('.circular-progress svg');

progressCircles.forEach(svg => {
    const defs = document.createElementNS(svgNS, 'defs');
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', 'progressGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#667eea;stop-opacity:1');
    
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#764ba2;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);
});
