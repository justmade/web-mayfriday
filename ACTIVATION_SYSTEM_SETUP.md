# Course Activation System - Setup Guide

## Overview

The course activation system provides:
- **SMS verification code login** for Chinese users
- **30-day JWT tokens** for seamless login experience
- **Single device restriction** to prevent account sharing
- **Device fingerprinting** for security
- **Vercel KV database** for user data storage

## Prerequisites

1. **Vercel Account** with a deployed project
2. **Alibaba Cloud Account** (阿里云账号) for SMS service
3. **Activation codes** for your courses

---

## Step 1: Set Up Vercel KV Database

### 1.1 Create KV Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Redis-compatible key-value store)
6. Choose a name (e.g., `mayfriday-kv`)
7. Select region closest to your users (e.g., Hong Kong for China)
8. Click **Create**

### 1.2 Connect to Project

1. After creation, click **Connect to Project**
2. Select your `web-mayfriday` project
3. Environment variables will be automatically added:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 1.3 Local Development

Create `.env.local` file in your project root:

```bash
# Vercel KV (copy from Vercel Dashboard > Storage > your-kv > .env.local)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-super-secret-random-key-min-32-chars-change-this

# SMS Settings (will be added later)
SMS_ACCESS_KEY_ID=your_alibaba_cloud_access_key_id
SMS_ACCESS_KEY_SECRET=your_alibaba_cloud_access_key_secret
SMS_SIGN_NAME=五月星期五
SMS_TEMPLATE_CODE=SMS_123456789
```

⚠️ **Important**: Add `.env.local` to `.gitignore` to prevent committing secrets!

---

## Step 2: Configure Alibaba Cloud SMS Service (阿里云短信服务)

### 2.1 Open SMS Service

1. Login to [Alibaba Cloud Console](https://www.aliyun.com/)
2. Search for "短信服务" (SMS Service)
3. Click **免费开通** (Free Trial) if not activated

### 2.2 Apply for SMS Signature (申请签名)

1. Go to **国内消息 > 签名管理** (Domestic Message > Signature Management)
2. Click **添加签名** (Add Signature)
3. Fill in:
   - **签名名称**: `五月星期五` (Your brand name)
   - **签名来源**: 企事业单位的全称或简称 (Company name)
   - **适用场景**: 验证码 (Verification code)
   - Upload business license or proof
4. Submit and **wait 1-2 business days for approval**

### 2.3 Apply for SMS Template (申请模板)

1. Go to **国内消息 > 模板管理** (Domestic Message > Template Management)
2. Click **添加模板** (Add Template)
3. Fill in:
   - **模板类型**: 验证码 (Verification Code)
   - **模板名称**: 用户登录验证码 (User Login Code)
   - **模板内容**: `您的验证码是${code}，5分钟内有效，请勿泄露。`
4. Submit and **wait for approval**
5. Once approved, **copy the Template Code** (e.g., `SMS_123456789`)

### 2.4 Get Access Key

1. Click your avatar in top-right > **AccessKey 管理**
2. Click **创建 AccessKey**
3. **Save these securely** (you'll only see the secret once!):
   - Access Key ID: `LTAI5t...`
   - Access Key Secret: `xyz123...`

### 2.5 Top Up Account (充值)

1. Go to **费用中心 > 充值** (Billing Center > Top Up)
2. Add at least **¥10-20** for testing
3. SMS cost: **¥0.045/message**

### 2.6 Update Environment Variables

Add to Vercel project environment variables:

```
SMS_ACCESS_KEY_ID=LTAI5t...
SMS_ACCESS_KEY_SECRET=xyz123...
SMS_SIGN_NAME=五月星期五
SMS_TEMPLATE_CODE=SMS_123456789
```

---

## Step 3: Set Up Environment Variables on Vercel

1. Go to **Vercel Dashboard** > Your Project > **Settings** > **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `JWT_SECRET` | `random-32-char-string` | JWT signing secret (generate securely!) |
| `SMS_ACCESS_KEY_ID` | Your Alibaba Cloud Access Key ID | For SMS service |
| `SMS_ACCESS_KEY_SECRET` | Your Alibaba Cloud Access Key Secret | For SMS service |
| `SMS_SIGN_NAME` | `五月星期五` | Your approved SMS signature |
| `SMS_TEMPLATE_CODE` | `SMS_123456789` | Your approved SMS template code |

3. **Redeploy** your application for variables to take effect

---

## Step 4: Create Activation Codes

### 4.1 Activation Code Format

Activation codes should be:
- **Uppercase alphanumeric** (e.g., `KNIT2024-ABC123`)
- **Unique** for each course purchase
- **Easy to type** (avoid similar characters like 0/O, 1/I/l)

### 4.2 Manual Creation (For Testing)

Use Vercel KV Dashboard or API to create codes:

**Example code data:**
```json
{
  "courseId": 1,
  "used": false,
  "usedBy": null,
  "createdAt": "2026-02-20",
  "expiresAt": null
}
```

**Using Vercel KV Dashboard:**
1. Go to **Vercel Dashboard > Storage > Your KV > Data**
2. Click **Add Key**
3. Key: `code:KNIT2024-TEST01`
4. Value: Paste the JSON above
5. Click **Save**

### 4.3 Batch Generation Script (Recommended)

Create `scripts/generate-codes.js`:

```javascript
import { kv } from '@vercel/kv'

async function generateActivationCodes(courseId, count) {
  const codes = []

  for (let i = 0; i < count; i++) {
    // Generate random code
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
    const code = `KNIT2024-${randomPart}`

    // Save to KV
    await kv.set(`code:${code}`, {
      courseId,
      used: false,
      usedBy: null,
      createdAt: new Date().toISOString(),
      expiresAt: null
    })

    codes.push(code)
  }

  return codes
}

// Generate 10 codes for course ID 1
const codes = await generateActivationCodes(1, 10)
console.log('Generated activation codes:', codes)
```

Run with: `node scripts/generate-codes.js`

---

## Step 5: Testing the System

### 5.1 Test Activation Flow

1. **Get a test activation code** (from Step 4)
2. Go to `/activate` page
3. Enter activation code
4. Enter your phone number (Chinese 11-digit number: `138****8888`)
5. Click "获取验证码" (Get Code)
6. **Development mode**: Code will be shown in alert
7. **Production mode**: You'll receive SMS
8. Enter the 6-digit code
9. Click "激活课程" (Activate Course)
10. Should redirect to `/my-courses`

### 5.2 Test Login Flow

1. Go to `/login` page
2. Enter the same phone number
3. Get SMS code
4. Login
5. Should see your activated courses

### 5.3 Test Single Device Restriction

1. Login on Device A (e.g., laptop)
2. Login on Device B (e.g., phone) with same account
3. Device A should be automatically logged out
4. Try to access `/my-courses` on Device A
5. Should see "账号已在其他设备登录" error

### 5.4 Test Course Access Protection

1. Login with an account
2. Try to access a course you haven't activated
3. Should see "You have not purchased this course" error

---

## Step 6: Course ID Mapping

Make sure your courses in `src/data/courses.js` have unique `id` fields that match the `courseId` in activation codes:

```javascript
export const courses = [
  {
    id: 1,  // ← This ID must match activation code's courseId
    title: "基础编织入门课程",
    // ...
  },
  {
    id: 2,
    title: "围巾编织专项课",
    // ...
  }
]
```

---

## Security Best Practices

### ✅ Do's

- ✅ Use strong JWT secrets (32+ random characters)
- ✅ Keep AccessKey secrets in environment variables only
- ✅ Enable HTTPS for production (Vercel does this automatically)
- ✅ Monitor SMS usage to detect abuse
- ✅ Set rate limits on SMS sending (60 seconds between requests)
- ✅ Validate phone numbers server-side

### ❌ Don'ts

- ❌ Never commit `.env.local` or secrets to Git
- ❌ Never expose AccessKey in frontend code
- ❌ Never disable device fingerprint verification
- ❌ Never skip SMS verification in production
- ❌ Never use default JWT secret in production

---

## Cost Estimation

### Alibaba Cloud SMS
- **Price**: ¥0.045 per SMS
- **Expected usage**: ~20 logins/day = 600/month
- **Monthly cost**: ¥27 (~$3.75 USD)

### Vercel KV (Redis)
- **Free tier**: 256MB storage, 3000 requests/day
- **Expected usage**: Well within free tier
- **Monthly cost**: ¥0 (free)

### Total Monthly Cost
- **¥27** (~$3.75 USD) - Very affordable!

---

## Troubleshooting

### SMS Not Received

1. **Check signature/template approval status** (must be approved)
2. **Check account balance** (need at least ¥1)
3. **Check phone number format** (must be 11 digits starting with 1)
4. **Check SMS service region** (must be China Domestic)
5. **Check AccessKey permissions**

### "Activation code invalid"

1. Verify code exists in KV database (key: `code:YOUR-CODE`)
2. Check if code has already been used (`used: true`)
3. Check if code has expired

### "Account logged in on another device"

This is **expected behavior** for single-device restriction. User needs to:
1. Click "重新登录" (Login Again)
2. Get new SMS code
3. Login on current device

### Development Mode - SMS Alert Not Showing

Make sure `NODE_ENV=development` is set, or check browser console for the code.

---

## Next Steps

1. ✅ Complete Vercel KV setup
2. ✅ Configure Alibaba Cloud SMS (wait for approval)
3. ✅ Generate activation codes
4. ✅ Test the complete flow
5. ✅ Deploy to production
6. 📱 Send activation codes to customers via Taobao messaging

---

## Support

If you encounter issues:
- Check browser console for error messages
- Check Vercel deployment logs
- Check Alibaba Cloud SMS console for failed sends
- Verify all environment variables are set correctly

For Alibaba Cloud SMS support: https://help.aliyun.com/product/44282.html
