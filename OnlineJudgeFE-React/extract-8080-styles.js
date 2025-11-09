// 在 http://localhost:8080/problem 的浏览器控制台运行此脚本
// 用于提取 8080 Vue 版本的精确样式值

console.clear();
console.log('🔍 8080 题库列表页面精确样式提取\n');
console.log('=' .repeat(60));

const report = {};

// 1. Body 背景色
const bodyBg = getComputedStyle(document.body).backgroundColor;
console.log('\n📌 Body 背景:');
console.log('  backgroundColor:', bodyBg);
report.bodyBackground = bodyBg;

// 2. 主容器 (.content-app 或类似的)
const contentApp = document.querySelector('.content-app') || 
                   document.querySelector('[class*="content"]') ||
                   document.querySelector('main').parentElement;
if (contentApp) {
    const styles = getComputedStyle(contentApp);
    console.log('\n📌 主容器 (content-app):');
    console.log('  padding:', styles.padding);
    console.log('  paddingLeft:', styles.paddingLeft);
    console.log('  paddingRight:', styles.paddingRight);
    console.log('  backgroundColor:', styles.backgroundColor);
    console.log('  maxWidth:', styles.maxWidth);
    console.log('  width:', styles.width);
    console.log('  marginTop:', styles.marginTop);
    report.contentApp = {
        padding: styles.padding,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        backgroundColor: styles.backgroundColor,
        maxWidth: styles.maxWidth,
        width: styles.width,
        marginTop: styles.marginTop
    };
}

// 3. Panel/Card 容器
const panel = document.querySelector('.ivu-card') || 
              document.querySelector('[class*="panel"]') ||
              document.querySelector('.card');
if (panel) {
    const styles = getComputedStyle(panel);
    console.log('\n📌 Panel/Card:');
    console.log('  backgroundColor:', styles.backgroundColor);
    console.log('  borderRadius:', styles.borderRadius);
    console.log('  boxShadow:', styles.boxShadow);
    console.log('  padding:', styles.padding);
    console.log('  border:', styles.border);
    report.panel = {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        padding: styles.padding,
        border: styles.border
    };
}

// 4. 表格
const table = document.querySelector('table');
if (table) {
    const styles = getComputedStyle(table);
    console.log('\n📌 Table:');
    console.log('  fontSize:', styles.fontSize);
    console.log('  backgroundColor:', styles.backgroundColor);
    console.log('  width:', styles.width);
    report.table = {
        fontSize: styles.fontSize,
        backgroundColor: styles.backgroundColor,
        width: styles.width
    };
    
    // 表头
    const th = table.querySelector('th');
    if (th) {
        const thStyles = getComputedStyle(th);
        console.log('\n📌 Table Header (th):');
        console.log('  backgroundColor:', thStyles.backgroundColor);
        console.log('  color:', thStyles.color);
        console.log('  fontWeight:', thStyles.fontWeight);
        console.log('  padding:', thStyles.padding);
        console.log('  borderBottom:', thStyles.borderBottom);
        report.tableHeader = {
            backgroundColor: thStyles.backgroundColor,
            color: thStyles.color,
            fontWeight: thStyles.fontWeight,
            padding: thStyles.padding,
            borderBottom: thStyles.borderBottom
        };
    }
    
    // 表格行
    const tr = table.querySelector('tbody tr');
    if (tr) {
        const trStyles = getComputedStyle(tr);
        console.log('\n📌 Table Row (tr):');
        console.log('  backgroundColor:', trStyles.backgroundColor);
        console.log('  borderBottom:', trStyles.borderBottom);
        console.log('  hover时检查: 请手动hover一行查看背景色变化');
        report.tableRow = {
            backgroundColor: trStyles.backgroundColor,
            borderBottom: trStyles.borderBottom
        };
    }
    
    // 表格单元格
    const td = table.querySelector('td');
    if (td) {
        const tdStyles = getComputedStyle(td);
        console.log('\n📌 Table Cell (td):');
        console.log('  padding:', tdStyles.padding);
        console.log('  fontSize:', tdStyles.fontSize);
        console.log('  color:', tdStyles.color);
        report.tableCell = {
            padding: tdStyles.padding,
            fontSize: tdStyles.fontSize,
            color: tdStyles.color
        };
    }
}

// 5. 按钮
const button = document.querySelector('button') || document.querySelector('.ivu-btn');
if (button) {
    const styles = getComputedStyle(button);
    console.log('\n📌 Button:');
    console.log('  backgroundColor:', styles.backgroundColor);
    console.log('  color:', styles.color);
    console.log('  borderRadius:', styles.borderRadius);
    console.log('  padding:', styles.padding);
    console.log('  fontSize:', styles.fontSize);
    console.log('  fontWeight:', styles.fontWeight);
    report.button = {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight
    };
}

// 6. 难度标签 (Tag)
const tag = document.querySelector('.ivu-tag');
if (tag) {
    const styles = getComputedStyle(tag);
    console.log('\n📌 Difficulty Tag:');
    console.log('  backgroundColor:', styles.backgroundColor);
    console.log('  color:', styles.color);
    console.log('  padding:', styles.padding);
    console.log('  borderRadius:', styles.borderRadius);
    console.log('  fontSize:', styles.fontSize);
    
    // 检查不同难度的颜色
    console.log('\n  请分别检查简单/中等/困难标签的颜色:');
    const tags = document.querySelectorAll('.ivu-tag');
    tags.forEach((t, i) => {
        const tagStyle = getComputedStyle(t);
        console.log(`  Tag ${i+1}:`, tagStyle.backgroundColor, tagStyle.color);
    });
}

// 7. 侧边栏标签按钮
const sidebarButtons = document.querySelectorAll('.tag-btn');
if (sidebarButtons.length > 0) {
    const btnStyle = getComputedStyle(sidebarButtons[0]);
    console.log('\n📌 Sidebar Tag Buttons:');
    console.log('  margin:', btnStyle.margin);
    console.log('  marginRight:', btnStyle.marginRight);
    console.log('  marginBottom:', btnStyle.marginBottom);
    console.log('  borderRadius:', btnStyle.borderRadius);
}

// 8. 分页组件
const pagination = document.querySelector('.ivu-page');
if (pagination) {
    const styles = getComputedStyle(pagination);
    console.log('\n📌 Pagination:');
    console.log('  marginTop:', styles.marginTop);
    console.log('  fontSize:', styles.fontSize);
}

console.log('\n' + '='.repeat(60));
console.log('📊 完整报告对象:');
console.log(JSON.stringify(report, null, 2));
console.log('\n💡 提示: 复制上面的 report 对象，用于与 8081 对比');

