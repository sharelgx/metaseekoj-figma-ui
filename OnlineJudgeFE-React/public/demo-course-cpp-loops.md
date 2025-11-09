---
title: C++循环结构详解
language: cpp
difficulty: intermediate
duration: 45
author: 柳老师
tags: [for循环, while循环, do-while循环, 循环嵌套]
---

# C++循环结构

> 💡 **提示**：循环语句可以让程序重复执行操作，就像洗衣机的"洗→漂→脱"循环模式。

<!-- slide -->

## 一、for循环 —— "次数已知"的循环

当你知道循环次数时，使用 `for` 最方便。

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
>
> * `for(初始化; 条件; 更新)`
> * 初始化：计数变量
> * 条件：循环继续判断
> * 更新：每次循环后的操作

运行结果：

```
第 1 次循环
第 2 次循环
第 3 次循环
第 4 次循环
第 5 次循环
```

<!-- question:choice -->

[题目ID: auto]
[难度: easy]
[知识点: for循环]
测试题占位符：for循环执行次数判断

<!-- /question -->

<!-- slide -->

## 二、while循环 —— "条件未知"的循环

当循环次数未知，但有条件控制时，使用 `while`。

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

> 💡 **提示**：使用 `while` 时，循环变量必须改变，否则会陷入死循环。

<!-- question:choice -->

[题目ID: auto]
[难度: medium]
[知识点: while循环和死循环]
测试题占位符：while循环条件判断

<!-- /question -->

<!-- slide -->

## 三、do-while循环 —— "至少执行一次"

`do-while` 循环先执行，再判断条件。

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

> 💡 **提示**：无论条件是否成立，至少执行一次循环体。

<!-- slide -->

## 四、循环嵌套 —— "循环里还有循环"

多层循环控制，比如输出乘法表：

```cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 3; i++) {
        for (int j = 1; j <= 3; j++) {
            cout << i << " × " << j << " = " << i*j << "\t";
        }
        cout << endl;
    }
    return 0;
}
```

> 💡 **提示**：内层循环在每次外层循环时完整执行。

<!-- question:choice -->

[题目ID: auto]
[难度: medium]
[知识点: 循环嵌套]
测试题占位符：嵌套循环打印图案

<!-- /question -->

<!-- slide -->

## 闪卡识记 📚

<!-- flashcards:batch -->

### for循环组成

初始化、条件、更新
示例：`for(int i=0;i<10;i++)`

### while循环特点

先判断后执行，可能一次都不执行
示例：`while(condition){}`

### do-while循环特点

先执行后判断，至少执行一次
示例：`do{}while(condition);`

### 循环嵌套执行顺序

外层循环每执行一次，内层循环完整运行一次

### 避免死循环技巧

确保循环变量在循环体内变化，条件最终能变为false

### i++的含义

等价于 `i = i + 1`，循环变量自增1

<!-- flashcards:end -->

<!-- slide -->

## 课后总结

| 循环类型 | 执行条件 | 特点 | 适用场景 |
|---------|---------|------|---------|
| for循环 | 次数已知 | 结构清晰 | 固定次数重复 |
| while循环 | 条件未知 | 可能不执行 | 输入验证、等待 |
| do-while循环 | 先执行后判断 | 至少执行一次 | 菜单选择类程序 |
| 循环嵌套 | 多层控制 | 结构复杂 | 表格、图案输出 |

