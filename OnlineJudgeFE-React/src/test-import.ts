// 测试导入
export { Course, Document, Slide } from './types/classroom'

// 再导出一次
export type { Course as CourseType } from './types/classroom'

console.log('测试文件加载成功')
