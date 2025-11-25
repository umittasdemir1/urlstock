const VALID_EMAIL = 'tasdemir_umit@hotmail.com';
const VALID_PASSWORD = '192837192837Asd.Asd.';

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const error = document.getElementById('error');

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'app.html';
    } else {
        error.textContent = 'Hatalı email veya şifre';
        setTimeout(() => {
            error.textContent = '';
        }, 3000);
    }
}

function checkAuth() {
    if (window.location.pathname.includes('app.html')) {
        if (localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'index.html';
        } else {
            loadUrls();
        }
    }
}

function getDomain(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
        return urlObj.hostname;
    } catch {
        return '';
    }
}

function addUrl() {
    const input = document.getElementById('urlInput');
    let url = input.value.trim();

    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    const urls = getUrls();
    urls.unshift({
        id: Date.now(),
        url: url,
        domain: getDomain(url),
        added: new Date().toISOString()
    });

    localStorage.setItem('urls', JSON.stringify(urls));
    input.value = '';
    loadUrls();
}

function getUrls() {
    const urls = localStorage.getItem('urls');
    return urls ? JSON.parse(urls) : [];
}

function deleteUrl(id) {
    const urls = getUrls().filter(u => u.id !== id);
    localStorage.setItem('urls', JSON.stringify(urls));
    loadUrls();
}

function loadUrls() {
    const urlList = document.getElementById('urlList');
    if (!urlList) return;

    const urls = getUrls();

    if (urls.length === 0) {
        urlList.innerHTML = '<div style="text-align: center; padding: 50px; color: #888;">Henüz URL eklenmedi</div>';
        return;
    }

    urlList.innerHTML = urls.map(item => `
        <div class="url-item">
            <img src="https://www.google.com/s2/favicons?domain=${item.domain}&sz=32"
                 alt="logo"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22%3E%3Crect width=%2232%22 height=%2232%22 fill=%22%23000%22/%3E%3Ctext x=%2216%22 y=%2216%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22%23fff%22 font-size=%2216%22%3E?%3C/text%3E%3C/svg%3E'">
            <a href="${item.url}" target="_blank">${item.url}</a>
            <button onclick="deleteUrl(${item.id})">Sil</button>
        </div>
    `).join('');
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            if (email && password) {
                login();
            }
        } else if (window.location.pathname.includes('app.html')) {
            addUrl();
        }
    }
});

checkAuth();
