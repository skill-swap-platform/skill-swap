import firstExchangeIcon from '@/assets/badges/first-exchange.svg'
import activeMemberIcon from '@/assets/badges/active-member.svg'
import skillExchangerIcon from '@/assets/badges/skill-exchanger.svg'
import experiencedIcon from '@/assets/badges/experienced.svg'
import coreContributorIcon from '@/assets/badges/core-contributor.svg'

export type AdminEarnedBadgeIconType = 'single' | 'experienced' | 'core-contributor'

export type AdminEarnedBadgePreset = {
    key: string
    name: string
    sessionsLabel: string
    iconCircleClassName: string
    iconType: AdminEarnedBadgeIconType
    iconMainUrl: string
    iconAccentRightUrl?: string
    iconAccentLeftUrl?: string
}

export type AdminLockedBadgePreset = {
    key: string
    name: string
    sampleProgressLabel: string
    sampleProgressWidth: number
}

const normalizeKey = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '')

export const ADMIN_LOCKED_BADGE_ICON_URL =
    'https://www.figma.com/api/mcp/asset/bd95f58e-29cd-40d8-9e45-5afd65ae2dd0'

export const ADMIN_EARNED_BADGE_PRESETS: AdminEarnedBadgePreset[] = [
    {
        key: 'first-exchange',
        name: 'First Exchange',
        sessionsLabel: '1 Session',
        iconCircleClassName: 'bg-[rgba(62,143,204,0.1)]',
        iconType: 'single',
        iconMainUrl: firstExchangeIcon,
    },
    {
        key: 'active-member',
        name: 'Active Member',
        sessionsLabel: '10 Sessions',
        iconCircleClassName: 'bg-[rgba(52,199,89,0.1)]',
        iconType: 'single',
        iconMainUrl: activeMemberIcon,
    },
    {
        key: 'skill-exchanger',
        name: 'Skill Exchanger',
        sessionsLabel: '25 Sessions',
        iconCircleClassName: 'bg-[rgba(0,199,190,0.1)]',
        iconType: 'single',
        iconMainUrl: skillExchangerIcon,
    },
    {
        key: 'experienced',
        name: 'Experienced',
        sessionsLabel: '50 Sessions',
        iconCircleClassName: 'bg-[rgba(88,86,214,0.1)]',
        iconType: 'single',
        iconMainUrl: experiencedIcon,
    },
    {
        key: 'core-contributor',
        name: 'Core Contributor',
        sessionsLabel: '80 Sessions',
        iconCircleClassName: 'bg-[rgba(255,204,0,0.1)]',
        iconType: 'single',
        iconMainUrl: coreContributorIcon,
    },
]

export const ADMIN_LOCKED_BADGE_PRESETS: AdminLockedBadgePreset[] = [
    {
        key: 'experienced',
        name: 'Experienced',
        sampleProgressLabel: '40 / 50',
        sampleProgressWidth: 78.03,
    },
    {
        key: 'core-contributor',
        name: 'Core Contributor',
        sampleProgressLabel: '40 / 80',
        sampleProgressWidth: 43.18,
    },
]

const earnedByName = new Map(
    ADMIN_EARNED_BADGE_PRESETS.map((preset) => [normalizeKey(preset.name), preset] as const)
)

const lockedByName = new Map(
    ADMIN_LOCKED_BADGE_PRESETS.map((preset) => [normalizeKey(preset.name), preset] as const)
)

export const getAdminEarnedBadgePreset = (
    badgeName: string
): AdminEarnedBadgePreset | undefined => earnedByName.get(normalizeKey(badgeName))

export const getAdminLockedBadgePreset = (
    badgeName: string
): AdminLockedBadgePreset | undefined => lockedByName.get(normalizeKey(badgeName))
