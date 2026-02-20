/**
 * 创建测试激活码
 * Create test activation code
 */

import { set } from '../api/_redis.js'
import 'dotenv/config'

async function createTestCode() {
  const testCode = 'KNIT2024-TEST01'

  const codeData = {
    courseId: 1,  // 对应"基础编织入门课程"
    used: false,
    usedBy: null,
    createdAt: new Date().toISOString(),
    expiresAt: null
  }

  try {
    await set(`code:${testCode}`, codeData)

    console.log('✅ 测试激活码创建成功！')
    console.log('')
    console.log('激活码：', testCode)
    console.log('课程ID：', codeData.courseId)
    console.log('')
    console.log('现在您可以用这个激活码测试了：')
    console.log('1. 运行: npm run dev')
    console.log('2. 访问: http://localhost:5173/activate')
    console.log('3. 输入激活码:', testCode)
    console.log('4. 输入手机号: 13800138000')
    console.log('5. 获取验证码并完成激活')

  } catch (error) {
    console.error('❌ 创建失败:', error.message)
    console.log('')
    console.log('请检查：')
    console.log('1. .env.local 文件是否配置了 REDIS_URL')
    console.log('2. Redis 连接是否正常')
  }
}

createTestCode()
