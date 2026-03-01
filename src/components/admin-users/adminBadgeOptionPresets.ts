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
        iconMainUrl: 'https://www.figma.com/api/mcp/asset/5efd2195-cc1e-4493-81a8-eab4bbb05439',
    },
    {
        key: 'active-member',
        name: 'Active Member',
        sessionsLabel: '10 Sessions',
        iconCircleClassName: 'bg-[rgba(52,199,89,0.1)]',
        iconType: 'single',
        iconMainUrl: 'https://www.figma.com/api/mcp/asset/508c646c-2c45-4858-af42-eafd9cdd8199',
    },
    {
        key: 'skill-exchanger',
        name: 'Skill Exchanger',
        sessionsLabel: '25 Sessions',
        iconCircleClassName: 'bg-[rgba(0,199,190,0.1)]',
        iconType: 'single',
        iconMainUrl: 'https://www.figma.com/api/mcp/asset/42f4ab5f-650f-44b8-acd5-1629ef11a91b',
    },
    {
        key: 'experienced',
        name: 'Experienced',
        sessionsLabel: '50 Sessions',
        iconCircleClassName: 'bg-[rgba(88,86,214,0.1)]',
        iconType: 'experienced',
        iconMainUrl: 'https://www.figma.com/api/mcp/asset/70f54a1f-8846-4e66-9427-6b0bdb911ee6',
        iconAccentRightUrl: 'https://www.figma.com/api/mcp/asset/fa232814-4dfb-4c3c-82ea-7c228a0f90e1',
        iconAccentLeftUrl: 'https://www.figma.com/api/mcp/asset/77a88868-abc1-4a51-af7d-c2ab6eefee42',
    },
    {
        key: 'core-contributor',
        name: 'Core Contributor',
        sessionsLabel: '80 Sessions',
        iconCircleClassName: 'bg-[rgba(255,204,0,0.1)]',
        iconType: 'core-contributor',
        iconMainUrl: 'https://www.figma.com/api/mcp/asset/c5d7fbad-a3af-462e-90b2-22f3dc12b818',
        iconAccentRightUrl: 'https://www.figma.com/api/mcp/asset/67616d89-58ce-41be-9560-bf010ca93ae0',
        iconAccentLeftUrl: 'https://www.figma.com/api/mcp/asset/67616d89-58ce-41be-9560-bf010ca93ae0',
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
