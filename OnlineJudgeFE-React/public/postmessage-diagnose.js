/**
 * PostMessage 通信诊断脚本
 * 
 * 使用方法：
 * 1. 打开 Scratch 编辑器页面 (http://localhost:8081/classroom/scratch/edit/7)
 * 2. 打开浏览器控制台 (F12)
 * 3. 复制并粘贴整个脚本到控制台，按回车执行
 * 4. 在控制台输入：testExport()
 */

(function() {
    console.log('%c🔧 PostMessage 通信诊断工具已加载', 'color: #0f0; font-size: 16px; font-weight: bold;');
    console.log('💡 使用方法：');
    console.log('   1. 输入 testExport() 测试导出功能');
    console.log('   2. 输入 testSave() 测试完整保存流程');
    console.log('   3. 输入 showLogs() 查看所有消息日志');
    
    let messageLog = [];
    let originalListener = null;
    
    // 拦截所有 postMessage 消息
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'message') {
            originalListener = listener;
            const wrappedListener = function(event) {
                // 记录消息
                messageLog.push({
                    timestamp: new Date().toISOString(),
                    origin: event.origin,
                    type: event.data?.type || 'unknown',
                    dataSize: event.data ? JSON.stringify(event.data).length : 0,
                    data: event.data
                });
                
                // 调用原始监听器
                if (originalListener) {
                    originalListener.call(this, event);
                }
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    }
    
    // 测试导出功能
    window.testExport = function() {
        console.log('%c📤 开始测试导出功能...', 'color: #ff0; font-size: 14px;');
        
        const iframe = document.querySelector('iframe[src*="8601"]');
        if (!iframe) {
            console.error('❌ 找不到 Scratch 编辑器 iframe');
            return;
        }
        
        if (!iframe.contentWindow) {
            console.error('❌ iframe 未加载完成');
            return;
        }
        
        console.log('✅ iframe 已找到');
        
        // 监听响应
        const timeout = setTimeout(() => {
            console.error('❌ 超时：10秒内未收到响应');
            window.removeEventListener('message', messageHandler);
        }, 10000);
        
        const messageHandler = (event) => {
            console.log('🔔 收到消息:');
            console.log('   Origin:', event.origin);
            console.log('   Type:', event.data?.type);
            
            if (event.origin.includes('localhost') && event.data?.type === 'EXPORT_PROJECT_RESPONSE') {
                clearTimeout(timeout);
                window.removeEventListener('message', messageHandler);
                
                const projectData = event.data.data;
                console.log('%c✅ 成功收到 EXPORT_PROJECT_RESPONSE！', 'color: #0f0; font-size: 14px;');
                console.log('📦 数据类型:', typeof projectData);
                console.log('📦 数据大小:', JSON.stringify(projectData).length, '字节');
                
                if (projectData && projectData.targets) {
                    const totalBlocks = projectData.targets.reduce((sum, target) => 
                        sum + Object.keys(target.blocks || {}).length, 0);
                    console.log('📊 targets 数量:', projectData.targets.length);
                    console.log('📊 总积木数:', totalBlocks);
                }
                
                return true;
            }
        };
        
        window.addEventListener('message', messageHandler);
        
        // 发送请求
        console.log('📨 发送 EXPORT_PROJECT_REQUEST...');
        iframe.contentWindow.postMessage({
            type: 'EXPORT_PROJECT_REQUEST'
        }, 'http://localhost:8601');
        
        console.log('⏳ 等待响应（最多 10 秒）...');
    };
    
    // 测试完整保存流程
    window.testSave = function() {
        console.log('%c💾 开始测试完整保存流程...', 'color: #ff0; font-size: 14px;');
        
        // 检查全局保存函数
        if (window.scratchSaveHandler) {
            console.log('✅ 找到全局保存函数，调用...');
            try {
                window.scratchSaveHandler();
            } catch (error) {
                console.error('❌ 保存函数执行失败:', error);
            }
        } else {
            console.error('❌ 未找到全局保存函数 window.scratchSaveHandler');
            console.log('💡 尝试手动触发保存...');
            testExport();
        }
    };
    
    // 显示所有消息日志
    window.showLogs = function() {
        console.log('%c📋 消息日志（最近 20 条）:', 'color: #0ff; font-size: 14px;');
        const recentLogs = messageLog.slice(-20);
        recentLogs.forEach((log, index) => {
            const color = log.type === 'EXPORT_PROJECT_RESPONSE' ? '#0f0' : '#ff0';
            console.log(`%c[${index + 1}] ${log.timestamp}`, `color: ${color};`);
            console.log(`   Origin: ${log.origin}`);
            console.log(`   Type: ${log.type}`);
            console.log(`   Data Size: ${log.dataSize} bytes`);
        });
        
        if (recentLogs.length === 0) {
            console.log('   (暂无消息)');
        }
    };
    
    // 检查环境
    window.checkEnv = function() {
        console.log('%c🔍 环境检查:', 'color: #0ff; font-size: 14px;');
        
        const iframe = document.querySelector('iframe[src*="8601"]');
        console.log('iframe 存在:', !!iframe);
        console.log('iframe contentWindow 存在:', !!iframe?.contentWindow);
        console.log('window.scratchSaveHandler 存在:', !!window.scratchSaveHandler);
        console.log('window.scratchLogoutHandler 存在:', !!window.scratchLogoutHandler);
        console.log('window.__sendUserInfoRef 存在:', !!window.__sendUserInfoRef);
        
        if (iframe?.contentWindow) {
            try {
                const vm = iframe.contentWindow.vm;
                console.log('iframe.vm 存在:', !!vm);
                if (vm) {
                    console.log('VM targets 数量:', vm.runtime?.targets?.length || 0);
                }
            } catch (e) {
                console.log('⚠️ 无法访问 iframe.vm（跨域限制）:', e.message);
            }
        }
    };
    
    console.log('%c✅ 诊断工具已就绪！', 'color: #0f0; font-size: 14px;');
    console.log('💡 输入 checkEnv() 检查环境');
    console.log('💡 输入 testExport() 测试导出');
    console.log('💡 输入 testSave() 测试保存');
    console.log('💡 输入 showLogs() 查看日志');
})();

