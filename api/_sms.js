/**
 * 阿里云号码认证服务（PNVS）封装
 * Alibaba Cloud Phone Number Verification Service wrapper
 */

import Core from '@alicloud/pop-core'

function getSmsClient() {
  return new Core({
    accessKeyId: process.env.SMS_ACCESS_KEY_ID,
    accessKeySecret: process.env.SMS_ACCESS_KEY_SECRET,
    endpoint: 'https://dypnsapi.aliyuncs.com',
    apiVersion: '2017-05-25',
  })
}

export function isSmsConfigured() {
  return !!(process.env.SMS_ACCESS_KEY_ID &&
            process.env.SMS_ACCESS_KEY_SECRET &&
            process.env.SMS_SIGN_NAME &&
            process.env.SMS_TEMPLATE_CODE)
}

// 发送验证码（调用方传入 code，PNVS 负责发送和托管以供后续核验）
export async function sendSmsCode(phone) {
  const client = getSmsClient()
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const result = await client.request('SendSmsVerifyCode', {
    PhoneNumber: phone,
    SignName: process.env.SMS_SIGN_NAME,
    TemplateCode: process.env.SMS_TEMPLATE_CODE,
    TemplateParam: JSON.stringify({ code, min: '5' }),
  }, { method: 'POST' })
  if (result.Code !== 'OK') throw new Error(result.Message)
  return result.Model.BizId
}

// 核验验证码（PASS = 成功）
export async function checkSmsCode(phone, code) {
  const client = getSmsClient()
  const result = await client.request('CheckSmsVerifyCode', {
    PhoneNumber: phone,
    VerifyCode: code,
  }, { method: 'POST' })
  return result.Code === 'OK' && result.Model?.VerifyResult === 'PASS'
}
