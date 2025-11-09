// 在 http://localhost:8081/problem 的浏览器控制台运行此脚本
// 用于提取 8081 React 版本的精确样式值

console.clear();
console.log('🔍 8081 题库列表页面精确样式提取\n');
console.log('=' .repeat(60));

const report = {};

// 1. Body 背景色
const bodyBg = getComputedStyle(document.body).backgroundColor;
console.log('\n📌 Body 背景:');
console.log('  backgroundColor:', bodyBg);
report.bodyBackground = bodyBg;

// 2. 主容器
const mainContainer = document.querySelector('[style*="padding: 0"]') || 
                      document.querySelector('.container').parentElement;
if (mainContainer) {
    const styles = getComputedStyle(mainContainer);
    console.log('\n📌 主容器:');
    console.log('  padding:', styles.padding);
    console.log('  paddingLeft:', styles.paddingLeft);
    console.log('  paddingRight:', styles.paddingRight);
    console.log('  backgroundColor:', styles.backgroundColor);
    console.log('  maxWidth:', styles.maxWidth);
    console.log('  width:', styles.width);
    console.log('  marginTop:', styles.marginTop);
    report.mainContainer = {
        padding: styles.padding,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        backgroundColor: styles.backgroundColor,
        maxWidth: styles.maxWidth,
        width: styles.width,
        marginTop: styles.marginTop
    };
}

// 3. Card 容器
const card = document.querySelector('[class*="rounded"]') || 
             document.querySelector('.card');
if (card) {
    const styles = getComputedStyle(card);
    console.log('\n📌 Card:');
    console.log('  backgroundColor:', styles.backgroundColor);
    console.log('  borderRadius:', styles.borderRadius);
    console.log('  boxShadow:', styles.boxShadow);
    console.log('  border:', styles.border);
    report.card = {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
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

// 5. 难度标签颜色
console.log('\n📌 Difficulty Tags (请查看):');
const badges = document.querySelectorAll('[class*="badge"], [class*="tag"]');
badges.forEach((badge, i) => {
    const styles = getComputedStyle(badge);
    console.log(`  Badge ${i+1}:`, {
        bg: styles.backgroundColor,
        color: styles.color,
        text: badge.textContent.trim()
    });
});

console.log('\n' + '='.repeat(60));
console.log('📊 完整报告:');
console.log(JSON.stringify(report, null, 2));
console.log('\n✅ 请复制上面的报告，并与 8081 的结果对比！');

