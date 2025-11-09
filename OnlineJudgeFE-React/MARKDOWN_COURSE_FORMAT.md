# MetaSeekOJ 课件 Markdown 格式规范 v1.0

**适用于**：ChatGPT、豆包、Kimi、文心一言等 AI 工具生成课件  
**更新日期**：2025-11-03  
**状态**：✅ 标准规范

---

## 📋 快速说明

这是 MetaSeekOJ 智慧课堂的**统一课件格式**。教师可以：
1. 用 ChatGPT/豆包等 AI 工具按此格式生成课件
2. 上传到系统后自动转换为幻灯片
3. 在编辑器中调整和插入测试题

---

## 🎯 基本结构

```markdown
---
title: 课程标题
language: scratch | python | cpp
difficulty: beginner | intermediate | advanced
duration: 45
author: 教师姓名
---

# 第一章节（自动生成第1页幻灯片）

章节内容...

## 小节标题（自动生成第2页幻灯片）

小节内容...

<!-- slide -->
强制分页标记（另起新的幻灯片）

<!-- question:choice -->
这里会自动插入选择题占位符

<!-- question:code -->
这里会自动插入编程题占位符

<!-- flashcard -->
这里标记一个闪卡知识点
```

---

## 📖 元信息（课件头部）

```markdown
---
title: C++循环结构详解
language: cpp
difficulty: intermediate
duration: 45
author: 张老师
tags: [循环, for, while, 基础语法]
---
```

**字段说明**：
- `title`：课程标题（必填）
- `language`：编程语言（scratch/python/cpp）
- `difficulty`：难度（beginner/intermediate/advanced）
- `duration`：课程时长（分钟）
- `author`：教师姓名
- `tags`：知识点标签（可选）

---

## 📑 内容分页规则

### 规则 1：按标题自动分页

```markdown
# 一级标题 → 独立一页（幻灯片1）

内容1...

## 二级标题 → 独立一页（幻灯片2）

内容2...

### 三级标题 → 不分页，与上页合并

内容3...
```

### 规则 2：手动强制分页

```markdown
这是第一页的内容。

<!-- slide -->

这是第二页的内容（强制另起一页）。
```

### 规则 3：长内容自动分页

```markdown
这是一段很长的内容...
（超过500字符自动分页）
...继续很长的内容
```

---

## 💻 代码块

### 基本代码块

```markdown
## for循环语法

\```cpp
for (int i = 0; i < 10; i++) {
    cout << i << endl;
}
\```
```

**自动识别**：
- ✅ 自动检测代码语言（cpp/python/scratch）
- ✅ 自动添加语法高亮
- ✅ 标记 `has_code = true`

### 带行号的代码

```markdown
\```cpp {1,3-5}
int main() {
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }
    cout << sum << endl;
    return 0;
}
\```
```

**说明**：`{1,3-5}` 表示高亮第1行和第3-5行

### 可运行的代码（连接判题系统）

```markdown
\```cpp:runnable
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}
\```
```

**`:runnable` 标记**：
- 自动添加"运行代码"按钮
- 学生可以在线修改和运行
- 连接到 MetaSeekOJ 判题系统

---

## 📝 测试题占位符

### 选择题占位符

```markdown
## 知识点讲解...

讲解完成，现在测试一下！

<!-- question:choice -->
[题目ID: 101]
[难度: easy]
[知识点: for循环基础]

自动插入选择题。教师在编辑器中可以：
- 选择已有题目
- 新建题目
- 调整难度
```

### 编程题占位符

```markdown
## 实践练习

<!-- question:code -->
[题目ID: 202]
[难度: medium]
[语言: cpp]
[题目: 循环求和]

自动插入编程题。学生点击后：
1. 跳转到代码编辑器
2. 完成编程
3. 提交判题
4. 返回课堂
```

### 判断题占位符

```markdown
<!-- question:judge -->
[题目ID: 303]

插入判断题（对/错）
```

### 填空题占位符

```markdown
<!-- question:fill -->
[题目ID: 404]

插入填空题
```

---

## 📚 闪卡知识点标记

### 自动生成闪卡

```markdown
## 重要概念

<!-- flashcard:start -->
**正面**：什么是for循环？

**背面**：for循环是C++中用于重复执行代码块的控制结构。

**代码示例**：
\```cpp
for (int i = 0; i < 10; i++) {
    cout << i << endl;
}
\```
<!-- flashcard:end -->
```

**自动处理**：
- 提取"正面"、"背面"、"代码示例"
- 创建 Flashcard 对象
- 关联到课程

### 批量闪卡

```markdown
<!-- flashcards:batch -->

### 变量
定义：存储数据的容器
示例：`int x = 10;`

### 数组
定义：相同类型元素的集合
示例：`int arr[5] = {1,2,3,4,5};`

### 循环
定义：重复执行代码的结构
示例：`for (int i = 0; i < 10; i++) { }`

<!-- flashcards:end -->
```

**自动处理**：
- 每个 `###` 标题生成一张闪卡
- 标题 = 正面
- 内容 = 背面
- 代码 = 示例

---

## 🖼️ 图片和媒体

### 普通图片

```markdown
![Scratch界面](https://example.com/scratch-interface.png)
```

### 带说明的图片

```markdown
![](https://example.com/image.png)
*图1：Scratch编辑器界面*
```

### 视频（可选）

```markdown
<!-- video -->
[https://www.youtube.com/watch?v=xxx]
```

---

## ✨ 特殊标记

### 提示框

```markdown
> 💡 **提示**：for循环的三个表达式都可以省略
```

### 警告框

```markdown
> ⚠️ **注意**：循环变量要正确初始化，避免死循环
```

### 重点标记

```markdown
**重点**：for循环适用于已知循环次数的情况
```

### 演讲者备注（只有教师端显示）

```markdown
<!-- note -->
这里给学生多留2分钟思考时间
注意观察学生表情，看是否理解
<!-- /note -->
```

---

## 📏 完整示例

```markdown
---
title: C++循环结构详解
language: cpp
difficulty: intermediate
duration: 45
author: 张老师
tags: [循环, for, while, do-while]
---

# C++循环结构详解

欢迎来到今天的课堂！

## 本节课学习目标

1. 理解循环的概念和作用
2. 掌握 for、while、do-while 三种循环
3. 能够根据问题选择合适的循环
4. 理解循环嵌套

<!-- slide -->

## 什么是循环？

循环是程序中重复执行某段代码的结构。

**生活中的例子**：
- 🏃 每天跑步10圈
- 📖 每天背10个单词
- 🎮 游戏中的循环判断

<!-- slide -->

## for 循环

### 语法格式

\```cpp
for (初始化; 条件判断; 更新) {
    // 循环体
}
\```

### 示例代码

\```cpp {2-4}
// 输出1到10的数字
for (int i = 1; i <= 10; i++) {
    cout << i << " ";
}
// 输出：1 2 3 4 5 6 7 8 9 10
\```

> 💡 **提示**：i++ 等价于 i = i + 1

<!-- slide -->

## 随堂练习

我们来测试一下掌握情况！

<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: for循环基础]

题目：下列关于for循环的说法，哪个是**正确的**？

A. for循环必须指定循环次数
B. for循环的三个表达式都可以省略 ✓
C. for循环不能嵌套使用
D. for循环至少执行一次

正确答案：B
解析：for循环的三个表达式（初始化、条件、更新）都是可选的，甚至可以写成 for(;;) 表示无限循环。
<!-- /question -->

<!-- slide -->

## while 循环

while循环适用于**不确定循环次数**的情况。

### 语法格式

\```cpp
while (条件) {
    // 循环体
}
\```

### 示例：猜数字游戏

\```cpp:runnable
#include <iostream>
using namespace std;

int main() {
    int secret = 42;
    int guess;
    
    while (guess != secret) {
        cout << "猜一个数字：";
        cin >> guess;
        
        if (guess > secret) cout << "太大了！" << endl;
        else if (guess < secret) cout << "太小了！" << endl;
    }
    
    cout << "恭喜你猜对了！" << endl;
    return 0;
}
\```

<!-- note -->
这里让学生自己运行代码，体会while循环的特点
提醒学生：while循环可能一次都不执行
<!-- /note -->

<!-- slide -->

## 闪卡识记时间 📚

接下来5分钟，请记住以下重要概念！

<!-- flashcards:batch -->

### for循环
用于已知循环次数的情况
示例：`for (int i = 0; i < 10; i++) { }`

### while循环
用于循环次数不确定的情况
示例：`while (condition) { }`

### do-while循环
至少执行一次的循环
示例：`do { } while (condition);`

### 循环嵌套
循环内部再包含循环
示例：九九乘法表

<!-- flashcards:end -->

<!-- slide -->

## 循环嵌套

### 概念

循环内部可以再包含循环，称为**循环嵌套**。

### 示例：打印图形

\```cpp
// 打印直角三角形
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        cout << "* ";
    }
    cout << endl;
}

/* 输出：
*
* *
* * *
* * * *
* * * * *
*/
\```

<!-- slide -->

## 编程实践

现在轮到你了！完成下面的编程题。

<!-- question:code -->
[题目ID: auto]
[难度: medium]
[语言: cpp]
[时间限制: 1000ms]
[内存限制: 256MB]

**题目**：使用循环计算1+2+3+...+100的和

**输入**：无

**输出**：一个整数，表示求和结果

**提示**：
- 使用for循环或while循环
- 注意变量的初始化

**标准答案**：
\```cpp
#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 100; i++) {
        sum += i;
    }
    cout << sum << endl;
    return 0;
}
\```

**测试用例**：
- 输入：（无）
- 输出：5050
<!-- /question -->

<!-- slide -->

## 课堂小结

今天我们学习了：
✅ for循环
✅ while循环
✅ do-while循环
✅ 循环嵌套

<!-- slide -->

## 课后作业

1. 完成练习题 1-5
2. 复习今天的闪卡
3. 完成编程作业：九九乘法表

<!-- question:homework -->
[作业ID: auto]
[截止日期: 2025-11-10]
[总分: 100]

作业内容自动关联...
<!-- /question -->
```

---

## 🔖 特殊标记说明

### 1. 分页标记

| 标记 | 作用 | 示例 |
|------|------|------|
| `# 一级标题` | 自动生成新页 | `# 第一章` |
| `## 二级标题` | 自动生成新页 | `## 小节1` |
| `<!-- slide -->` | 强制分页 | 任意位置插入 |

### 2. 测试题标记

| 标记 | 题型 | 说明 |
|------|------|------|
| `<!-- question:choice -->` | 选择题 | 单选或多选 |
| `<!-- question:judge -->` | 判断题 | 对或错 |
| `<!-- question:fill -->` | 填空题 | 文本填空 |
| `<!-- question:code -->` | 编程题 | 在线编程 |

### 3. 闪卡标记

| 标记 | 作用 | 说明 |
|------|------|------|
| `<!-- flashcard:start -->` | 单个闪卡开始 | 手动定义 |
| `<!-- flashcard:end -->` | 单个闪卡结束 | 配对使用 |
| `<!-- flashcards:batch -->` | 批量闪卡开始 | AI生成 |
| `<!-- flashcards:end -->` | 批量闪卡结束 | 配对使用 |

### 4. 其他标记

| 标记 | 作用 | 示例 |
|------|------|------|
| `<!-- note -->` | 演讲者备注 | 只有教师看到 |
| `<!-- video -->` | 视频嵌入 | URL链接 |
| `> 💡 **提示**：` | 提示框 | 高亮显示 |
| `> ⚠️ **注意**：` | 警告框 | 红色提示 |

---

## 🎨 样式增强

### 高亮文本

```markdown
这是**重点内容**（粗体）
这是*斜体文本*
这是`代码片段`
```

### 列表

```markdown
**有序列表**：
1. 第一步
2. 第二步
3. 第三步

**无序列表**：
- 知识点A
- 知识点B
- 知识点C
```

### 表格

```markdown
| 循环类型 | 适用场景 | 示例 |
|---------|---------|------|
| for | 已知次数 | `for (int i = 0; i < 10; i++)` |
| while | 次数不定 | `while (condition)` |
| do-while | 至少一次 | `do { } while (condition)` |
```

---

## 🤖 AI 生成 Prompt 模板（优化版）

### ChatGPT 专用 Prompt ⭐ 推荐

```
你是MetaSeekOJ课堂系统的课件生成助手。请严格按照以下格式生成《C++循环结构》教学课件。

📋 格式规范（必须严格遵守）：

【1. 元信息区（YAML格式）】
---
title: 课程标题
language: cpp
difficulty: intermediate
duration: 45
author: 教师姓名
tags: [标签1, 标签2, 标签3]
---

注意：
- language 必须是：scratch | python | cpp
- difficulty 必须是：beginner | intermediate | advanced
- duration 是数字（分钟）
- 不要使用 grade, subject, keywords 等字段

【2. 内容区】
- 使用 # 一级标题（生成标题页）
- 使用 ## 二级标题（每个知识点独立一页）
- 代码块使用：```cpp

【3. 测试题占位符（重要！）】
格式如下：
```markdown
<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: for循环基础]

这里只是占位符，不要写具体题目内容。
教师会在系统中从题库选择具体题目。
<!-- /question -->
```

注意：
- 必须有闭合标签 <!-- /question -->
- 不要在这里写具体的选项A、B、C、D
- 只写知识点描述即可

【4. 闪卡批量生成】
格式如下：
```markdown
<!-- flashcards:batch -->

### for循环的组成
初始化、条件判断、更新操作三部分
示例：`for (int i = 0; i < 10; i++)`

### while循环特点
先判断后执行，可能一次都不执行
示例：`while (condition) { }`

### do-while循环特点
先执行后判断，至少执行一次
示例：`do { } while (condition);`

<!-- flashcards:end -->
```

注意：
- 每张卡片使用 ### 标题
- 标题就是闪卡正面
- 后面的内容是闪卡背面
- 如果有代码，用反引号包裹

【5. 强制分页】
如果需要在不是标题的地方分页，使用：
<!-- slide -->

📝 内容要求：
- 主题：C++循环结构（for、while、do-while、循环嵌套）
- 适合：初中生（14岁）
- 时长：45分钟
- 至少4个完整代码示例（使用 ```cpp 代码块）
- 在3个位置插入测试题占位符（使用上述格式）
- 生成6-8张闪卡（使用 ### 格式）
- 每个知识点添加提示框（> 💡 **提示**：）
- 最后添加总结表格

请严格按照上述格式生成完整的 Markdown 文档。不要偏离格式规范！
```

### 豆包专用 Prompt（更详细）

```
你是一位优秀的编程教师，请为我创建一份标准的 MetaSeekOJ 课件。

课程主题：Python 列表和元组
目标学生：初学者（零基础）
课程时长：45分钟

格式规范（严格遵守）：

1. 文件开头：
---
title: 课程标题
language: python
difficulty: beginner
duration: 45
author: AI助教
tags: [列表, 元组, 数据结构]
---

2. 内容结构：
- 使用 # 一级标题（会生成独立幻灯片）
- 使用 ## 二级标题（也会生成独立幻灯片）
- 每个知识点讲完后插入测试题标记

3. 测试题标记（至少插入3处）：
<!-- question:choice -->
[题目ID: auto]
[难度: easy]
这里会插入选择题
<!-- /question -->

4. 闪卡生成（课程中间位置）：
<!-- flashcards:batch -->
### 概念1
定义...
示例...

### 概念2
定义...
示例...
<!-- flashcards:end -->

5. 代码示例（至少3个）：
```python
# 示例代码
list1 = [1, 2, 3, 4, 5]
```

请生成完整的 Markdown 课件。
```

---

## 📤 教师上传和编辑流程

### 步骤1：AI生成课件

```
教师 → ChatGPT
输入：Prompt（使用上述模板）
    ↓
ChatGPT 生成完整 Markdown
    ↓
教师复制 Markdown 内容
```

### 步骤2：上传到系统

```tsx
// 上传 Markdown 文件
<Upload
  accept=".md,.markdown"
  beforeUpload={validateMarkdown}
  customRequest={handleMarkdownUpload}
>
  <Button>📄 上传 Markdown 课件</Button>
</Upload>

// 或者直接粘贴
<Textarea
  placeholder="粘贴 Markdown 内容..."
  value={markdownContent}
  onChange={(e) => setMarkdownContent(e.target.value)}
  rows={20}
/>
<Button onClick={handleSubmit}>
  ✅ 提交课件
</Button>
```

### 步骤3：系统自动解析

```python
# 后端解析 Markdown
import markdown
from bs4 import BeautifulSoup
import yaml

def parse_markdown_course(markdown_text):
    # 1. 提取元信息
    if markdown_text.startswith('---'):
        parts = markdown_text.split('---', 2)
        metadata = yaml.safe_load(parts[1])
        content = parts[2]
    else:
        metadata = {}
        content = markdown_text
    
    # 2. 转换为 HTML
    html = markdown.markdown(
        content,
        extensions=[
            'fenced_code',
            'codehilite',
            'tables',
            'toc'
        ]
    )
    
    # 3. 提取特殊标记
    soup = BeautifulSoup(html, 'html.parser')
    
    # 找出所有测试题占位符
    questions = soup.find_all(string=re.compile('<!-- question:'))
    
    # 找出所有闪卡标记
    flashcards = extract_flashcards(soup)
    
    return {
        'metadata': metadata,
        'html_content': html,
        'questions': questions,
        'flashcards': flashcards
    }
```

### 步骤4：预览和调整

```tsx
// 课件预览页面
<div className="grid grid-cols-2 gap-4">
  {/* 左侧：Markdown 源码 */}
  <Card>
    <CardHeader>
      <CardTitle>📝 源码编辑</CardTitle>
    </CardHeader>
    <CardContent>
      <CodeEditor
        value={markdownContent}
        onChange={setMarkdownContent}
        language="markdown"
        height="600px"
      />
    </CardContent>
  </Card>

  {/* 右侧：实时预览 */}
  <Card>
    <CardHeader>
      <CardTitle>👁️ 预览效果</CardTitle>
    </CardHeader>
    <CardContent>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedHTML }}
      />
    </CardContent>
  </Card>
</div>

{/* 底部：解析结果 */}
<Card className="mt-4">
  <CardContent>
    <div className="flex gap-4">
      <Badge>📄 {slideCount} 页幻灯片</Badge>
      <Badge>✏️ {questionCount} 道测试题</Badge>
      <Badge>📚 {flashcardCount} 张闪卡</Badge>
      <Badge>💻 {codeBlockCount} 个代码示例</Badge>
    </div>
  </CardContent>
</Card>

{/* 操作按钮 */}
<div className="mt-4 flex gap-2">
  <Button onClick={saveDocument}>💾 保存文档</Button>
  <Button onClick={generateSlides}>🎬 生成幻灯片</Button>
  <Button onClick={previewSlides}>👁️ 预览幻灯片</Button>
</div>
```

### 步骤5：插入具体测试题

```tsx
// 幻灯片编辑器中
<div className="slide-item">
  <div className="slide-preview">
    第 5 页
    <!-- question:choice -->
    [占位符：选择题]
  </div>
  
  <Button onClick={() => showQuestionPicker(5)}>
    ✏️ 选择题目
  </Button>
</div>

// 题目选择器弹窗
<Dialog open={showPicker}>
  <DialogContent>
    <h3>选择要插入的题目</h3>
    
    {/* 方式1：从题库选择 */}
    <Tabs defaultValue="library">
      <TabsList>
        <TabsTrigger value="library">题库</TabsTrigger>
        <TabsTrigger value="create">新建</TabsTrigger>
      </TabsList>
      
      <TabsContent value="library">
        {/* 题目列表 */}
        {questions.map(q => (
          <Card onClick={() => selectQuestion(q.id)}>
            <CardContent>
              <p>{q.content}</p>
              <Badge>{q.difficulty}</Badge>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      
      <TabsContent value="create">
        {/* 新建题目表单 */}
        <QuestionForm onSubmit={handleCreateQuestion} />
      </TabsContent>
    </Tabs>
    
    <DialogFooter>
      <Button onClick={confirmInsert}>✅ 插入题目</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🔄 完整工作流程图

```
┌─────────────────────────────────────────────────────────┐
│ 步骤1：AI 生成 Markdown                                 │
├─────────────────────────────────────────────────────────┤
│ ChatGPT/豆包/Kimi                                       │
│ └─> 按照统一格式生成                                    │
│     └─> 包含元信息、标题、代码、测试题标记、闪卡        │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤2：教师上传 Markdown                                │
├─────────────────────────────────────────────────────────┤
│ • 方式A：上传 .md 文件                                  │
│ • 方式B：直接粘贴 Markdown 文本                         │
│ • 方式C：在线 Markdown 编辑器                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤3：系统自动解析                                     │
├─────────────────────────────────────────────────────────┤
│ ✅ 提取元信息（title、language、difficulty）            │
│ ✅ 转换 Markdown → HTML                                 │
│ ✅ 识别测试题占位符（<!-- question:choice -->）         │
│ ✅ 识别闪卡标记（<!-- flashcards:batch -->）            │
│ ✅ 识别代码块（```cpp）                                 │
│ ✅ 计算预估幻灯片数量                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤4：教师预览和编辑                                   │
├─────────────────────────────────────────────────────────┤
│ 左侧：Markdown 源码编辑器                               │
│ 右侧：实时预览                                          │
│ 底部：解析统计                                          │
│   - 📄 12页幻灯片                                       │
│   - ✏️ 3个测试题占位符                                  │
│   - 📚 8张闪卡                                          │
│   - 💻 5个代码示例                                      │
│                                                         │
│ 教师可以：                                              │
│ • 调整 Markdown 内容                                    │
│ • 修改测试题位置                                        │
│ • 增删闪卡                                              │
│ • 调整代码示例                                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤5：生成幻灯片                                       │
├─────────────────────────────────────────────────────────┤
│ POST /api/classroom/documents/{id}/generate_slides/    │
│                                                         │
│ 后端处理：                                              │
│ 1. 按标题和标记分页                                     │
│ 2. 生成 Slide 对象（12条记录）                          │
│ 3. 标记测试题位置（has_question=true）                  │
│ 4. 存储到 classroom_slides 表                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤6：关联具体测试题                                   │
├─────────────────────────────────────────────────────────┤
│ 幻灯片编辑器：                                          │
│                                                         │
│ Slide 5: [测试题占位符]                                │
│ ↓ 点击"选择题目"                                        │
│ 弹出题库：                                              │
│ • 题目101：关于for循环...  ← 选择                       │
│ • 题目102：while循环...                                 │
│ • 题目103：循环嵌套...                                  │
│                                                         │
│ POST /api/classroom/slides/5/attach_question/          │
│ { "question_id": 101 }                                 │
│                                                         │
│ 更新：Slide 5 → question_id = 101                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤7：创建课堂会话并开始授课                           │
├─────────────────────────────────────────────────────────┤
│ POST /api/classroom/sessions/                          │
│ { "document_id": 1, "course_id": 1 }                   │
│                                                         │
│ → 获取所有幻灯片                                        │
│ → Reveal.js 渲染                                        │
│ → WebSocket 连接                                        │
│ → 开始实时授课                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 数据库字段映射

### Markdown → Document

```python
# 元信息 → classroom_documents
{
    'title': metadata['title'],          # → title
    'content_type': 'markdown',          # → content_type
    'content_html': rendered_html,       # → content_html
    'course_id': course_id,              # → course (FK)
    'slide_count': len(slides)           # → slide_count (自动计算)
}
```

### Markdown → Slides

```python
# 每页幻灯片 → classroom_slides
for index, slide_content in enumerate(slides):
    {
        'document_id': document.id,
        'slide_index': index,
        'content_html': slide_content,
        'has_code': detect_code(slide_content),
        'code_language': extract_language(slide_content),
        'has_question': has_question_marker(slide_content),
        'question_id': None  # 教师后续指定
    }
```

### Markdown → Flashcards

```python
# 闪卡批量 → classroom_flashcards
for flashcard_data in extracted_flashcards:
    {
        'flashcard_set_id': flashcard_set.id,
        'front_content': flashcard_data['front'],
        'back_content': flashcard_data['back'],
        'code_example': flashcard_data['code'],
        'difficulty': flashcard_data.get('difficulty', 'medium'),
        'order_index': flashcard_data['index']
    }
```

---

## 🎯 优势分析

### 为什么用 Markdown + AI？

1. **降低门槛** ✅
   - 教师不需要学复杂的编辑器
   - Markdown 简单易学
   - AI 自动生成，节省时间

2. **标准化** ✅
   - 统一的格式规范
   - 便于系统解析
   - 易于质量控制

3. **灵活性** ✅
   - 支持多种 AI 工具
   - 教师可以手动调整
   - 可以混合使用

4. **可移植性** ✅
   - Markdown 是纯文本
   - 易于版本控制
   - 可以导出分享

---

## 📁 需要创建的功能模块

```
src/
├── pages/creative-classroom/teacher/
│   ├── DocumentEditor.tsx        # Markdown 编辑器
│   ├── SlideEditor.tsx           # 幻灯片编辑器
│   └── TeachingSession.tsx       # 授课页面
│
├── components/classroom/
│   ├── MarkdownUpload.tsx        # Markdown 上传组件
│   ├── SlidePreview.tsx          # 幻灯片预览
│   ├── QuestionPicker.tsx        # 题目选择器
│   └── RevealSlideshow.tsx       # Reveal.js 包装组件
│
└── utils/
    ├── markdown-parser.ts        # Markdown 解析工具
    └── slide-generator.ts        # 幻灯片生成器
```

---

这个方案如何？需要我开始实现**Markdown 编辑器**和**幻灯片生成器**吗？🚀
