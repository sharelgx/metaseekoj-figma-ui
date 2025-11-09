/**
 * 快速性能测试脚本
 * 
 * 使用方法：
 * 1. 打开 Scratch 编辑器页面
 * 2. 打开浏览器控制台
 * 3. 复制并粘贴此脚本，按回车
 * 4. 输入: runPerfTest()
 */

window.runPerfTest = async function() {
    console.log('%c🧪 开始性能测试...', 'color: #0ff; font-size: 16px; font-weight: bold;');
    console.log('━'.repeat(60));
    
    const results = {
        loginCheck: [],
        export: [],
        save: [],
        messageCount: 0,
        startTime: Date.now()
    };
    
    // 监听消息数量
    const originalLog = console.log;
    let messageCount = 0;
    console.log = function(...args) {
        if (args[0]?.includes?.('📬')) messageCount++;
        originalLog.apply(console, args);
    };
    
    try {
        // 测试 1: 检查初始状态
        console.log('%c📋 测试 1/4: 检查初始状态', 'color: #ff0;');
        const iframe = document.querySelector('iframe[src*="8601"]');
        if (!iframe) {
            console.error('❌ 未找到 iframe');
            return;
        }
        console.log('✅ iframe 已找到');
        
        // 测试 2: 测试导出速度
        console.log('\n%c📋 测试 2/4: 导出速度测试', 'color: #ff0;');
        const exportStart = performance.now();
        
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('导出超时')), 5000);
            
            const handler = (event) => {
                if (event.data?.type === 'EXPORT_PROJECT_RESPONSE') {
                    clearTimeout(timeout);
                    const elapsed = performance.now() - exportStart;
                    results.export.push(elapsed);
                    console.log(`✅ 导出完成: ${elapsed.toFixed(0)}ms`);
                    window.removeEventListener('message', handler);
                    resolve();
                }
            };
            
            window.addEventListener('message', handler);
            iframe.contentWindow.postMessage({ type: 'EXPORT_PROJECT_REQUEST' }, 'http://localhost:8601');
        });
        
        // 测试 3: 测试保存速度
        console.log('\n%c📋 测试 3/4: 保存速度测试', 'color: #ff0;');
        if (window.scratchSaveHandler) {
            const saveStart = performance.now();
            await window.scratchSaveHandler();
            const elapsed = performance.now() - saveStart;
            results.save.push(elapsed);
            console.log(`✅ 保存完成: ${elapsed.toFixed(0)}ms`);
        } else {
            console.warn('⚠️ 保存处理器不存在，跳过');
        }
        
        // 测试 4: 统计消息数量
        console.log('\n%c📋 测试 4/4: 消息统计', 'color: #ff0;');
        await new Promise(r => setTimeout(r, 2000));
        results.messageCount = messageCount;
        console.log(`📊 消息数量: ${messageCount}`);
        
        // 显示结果
        const totalTime = Date.now() - results.startTime;
        
        console.log('\n' + '━'.repeat(60));
        console.log('%c📊 性能测试结果', 'color: #0f0; font-size: 16px; font-weight: bold;');
        console.log('━'.repeat(60));
        console.log(`⏱️  总耗时: ${totalTime}ms`);
        console.log(`📤 导出速度: ${results.export.length ? results.export[0].toFixed(0) : '-'} ms`);
        console.log(`💾 保存速度: ${results.save.length ? results.save[0].toFixed(0) : '-'} ms`);
        console.log(`📨 消息数量: ${results.messageCount} 条`);
        console.log('━'.repeat(60));
        
        // 性能评级
        const avgExport = results.export.length ? results.export[0] : 0;
        const avgSave = results.save.length ? results.save[0] : 0;
        
        console.log('\n%c🎯 性能评级', 'color: #0ff; font-size: 14px;');
        console.log(`导出性能: ${getGrade(avgExport, 500, 1000)}`);
        console.log(`保存性能: ${getGrade(avgSave, 2000, 4000)}`);
        console.log(`消息优化: ${results.messageCount < 10 ? '✅ 优秀' : results.messageCount < 20 ? '⚠️ 良好' : '❌ 需优化'}`);
        
    } catch (error) {
        console.error('❌ 测试失败:', error);
    } finally {
        console.log = originalLog;
    }
    
    function getGrade(value, good, acceptable) {
        if (value < good) return '✅ 优秀 (< ' + good + 'ms)';
        if (value < acceptable) return '⚠️ 良好 (< ' + acceptable + 'ms)';
        return '❌ 需优化 (> ' + acceptable + 'ms)';
    }
};

window.quickCheck = function() {
    const iframe = document.querySelector('iframe[src*="8601"]');
    const vm = iframe?.contentWindow?.vm;
    const blocks = vm?.runtime?.targets?.[0]?.blocks?._blocks?.size || 0;
    
    console.log('%c📊 快速状态检查', 'color: #0ff; font-size: 14px;');
    console.log('iframe:', iframe ? '✅ 就绪' : '❌ 未找到');
    console.log('VM:', vm ? '✅ 就绪' : '❌ 未初始化');
    console.log('积木数:', blocks);
    console.log('登录状态:', window.scratchUserInfo?.isLoggedIn ? `✅ ${window.scratchUserInfo.username}` : '❌ 未登录');
};

console.log('%c✅ 性能测试工具已加载', 'color: #0f0; font-size: 14px; font-weight: bold;');
console.log('💡 输入 runPerfTest() 运行完整测试');
console.log('💡 输入 quickCheck() 快速检查状态');


