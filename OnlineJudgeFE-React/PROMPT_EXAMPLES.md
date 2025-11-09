# 🤖 AI 生成课件 - Prompt 示例库

**适用于**：ChatGPT、豆包、Kimi、文心一言  
**更新日期**：2025-11-03

---

## 📋 标准 Prompt 模板（通用版）

### ⭐ ChatGPT 4 推荐 Prompt

```
你是MetaSeekOJ智慧课堂的课件生成专家。请严格按照以下格式生成教学课件。

🎯 课程信息：
- 主题：[C++循环结构]
- 编程语言：[cpp]
- 难度：[intermediate]
- 学生年龄：[13-15岁]
- 课时：[45分钟]

📋 格式规范（严格遵守）：

1️⃣ 元信息区（必须放在文件开头）：
---
title: 课程标题
language: cpp
difficulty: intermediate
duration: 45
author: 教师姓名
tags: [标签1, 标签2]
---

字段说明：
- language: scratch | python | cpp（三选一）
- difficulty: beginner | intermediate | advanced（三选一）
- duration: 数字（分钟）
- tags: 数组格式

2️⃣ 内容结构：
# 课程总标题

## 第一个知识点
讲解内容...

```cpp
代码示例
```

> 💡 **提示**：重要提示内容

<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: for循环基础]

测试题占位符说明。
**不要写具体题目内容！教师会在系统中选择。**
<!-- /question -->

## 第二个知识点
...

3️⃣ 闪卡生成（在课程中间位置插入）：
<!-- flashcards:batch -->

### 概念1名称
概念1的详细解释
示例代码：`code example`

### 概念2名称
概念2的详细解释
示例代码：`code example`

<!-- flashcards:end -->

⚠️ 重要提示：
- 测试题标记只是**占位符**，不要写具体的选项A、B、C、D
- 闪卡使用 ### 标题格式，不要用 Q1/A1 格式
- 代码块必须指定语言：```cpp 或 ```python
- 每个 ## 标题会自动生成一页幻灯片
- 使用 <!-- slide --> 可以强制分页

📝 内容要求：
- 至少4个完整代码示例
- 在3个位置插入测试题占位符
- 生成6-8张闪卡
- 每个知识点后添加提示框
- 最后添加总结表格

现在请生成完整的 Markdown 课件。
```

---

## 🎯 针对不同主题的 Prompt

### Python 课件 Prompt

```
生成《Python列表和字典》课件

🎯 课程信息：
- 主题：Python列表和字典
- 语言：python
- 难度：beginner
- 学生：零基础（12-14岁）
- 课时：45分钟

📋 元信息（必须）：
---
title: Python列表和字典
language: python
difficulty: beginner
duration: 45
author: AI助教
tags: [列表, 字典, 数据结构, 索引]
---

📝 内容要求：
1. 列表的创建和访问
2. 列表的常用方法（append, insert, remove）
3. 字典的创建和访问
4. 字典的常用方法（keys, values, items）
5. 列表和字典的区别

代码示例：
- 至少5个 ```python 代码块
- 每个知识点配一个示例

测试题占位符：
- 在列表讲解后插入1个
- 在字典讲解后插入1个
- 在对比章节插入1个

闪卡：
- 生成6-8张（列表方法、字典方法、关键概念）
- 使用 <!-- flashcards:batch --> 和 ### 格式

格式示例：
## 列表的创建

```python
# 创建列表
fruits = ['apple', 'banana', 'orange']
print(fruits[0])  # 输出：apple
```

> 💡 **提示**：列表索引从0开始

<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: 列表索引]

测试题占位符
<!-- /question -->

请严格按照格式生成。
```

### Scratch 课件 Prompt

```
生成《Scratch动画制作入门》课件

🎯 课程信息：
- 主题：Scratch动画制作
- 语言：scratch
- 难度：beginner
- 学生：零基础（8-12岁）
- 课时：45分钟

📋 元信息：
---
title: Scratch动画制作入门
language: scratch
difficulty: beginner
duration: 45
author: AI助教
tags: [Scratch, 动画, 角色, 舞台]
---

📝 内容要求：
1. 认识Scratch界面
2. 添加角色和背景
3. 让角色移动
4. 添加声音效果
5. 完整的动画项目

特殊说明：
- Scratch 没有代码，用图片和步骤说明
- 可以插入 Scratch 积木块的图片
- 测试题改为判断题或选择题

示例：
## 让角色移动

**步骤1**：选择"小猫"角色
**步骤2**：拖动"移动10步"积木到脚本区
**步骤3**：点击绿旗运行

> 💡 **提示**：可以修改步数，试试不同的效果

<!-- question:judge -->
[题目ID: auto]
[难度: easy]
判断题占位符
<!-- /question -->

请生成。
```

---

## 📝 修正后的完整示例

基于 ChatGPT 的输出，我给您一个修正版本：

```markdown
---
title: C++循环结构详解
language: cpp
difficulty: intermediate
duration: 45
author: 柳老师
tags: [for循环, while循环, do-while循环, 循环嵌套]
---

# C++循环结构

> 💡 **提示**：循环语句可以让计算机"重复做事"。就像洗衣机的"洗→漂→脱"循环模式一样，程序也能重复执行某些操作，直到满足退出条件。

<!-- slide -->

## 一、for循环 —— "次数已知"的循环

当我们**知道要重复多少次**时，用 `for` 最方便。

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << "第 " << i << " 次循环" << endl;
    }
    return 0;
}
```

> 💡 **提示**：
> `for(初始化; 条件; 更新)`
> - 初始化：定义计数变量
> - 条件：判断是否继续循环
> - 更新：每次循环后执行的操作

运行结果：
```
第 1 次循环
第 2 次循环
第 3 次循环
第 4 次循环
第 5 次循环
```

<!-- slide -->

## 随堂练习：for循环

<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: for循环基础]

这里是测试题占位符。
教师在系统中选择具体题目：例如"for循环执行次数判断"
<!-- /question -->

<!-- slide -->

## 二、while循环 —— "条件未知"的循环

当我们**不知道循环次数**，但**有一个条件**控制时，用 `while`。

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 5;
    while (n > 0) {
        cout << "倒计时：" << n << endl;
        n--;
    }
    cout << "发射！" << endl;
    return 0;
}
```

输出结果：
```
倒计时：5
倒计时：4
倒计时：3
倒计时：2
倒计时：1
发射！
```

> 💡 **提示**：使用 `while` 时，一定要注意**循环变量的变化**，否则会陷入死循环！

<!-- slide -->

## 随堂练习：while循环

<!-- question:choice -->
[题目ID: auto]
[难度: medium]
[知识点: while循环和死循环]

测试题占位符：while循环相关题目
<!-- /question -->

<!-- slide -->

## 三、do-while循环 —— "至少执行一次"

`do-while` 循环会**先执行，再判断条件**。

```cpp
#include <iostream>
using namespace std;

int main() {
    int num = 3;
    do {
        cout << "num = " << num << endl;
        num--;
    } while (num > 0);
    return 0;
}
```

> 💡 **提示**：与 `while` 不同，`do-while` **无论条件是否成立，都会先执行一次**。

<!-- slide -->

## 四、循环嵌套 —— "循环里还有循环"

有时候我们需要**多层循环**，比如输出乘法表。

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            cout << i << " × " << j << " = " << i * j << "\t";
        }
        cout << endl;
    }
    return 0;
}
```

> 💡 **提示**：内层循环会在每次外层循环执行时**全部运行一遍**。

<!-- slide -->

## 随堂练习：循环嵌套

<!-- question:code -->
[题目ID: auto]
[难度: medium]
[语言: cpp]
[知识点: 循环嵌套]

编程题占位符：使用循环嵌套打印图案
<!-- /question -->

<!-- slide -->

## 闪卡识记时间 📚

接下来5分钟，请记住以下重要概念！

<!-- flashcards:batch -->

### for循环的三部分
初始化、条件判断、更新操作
示例：`for (int i = 0; i < 10; i++)`

### while循环特点
先判断后执行，可能一次都不执行
示例：`while (condition) { }`

### do-while循环特点
先执行后判断，至少执行一次
示例：`do { } while (condition);`

### 循环嵌套的执行顺序
外层循环每执行一次，内层循环完整执行一遍

### 如何避免死循环
确保循环变量在循环体内发生变化

### i++的含义
等价于 i = i + 1，循环变量自增1

<!-- flashcards:end -->

<!-- slide -->

## 课后总结

| 循环类型 | 执行条件 | 特点 | 适用场景 |
|---------|---------|------|---------|
| for循环 | 次数已知 | 结构清晰 | 固定次数重复 |
| while循环 | 条件未知 | 可能不执行 | 输入验证、等待 |
| do-while循环 | 先执行后判断 | 至少执行一次 | 菜单选择类程序 |
| 循环嵌套 | 多层控制 | 结构复杂 | 表格、图案输出 |
```

---

## 🔍 格式对比

### ❌ 错误格式（ChatGPT容易犯的错误）

```markdown
---
grade: "初中"           # ❌ 应该用 difficulty
subject: "C++基础"      # ❌ 不需要这个字段
keywords: [循环]        # ❌ 应该用 tags
---

<!-- question:choice -->
**练习题：** 选择正确答案     # ❌ 不要写具体题目
A. 选项1
B. 选项2
# ❌ 没有闭合标签

**Q1:** 什么是for循环？    # ❌ 闪卡格式错误
**A1:** 答案...
```

### ✅ 正确格式

```markdown
---
title: C++循环结构详解
language: cpp
difficulty: intermediate
duration: 45
author: 教师姓名
tags: [for循环, while循环, 循环嵌套]
---

# C++循环结构

## for循环讲解

```cpp
for (int i = 0; i < 10; i++) {
    cout << i << endl;
}
```

> 💡 **提示**：i++ 表示自增1

<!-- slide -->

## 随堂练习

<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: for循环基础]

测试题占位符。
教师在系统中从题库选择具体题目。
<!-- /question -->

<!-- slide -->

## 知识点识记

<!-- flashcards:batch -->

### for循环的组成
初始化、条件判断、更新三部分
示例：`for (int i = 0; i < 10; i++)`

### while循环特点
先判断后执行，可能不执行
示例：`while (condition) { }`

<!-- flashcards:end -->
```

---

## 💡 给 AI 的额外说明

### 如果 AI 还是出错，添加这段

```
⚠️ 特别注意（非常重要）：

1. 测试题占位符格式：
   正确 ✅：
   <!-- question:choice -->
   [题目ID: auto]
   测试题占位符
   <!-- /question -->
   
   错误 ❌：
   <!-- question:choice -->
   A. 选项1
   B. 选项2
   （不要写具体选项！）

2. 闪卡格式：
   正确 ✅：
   ### 概念名称
   概念解释
   
   错误 ❌：
   **Q1:** 问题
   **A1:** 答案
   （不要用Q/A格式！）

3. 元信息字段：
   正确 ✅：
   language: cpp
   difficulty: intermediate
   tags: [标签1, 标签2]
   
   错误 ❌：
   grade: "初中"
   subject: "编程"
   keywords: [...]
   （不要用这些字段！）

请严格遵守格式！
```

---

## 📚 实际使用案例

### 案例1：让ChatGPT生成Python课件

**输入Prompt**：
```
使用上述标准格式，生成《Python函数入门》课件
- 语言：python
- 难度：beginner
- 时长：40分钟
- 包含：函数定义、参数、返回值、作用域
- 插入3个测试题占位符
- 生成6张闪卡
```

**ChatGPT 应该生成**：
```markdown
---
title: Python函数入门
language: python
difficulty: beginner
duration: 40
author: AI助教
tags: [函数, 参数, 返回值, 作用域]
---

# Python函数入门

## 什么是函数

函数是一段可重复使用的代码块...

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
```

<!-- question:choice -->
[题目ID: auto]
[难度: easy]
[知识点: 函数定义]

测试题占位符
<!-- /question -->

<!-- slide -->

## 闪卡识记

<!-- flashcards:batch -->

### 函数定义
使用def关键字定义函数
示例：`def func_name():`

### 函数参数
函数可以接收参数进行处理
示例：`def greet(name):`

<!-- flashcards:end -->
```

---

## 🎯 Prompt 优化技巧

### 技巧 1：明确格式示例

在 Prompt 中直接给出正确格式示例：

```
格式示例（请严格模仿）：

<!-- question:choice -->
[题目ID: auto]
[难度: easy]
测试题占位符
<!-- /question -->

<!-- flashcards:batch -->
### 概念名称
概念解释
示例代码
<!-- flashcards:end -->
```

### 技巧 2：强调"不要做"的事情

```
⚠️ 禁止事项：
❌ 不要在测试题标记里写A、B、C、D选项
❌ 不要使用 grade、subject 等字段
❌ 不要用 Q1/A1 格式写闪卡
❌ 不要忘记闭合标签 <!-- /question -->
```

### 技巧 3：分步骤生成

```
请分两步生成：

步骤1：先生成元信息和大纲
（我会检查是否符合格式）

步骤2：再生成完整内容
（包含代码、测试题标记、闪卡）
```

---

## 🔄 循环修正法

如果 AI 生成的格式不对，可以这样修正：

```
你生成的内容有几处格式问题，请修正：

问题1：元信息区缺少 language 字段
应该添加：language: cpp

问题2：测试题标记没有闭合
应该在每个 <!-- question:xxx --> 后添加 <!-- /question -->

问题3：闪卡格式不对
应该改为：
### 概念名称
概念解释

请重新生成完整的 Markdown 文档。
```

---

## 📁 保存为模板

建议教师将优化后的 Prompt 保存为模板：

```
/home/sharelgx/MetaSeekOJdev/prompts/
├── cpp-course-template.txt
├── python-course-template.txt
├── scratch-course-template.txt
└── general-template.txt
```

每次使用时：
1. 复制模板
2. 修改主题和要求
3. 粘贴到 ChatGPT
4. 生成课件

---

这个改进方案如何？需要我：
1. 创建更详细的 Prompt 模板文件吗？
2. 或者直接开始实现 Markdown 上传和解析功能？

您觉得 Prompt 还需要怎么优化？🤔

