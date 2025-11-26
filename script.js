// MultiApp - Professional Multi-Instance App Manager
class MultiApp {
    constructor() {
        this.instances = new Map();
        this.installedApps = new Map();
        this.nextInstanceId = 1;
        this.settings = {
            darkMode: false,
            autoScan: true,
            maxInstances: 10
        };
        
        this.init();
    }

    async init() {
        // Load settings
        this.loadSettings();
        
        // Initialize UI
        this.initUI();
        
        // Load installed apps
        await this.loadInstalledApps();
        
        // Load saved instances
        this.loadSavedInstances();
        
        // Hide loading screen
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 2000);
        
        console.log('MultiApp initialized successfully');
    }

    initUI() {
        // Apply dark mode if enabled
        if (this.settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        }
        
        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Click outside modals to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    async loadInstalledApps() {
        try {
            // Simulate scanning installed apps
            const apps = await this.scanInstalledApps();
            
            this.installedApps.clear();
            apps.forEach(app => {
                this.installedApps.set(app.packageName, app);
            });
            
            this.renderAppsGrid();
            
        } catch (error) {
            console.error('Error loading installed apps:', error);
            this.showError('Failed to load installed apps');
        }
    }

    async scanInstalledApps() {
        // Simulate app scanning - in real app, this would use Android APIs
        return new Promise((resolve) => {
            setTimeout(() => {
                const popularApps = [
                    {
                        name: "WhatsApp",
                        packageName: "com.whatsapp",
                        icon: "fab fa-whatsapp",
                        type: "messaging",
                        webUrl: "https://web.whatsapp.com"
                    },
                    {
                        name: "Gmail",
                        packageName: "com.google.android.gm", 
                        icon: "fas fa-envelope",
                        type: "email",
                        webUrl: "https://gmail.com"
                    },
                    {
                        name: "YouTube",
                        packageName: "com.google.android.youtube",
                        icon: "fab fa-youtube",
                        type: "video",
                        webUrl: "https://youtube.com"
                    },
                    {
                        name: "Chrome",
                        packageName: "com.android.chrome",
                        icon: "fab fa-chrome",
                        type: "browser",
                        webUrl: "https://google.com"
                    },
                    {
                        name: "Maps",
                        packageName: "com.google.android.apps.maps",
                        icon: "fas fa-map",
                        type: "navigation", 
                        webUrl: "https://maps.google.com"
                    },
                    {
                        name: "Instagram",
                        packageName: "com.instagram.android",
                        icon: "fab fa-instagram",
                        type: "social",
                        webUrl: "https://instagram.com"
                    },
                    {
                        name: "Facebook",
                        packageName: "com.facebook.katana",
                        icon: "fab fa-facebook",
                        type: "social",
                        webUrl: "https://facebook.com"
                    },
                    {
                        name: "Phone",
                        packageName: "com.android.dialer",
                        icon: "fas fa-phone",
                        type: "communication"
                    },
                    {
                        name: "Messages",
                        packageName: "com.android.mms", 
                        icon: "fas fa-comment",
                        type: "messaging"
                    },
                    {
                        name: "Camera",
                        packageName: "com.android.camera",
                        icon: "fas fa-camera",
                        type: "media"
                    }
                ];
                resolve(popularApps);
            }, 1000);
        });
    }

    renderAppsGrid() {
        const appsGrid = document.getElementById('appsGrid');
        appsGrid.innerHTML = '';

        this.installedApps.forEach((app, packageName) => {
            const appCard = document.createElement('div');
            appCard.className = 'app-card';
            appCard.onclick = () => this.showAppLaunchOptions(app);
            
            appCard.innerHTML = `
                <div class="app-icon">
                    <i class="${app.icon}"></i>
                </div>
                <div class="app-name">${app.name}</div>
            `;
            
            appsGrid.appendChild(appCard);
        });

        // Update instance count
        this.updateInstanceCount();
    }

    showAppLaunchOptions(app) {
        const modalContent = document.getElementById('appModalContent');
        modalContent.innerHTML = `
            <div class="app-launch-options">
                <div class="app-header" style="text-align: center; margin-bottom: 1.5rem;">
                    <div class="app-icon large" style="width: 64px; height: 64px; margin: 0 auto 1rem;">
                        <i class="${app.icon}"></i>
                    </div>
                    <h3>${app.name}</h3>
                    <p style="color: var(--text-secondary);">${app.packageName}</p>
                </div>
                
                <div class="launch-actions" style="display: grid; gap: 1rem;">
                    <button class="btn primary" onclick="multiApp.launchAppInstance('${app.packageName}', '${app.name}', '${app.webUrl || ''}')">
                        <i class="fas fa-play"></i> Launch Single Instance
                    </button>
                    
                    <button class="btn success" onclick="multiApp.launchMultipleInstances('${app.packageName}', '${app.name}', '${app.webUrl || ''}', 3)">
                        <i class="fas fa-copy"></i> Launch 3 Instances
                    </button>
                    
                    ${app.webUrl ? `
                    <button class="btn info" onclick="multiApp.launchWebView('${app.packageName}', '${app.name}', '${app.webUrl}')">
                        <i class="fas fa-globe"></i> Open Web Version
                    </button>
                    ` : ''}
                    
                    <button class="btn warning" onclick="multiApp.showAppInfo('${app.packageName}')">
                        <i class="fas fa-info-circle"></i> App Information
                    </button>
                </div>
            </div>
        `;
        
        this.showModal('appModal');
    }

    launchAppInstance(packageName, appName, webUrl = '') {
        const instanceId = this.nextInstanceId++;
        const instance = {
            id: instanceId,
            packageName,
            appName,
            webUrl,
            type: webUrl ? 'web' : 'native',
            timestamp: Date.now(),
            data: {}
        };

        this.instances.set(instanceId, instance);
        
        // Create instance window
        this.createInstanceWindow(instance);
        
        // Update UI
        this.updateInstanceCount();
        this.renderInstancesList();
        
        // Save to storage
        this.saveInstances();
        
        this.showSuccess(`Launched ${appName} instance`);
        this.closeModal('appModal');
    }

    launchMultipleInstances(packageName, appName, webUrl, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.launchAppInstance(packageName, `${appName} #${i + 1}`, webUrl);
            }, i * 300);
        }
        
        this.showSuccess(`Launching ${count} instances of ${appName}`);
        this.closeModal('appModal');
    }

    createInstanceWindow(instance) {
        // In a real app, this would create actual app windows
        // For web demo, we'll show success message and manage instances
        console.log('Creating instance window for:', instance);
        
        // For web apps, open in new tab/window
        if (instance.type === 'web' && instance.webUrl) {
            window.open(instance.webUrl, `instance_${instance.id}`, 'width=400,height=600');
        }
    }

    launchWebView(packageName, appName, webUrl) {
        const instanceId = this.nextInstanceId++;
        const instance = {
            id: instanceId,
            packageName,
            appName: `${appName} Web`,
            webUrl,
            type: 'webview',
            timestamp: Date.now()
        };

        this.instances.set(instanceId, instance);
        
        // Open in embedded webview (simulated)
        this.openEmbeddedWebView(instance);
        
        this.updateInstanceCount();
        this.renderInstancesList();
        this.saveInstances();
        
        this.closeModal('appModal');
    }

    openEmbeddedWebView(instance) {
        // Create a floating webview window
        const webviewWindow = document.createElement('div');
        webviewWindow.className = 'webview-window';
        webviewWindow.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50px;
            width: 400px;
            height: 600px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            resize: both;
            overflow: hidden;
            border: 2px solid var(--primary-color);
        `;
        
        webviewWindow.innerHTML = `
            <div class="webview-header" style="padding: 1rem; background: var(--primary-color); color: white; display: flex; justify-content: space-between; align-items: center;">
                <span>${instance.appName}</span>
                <button onclick="this.parentElement.parentElement.remove(); multiApp.removeInstance(${instance.id})" style="background: none; border: none; color: white; font-size: 1.2rem;">×</button>
            </div>
            <iframe src="${instance.webUrl}" style="width: 100%; height: calc(100% - 60px); border: none;"></iframe>
        `;
        
        document.body.appendChild(webviewWindow);
        
        // Make draggable
        this.makeDraggable(webviewWindow);
    }

    makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.webview-header');
        
        header.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    removeInstance(instanceId) {
        this.instances.delete(instanceId);
        this.updateInstanceCount();
        this.renderInstancesList();
        this.saveInstances();
    }

    updateInstanceCount() {
        const count = this.instances.size;
        document.getElementById('instanceCount').textContent = count;
    }

    renderInstancesList() {
        const instancesList = document.getElementById('instancesList');
        instancesList.innerHTML = '';

        this.instances.forEach((instance) => {
            const instanceItem = document.createElement('div');
            instanceItem.className = 'instance-item';
            
            instanceItem.innerHTML = `
                <div class="instance-info">
                    <h4>${instance.appName}</h4>
                    <p>${instance.type} • ${new Date(instance.timestamp).toLocaleTimeString()}</p>
                </div>
                <div class="instance-actions">
                    <button class="instance-btn" onclick="multiApp.focusInstance(${instance.id})" title="Focus">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="instance-btn" onclick="multiApp.removeInstance(${instance.id})" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            instancesList.appendChild(instanceItem);
        });
    }

    focusInstance(instanceId) {
        const instance = this.instances.get(instanceId);
        if (instance) {
            this.showSuccess(`Focusing on ${instance.appName}`);
            // In real app, this would bring window to front
        }
    }

    // Modal Management
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // UI Helpers
    hideLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('appInterface').style.display = 'block';
    }

    toggleDarkMode() {
        this.settings.darkMode = !this.settings.darkMode;
        document.body.setAttribute('data-theme', this.settings.darkMode ? 'dark' : 'light');
        this.saveSettings();
    }

    showQuickLaunch() {
        this.showModal('quickLaunchModal');
    }

    showAllInstances() {
        if (this.instances.size === 0) {
            this.showInfo('No running instances');
            return;
        }
        
        let instancesInfo = 'Running Instances:\n\n';
        this.instances.forEach(instance => {
            instancesInfo += `• ${instance.appName} (${instance.type})\n`;
        });
        
        alert(instancesInfo);
    }

    showAppManager() {
        this.showInfo('App Manager - Total Apps: ' + this.installedApps.size);
    }

    showAppInfo(packageName) {
        const app = this.installedApps.get(packageName);
        if (app) {
            alert(`App Information:\n\nName: ${app.name}\nPackage: ${app.packageName}\nType: ${app.type}\nWeb URL: ${app.webUrl || 'N/A'}`);
        }
    }

    // Storage Management
    saveInstances() {
        const instancesData = Array.from(this.instances.values());
        localStorage.setItem('multiApp_instances', JSON.stringify(instancesData));
    }

    loadSavedInstances() {
        try {
            const saved = localStorage.getItem('multiApp_instances');
            if (saved) {
                const instancesData = JSON.parse(saved);
                instancesData.forEach(instance => {
                    this.instances.set(instance.id, instance);
                    this.nextInstanceId = Math.max(this.nextInstanceId, instance.id + 1);
                });
                
                this.updateInstanceCount();
                this.renderInstancesList();
            }
        } catch (error) {
            console.error('Error loading saved instances:', error);
        }
    }

    saveSettings() {
        localStorage.setItem('multiApp_settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('multiApp_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // Notification System
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick attributes
function showQuickLaunch() {
    multiApp.showQuickLaunch();
}

function closeModal(modalId) {
    multiApp.closeModal(modalId);
}

function toggleDarkMode() {
    multiApp.toggleDarkMode();
}

function showSettings() {
    multiApp.showInfo('Settings will be available in the full version');
}

function scanInstalledApps() {
    multiApp.loadInstalledApps();
    multiApp.showSuccess('Scanning for installed apps...');
}

function showAllInstances() {
    multiApp.showAllInstances();
}

function createQuickInstance() {
    multiApp.showQuickLaunch();
}

function showAppManager() {
    multiApp.showAppManager();
}

function loadInstalledApps() {
    multiApp.loadInstalledApps();
}

function launchWebApp(appType) {
    const apps = {
        whatsapp: { name: 'WhatsApp', url: 'https://web.whatsapp.com' },
        gmail: { name: 'Gmail', url: 'https://gmail.com' },
        youtube: { name: 'YouTube', url: 'https://youtube.com' },
        maps: { name: 'Google Maps', url: 'https://maps.google.com' }
    };
    
    const app = apps[appType];
    if (app) {
        multiApp.launchWebView(appType, app.name, app.url);
        multiApp.closeModal('quickLaunchModal');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.multiApp = new MultiApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .btn {
        padding: 12px 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
    }
    
    .btn.primary {
        background: var(--primary-color);
        color: white;
    }
    
    .btn.success {
        background: #48bb78;
        color: white;
    }
    
    .btn.info {
        background: #4299e1;
        color: white;
    }
    
    .btn.warning {
        background: #ed8936;
        color: white;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .app-icon.large {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        font-size: 1.5rem;
    }
`;
document.head.appendChild(style);