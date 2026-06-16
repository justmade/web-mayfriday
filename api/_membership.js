export const membershipTiers = {
  standard: {
    id: 'standard',
    name: '标准会员',
    nameEn: 'Standard Member',
  },
  premium: {
    id: 'premium',
    name: '尊享会员',
    nameEn: 'Premium Member',
  },
}

export function isMembershipActive(membership) {
  if (!membership || membership.status !== 'active' || !membership.expiresAt) return false
  return new Date(membership.expiresAt).getTime() > Date.now()
}

export function getMembershipStatus(membership) {
  if (!membership) return 'none'
  if (membership.status === 'cancelled') return 'cancelled'
  return isMembershipActive(membership) ? 'active' : 'expired'
}

export function calculateMembershipExpiry(period, startDate = new Date()) {
  const expiresAt = new Date(startDate)
  if (period === 'yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1)
  }
  return expiresAt.toISOString()
}

export function normalizeMembershipInput(input = {}) {
  const tier = membershipTiers[input.tier] ? input.tier : 'standard'
  const period = input.period === 'yearly' ? 'yearly' : 'monthly'
  const startedAt = new Date().toISOString()
  const expiresAt = input.expiresAt ? new Date(input.expiresAt).toISOString() : calculateMembershipExpiry(period, new Date(startedAt))

  return {
    tier,
    period,
    status: 'active',
    startedAt,
    expiresAt,
    note: String(input.note || '').trim().slice(0, 500),
    updatedAt: startedAt,
  }
}
