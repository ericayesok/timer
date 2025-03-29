// QRCode库的基本实现
(function(){
    if (window.QRCode) return; // 如果已经存在QRCode，就不重复定义

    function QR8bitByte(data) {
        this.mode = QRMode.MODE_8BIT_BYTE;
        this.data = data;
    }

    QR8bitByte.prototype = {
        getLength: function() {
            return this.data.length;
        },
        write: function(buffer) {
            for (var i = 0; i < this.data.length; i++) {
                buffer.put(this.data.charCodeAt(i), 8);
            }
        }
    };

    function QRCode(el, options) {
        this._el = el;
        this._htOption = {
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRErrorCorrectLevel.H,
            ...options
        };
        
        this.makeCode = function(sText) {
            const qrcode = document.createElement('img');
            qrcode.src = `https://api.qrserver.com/v1/create-qr-code/?size=${this._htOption.width}x${this._htOption.height}&data=${encodeURIComponent(sText)}`;
            qrcode.style.width = '100%';
            qrcode.style.height = '100%';
            
            // 清空容器
            while (this._el.firstChild) {
                this._el.removeChild(this._el.firstChild);
            }
            
            this._el.appendChild(qrcode);
        };
        
        this.clear = function() {
            while (this._el.firstChild) {
                this._el.removeChild(this._el.firstChild);
            }
        };
    }

    window.QRCode = QRCode;
    window.QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
    window.QRMode = { MODE_8BIT_BYTE: 4 };
})();

// 创建侧边栏和二维码容器
function createSidebar() {
    try {
        const sidebar = document.createElement('div');
        sidebar.id = 'qr-sidebar';
        
        const qrContainer = document.createElement('div');
        qrContainer.id = 'qr-container';
        
        // 添加加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'qr-loading';
        loadingIndicator.textContent = '加载中...';
        qrContainer.appendChild(loadingIndicator);
        
        sidebar.appendChild(qrContainer);
        document.body.appendChild(sidebar);
        
        console.log('侧边栏创建成功');
        return { sidebar, qrContainer };
    } catch (error) {
        console.error('创建侧边栏失败:', error);
        return null;
    }
}

// 初始化QR码
function initQRCode(container) {
    if (!container) {
        console.error('QR码容器不存在');
        return null;
    }

    try {
        // 清空容器
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // 创建内部容器用于QR码生成
        const qrInnerContainer = document.createElement('div');
        container.appendChild(qrInnerContainer);

        const qr = new QRCode(qrInnerContainer, {
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRErrorCorrectLevel.H
        });
        console.log('QR码初始化成功');
        return qr;
    } catch (error) {
        console.error('QR码初始化失败:', error);
        container.textContent = '二维码生成失败';
        return null;
    }
}

// 更新QR码
function updateQRCode(qrcode, url) {
    if (!qrcode) {
        console.error('QR码对象不存在');
        return;
    }
    
    try {
        qrcode.clear();
        qrcode.makeCode(url);
        console.log('QR码更新成功:', url);
    } catch (error) {
        console.error('QR码更新失败:', error);
    }
}

// 主函数
function main() {
    try {
        // 创建侧边栏和容器
        const sidebarElements = createSidebar();
        if (!sidebarElements) return;
        
        const { qrContainer } = sidebarElements;
        
        // 初始化QR码
        const qrcode = initQRCode(qrContainer);
        if (!qrcode) {
            throw new Error('QR码初始化失败');
        }

        // 初始化时生成二维码
        updateQRCode(qrcode, window.location.href);
        
        // 监听URL变化
        let lastUrl = window.location.href;
        
        // 使用MutationObserver监听DOM变化，可能意味着URL变化（适用于SPA）
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                updateQRCode(qrcode, lastUrl);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('URL监听器设置成功');
    } catch (error) {
        console.error('主函数执行失败:', error);
        const qrContainer = document.querySelector('#qr-container');
        if (qrContainer) {
            qrContainer.textContent = '二维码加载失败，请刷新页面重试';
        }
    }
}

// 当DOM加载完成后启动
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
} 