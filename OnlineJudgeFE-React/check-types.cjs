#!/usr/bin/env node

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 TypeScript类型文件诊断');
console.log('═══════════════════════════════════════════════════════════\n');

const fs = require('fs');
const path = require('path');

// 1. 检查文件存在性
const typesFile = path.join(__dirname, 'src/types/classroom.ts');
const componentFile = path.join(__dirname, 'src/pages/classroom/teacher/CourseList.tsx');

console.log('1. 文件存在性检查:');
console.log(`   类型文件: ${fs.existsSync(typesFile) ? '✅ 存在' : '❌ 不存在'}`);
console.log(`   组件文件: ${fs.existsSync(componentFile) ? '✅ 存在' : '❌ 不存在'}\n`);

// 2. 读取并分析类型文件
if (fs.existsSync(typesFile)) {
    const typesContent = fs.readFileSync(typesFile, 'utf-8');
    console.log('2. 类型文件分析:');
    console.log(`   文件大小: ${typesContent.length} 字节`);
    console.log(`   包含 "export interface Course": ${typesContent.includes('export interface Course') ? '✅ 是' : '❌ 否'}`);
    console.log(`   包含 "export default": ${typesContent.includes('export default') ? '⚠️ 是' : '✅ 否'}`);
    
    // 提取所有export
    const exports = typesContent.match(/export\s+(interface|type|class)\s+(\w+)/g) || [];
    console.log(`   导出项: ${exports.join(', ')}\n`);
    
    // 显示Course定义
    const courseMatch = typesContent.match(/export interface Course \{[\s\S]*?\n\}/);
    if (courseMatch) {
        console.log('3. Course接口定义:');
        console.log(courseMatch[0].split('\n').map(line => `   ${line}`).join('\n'));
    }
}

// 3. 分析组件导入
if (fs.existsSync(componentFile)) {
    const componentContent = fs.readFileSync(componentFile, 'utf-8');
    console.log('\n4. 组件导入分析:');
    
    const importMatch = componentContent.match(/import\s*\{[^}]*Course[^}]*\}\s*from\s*['"]([^'"]+)['"]/);
    if (importMatch) {
        console.log(`   导入语句: ${importMatch[0]}`);
        console.log(`   导入路径: ${importMatch[1]}`);
        
        // 检查路径解析
        const importPath = importMatch[1];
        if (importPath.startsWith('@/')) {
            const resolvedPath = path.join(__dirname, 'src', importPath.substring(2));
            console.log(`   解析路径: ${resolvedPath}`);
            console.log(`   路径存在: ${fs.existsSync(resolvedPath) ? '✅ 是' : '❌ 否'}`);
        }
    } else {
        console.log('   ❌ 未找到Course导入语句');
    }
}

console.log('\n═══════════════════════════════════════════════════════════');
