import { format, formatDistanceToNow } from 'date-fns'
export const formatDate = (date: Date | string, formatStr = 'PPP'): string => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, formatStr)
}
export const formatRelativeTime = (date: Date | string): string => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
}
export const formatNumber = (num: number): string => {
    if (num == null) return '0'
    return new Intl.NumberFormat('en-US').format(num)
}
export const formatPoints = (points: number): string => {
    if (points == null) return '0'
    if (points < 1000) return formatNumber(points)
    if (points < 1000000) return `${(points / 1000).toFixed(1)}K`
    return `${(points / 1000000).toFixed(1)}M`
}
export const formatPercentage = (value: number, decimals = 0): string => {
    if (value == null) return '0%'
    return `${value.toFixed(decimals)}%`
}
export const formatRating = (rating: number): string => {
    if (rating == null) return 'N/A'
    return `${rating.toFixed(1)}/5`
}
export const truncateText = (text: string, maxLength = 50): string => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
}
export const formatPointsRange = (min: number, max: number | null): string => {
    if (max === null) return `${formatNumber(min)}+`
    return `${formatNumber(min)} - ${formatNumber(max)}`
}
export const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}
export const getInitials = (name: string): string => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}
export const formatBadgeCategory = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1)
}
export const formatActivityTimeRange = (range: string): string => {
    const labels: Record<string, string> = {
        all_time: 'All Time',
        last_24_hours: 'Last 24 Hours',
        last_7_days: 'Last 7 Days',
        last_30_days: 'Last 30 Days',
    }
    return labels[range] || range
}
export const formatCurrency = (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}
export const pluralize = (count: number, singular: string, plural?: string): string => {
    if (count === 1) return `${count} ${singular}`
    return `${count} ${plural || singular + 's'}`
}
