import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { RoleSelection } from '@/components/feedback/RoleSelection'
import { SessionCompletedScreen } from '@/components/feedback/SessionCompletedScreen'
import { GeneralReview } from '@/components/feedback/GeneralReview'
import { RoleSpecificFeedback } from '@/components/feedback/RoleSpecificFeedback'
import { SecondRolePrompt } from '@/components/feedback/SecondRolePrompt'
import { ReportIssueScreen } from '@/components/feedback/ReportIssueScreen'
import { BadgeUnlockedScreen } from '@/components/gamification/BadgeUnlockedScreen'
import { sessionService } from '@/api/services/session.service'
import { userService } from '@/api/services/user.service'
import { gamificationService } from '@/api/services/gamification.service'
import { Loader2, AlertCircle } from 'lucide-react'

type Step =
    | 'badge-unlocked'
    | 'completed'
    | 'general-review'
    | 'role-selection'
    | 'role-feedback'
    | 'second-role-prompt'
    | 'second-role-feedback'
    | 'report-issue'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isRealUUID = (id: string | undefined | null): boolean => {
    if (!id) return false
    return UUID_REGEX.test(id)
}
const ErrorBanner: React.FC<{
    message: string
    onRetry?: () => void
    onSkip?: () => void
}> = ({ message, onRetry, onSkip }) => (
    <div className="w-full max-w-6xl mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">Something went wrong</p>
            <p className="text-xs text-red-600 mt-0.5">{message}</p>
        </div>
        <div className="flex gap-2">
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-3 py-1.5 text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                    Retry
                </button>
            )}
            {onSkip && (
                <button
                    onClick={onSkip}
                    className="px-3 py-1.5 text-xs font-bold bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-lg transition-colors"
                >
                    Skip anyway
                </button>
            )}
        </div>
    </div>
)
export const SessionFeedback: React.FC = () => {
    const navigate = useNavigate()
    const { sessionId } = useParams<{ sessionId: string }>()

    const [currentStep, setCurrentStep] = useState<Step>('completed')
    const [selectedRole, setSelectedRole] = useState<'teaching' | 'learning' | 'both'>('learning')
    const [currentFeedbackRole, setCurrentFeedbackRole] = useState<'teaching' | 'learning'>('learning')

    const [sessionData, setSessionData] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [unlockedBadges, setUnlockedBadges] = useState<any[]>([])
    const [nextBadge, setNextBadge] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [stepError, setStepError] = useState<{
        message: string
        onRetry: () => void
        onSkip: () => void
    } | null>(null)
    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) {
                setError('Session ID is missing. Please select a session from your history.')
                setIsLoading(false)
                return
            }

            if (!isRealUUID(sessionId)) {
                setError('Invalid session ID. Please select a valid session from your history.')
                setIsLoading(false)
                return
            }

            // Restore Demo Mode for this specific UUID
            if (sessionId?.toLowerCase().includes('3b6f1d2e')) {
                setSessionData({
                    id: sessionId,
                    partnerName: 'Test Partner',
                    skill: { name: 'React & AI Assistant' },
                    swapRequest: { id: 'd979cfc4-b2e0-4d0a-93cd-6f1f8c53f01e' }
                })
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)

                if (!currentUser) {
                    const userRes = await userService.getCurrentProfile()
                    if (userRes.success) setCurrentUser(userRes.data)
                }

                const response = await sessionService.getSessionDetail(sessionId)
                if (response.success) {
                    setSessionData(response.data)

                    const badgeRes = await gamificationService.checkBadges()
                    if (badgeRes.success && badgeRes.data.newlyUnlocked.length > 0) {
                        setUnlockedBadges(badgeRes.data.newlyUnlocked)
                        setNextBadge(badgeRes.data.nextBadge)
                        setCurrentStep('badge-unlocked')
                    }
                } else {
                    setError('Session not found. It may have been deleted or you do not have access.')
                }
            } catch (err: any) {
                console.error('Failed to fetch session detail:', err)
                setError(err.response?.data?.message || 'Could not load session details from the server.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchSession()
    }, [sessionId])
    const getPartner = () => {
        if (!sessionData || !currentUser) return null
        return sessionData.host?.id === currentUser.id
            ? sessionData.attendee
            : sessionData.host
    }

    const partner = getPartner()
    const partnerName = partner?.userName || sessionData?.partnerName || 'Your Partner'
    const handleBadgeContinue = () => setCurrentStep('completed')
    const handleSessionContinue = () => setCurrentStep('general-review')

    const handleGeneralReviewSubmit = async (data: any) => {
        setStepError(null)

        const swapRequestId = sessionData?.swapRequest?.id

        if (!isRealUUID(swapRequestId)) {
            console.warn('swapRequestId is missing or invalid — skipping review submission.')
            setCurrentStep('role-selection')
            return
        }

        try {
            await sessionService.submitReview({
                swapRequestId,
                comment: data.comment || '',
                isPublic: data.isPublic ?? false,
            })
            console.log(' General Review submitted successfully.')
            setCurrentStep('role-selection')
        } catch (err: any) {
            console.error('General Review Submission Failed:', err)
            setStepError({
                message: err.response?.data?.message || 'Failed to submit your review. Please try again.',
                onRetry: () => handleGeneralReviewSubmit(data),
                onSkip: () => {
                    setStepError(null)
                    setCurrentStep('role-selection')
                },
            })
        }
    }

    const handleRoleContinue = (role: 'teaching' | 'learning' | 'both') => {
        setSelectedRole(role)
        setCurrentFeedbackRole(role === 'both' ? 'learning' : role)
        setCurrentStep('role-feedback')
    }

    const submitRoleFeedback = async (
        role: 'teaching' | 'learning',
        data: { ratings: Record<string, number>; improvements: string; bestPart: string }
    ): Promise<void> => {
        const rawSessionId = sessionId || sessionData?.id

        if (!isRealUUID(rawSessionId)) {
            throw new Error(`Invalid session ID: "${rawSessionId}"`)
        }

        const { ratings, improvements, bestPart } = data

        const basePayload = {
            sessionId: rawSessionId,
            communication: Number(ratings.communication) || 5,
            strengths: bestPart || '',
            improvements: improvements || '',
            onTime: true,
        }

        const payload =
            role === 'teaching'
                ? {
                    ...basePayload,
                    sessionFocus: Number(ratings.sessionFocus) || 5,
                    activeParticipation: Number(ratings.activeParticipation) || 5,
                    openToFeedback: Number(ratings.openToFeedback) || 5,
                }
                : {
                    ...basePayload,
                    learningFocus: Number(ratings.learningFocus) || 5,
                    clarity: Number(ratings.clarity) || 5,
                    patience: Number(ratings.patience) || 5,
                    sessionStructure: Number(ratings.sessionStructure) || 5,
                }

        console.log(`📤 Submitting ${role} feedback:`, payload)
        await sessionService.submitRoleFeedback(role, payload)
        console.log(`✅ ${role} feedback submitted successfully.`)
    }

    const handleRoleFeedbackSubmit = async (data: any) => {
        setStepError(null)

        try {
            await submitRoleFeedback(currentFeedbackRole, data)

            if (selectedRole === 'both' && currentFeedbackRole === 'learning') {
                setCurrentStep('second-role-prompt')
            } else {
                handleFlowComplete()
            }
        } catch (err: any) {
            console.error(` ${currentFeedbackRole} Feedback Submission Failed:`, err)
            setStepError({
                message: err.response?.data?.message || `Failed to submit ${currentFeedbackRole} feedback. Please try again.`,
                onRetry: () => handleRoleFeedbackSubmit(data),
                onSkip: () => {
                    setStepError(null)
                    if (selectedRole === 'both' && currentFeedbackRole === 'learning') {
                        setCurrentStep('second-role-prompt')
                    } else {
                        handleFlowComplete()
                    }
                },
            })
        }
    }

    const handleSecondRoleContinue = () => {
        setCurrentFeedbackRole('teaching')
        setCurrentStep('second-role-feedback')
    }

    const handleSecondRoleFeedbackSubmit = async (data: any) => {
        setStepError(null)

        try {
            await submitRoleFeedback('teaching', data)
            handleFlowComplete()
        } catch (err: any) {
            console.error('Second Role Feedback Submission Failed:', err)
            setStepError({
                message: err.response?.data?.message || 'Failed to submit teaching feedback. Please try again.',
                onRetry: () => handleSecondRoleFeedbackSubmit(data),
                onSkip: () => {
                    setStepError(null)
                    handleFlowComplete()
                },
            })
        }
    }

    const handleFlowComplete = () => {
        console.log('Flow completed! Redirecting to session history...')
        navigate('/session-history')
    }

    const handleReportIssue = async (data: any) => {
        try {
            await sessionService.reportIssue(sessionId || sessionData?.id, data)
            alert('Issue reported successfully.')
            setCurrentStep('completed')
        } catch (err) {
            console.error('Failed to report issue:', err)
            alert('Failed to report issue. The reporting feature is not yet available.')
        }
    }

    const renderCurrentStep = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[24px] shadow-sm border border-gray-100">
                    <Loader2 className="w-12 h-12 text-[#3E8FCC] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Preparing your session details...</p>
                </div>
            )
        }

        if (error || !sessionData) {
            return (
                <div className="p-10 text-center bg-white rounded-[24px] shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-red-500 mb-6">{error || 'Session data could not be loaded.'}</p>
                    <button
                        onClick={() => navigate('/session-history')}
                        className="px-6 py-2 bg-[#3E8FCC] text-white rounded-xl font-bold"
                    >
                        Go Back to Sessions
                    </button>
                </div>
            )
        }

        switch (currentStep) {
            case 'badge-unlocked':
                return (
                    <BadgeUnlockedScreen
                        unlockedBadges={unlockedBadges}
                        nextBadge={nextBadge}
                        onContinue={handleBadgeContinue}
                    />
                )
            case 'completed':
                return (
                    <SessionCompletedScreen
                        partnerName={partnerName}
                        onContinue={handleSessionContinue}
                        onReport={() => setCurrentStep('report-issue')}
                    />
                )
            case 'general-review':
                return (
                    <GeneralReview
                        partnerName={partnerName}
                        swapRequestId={sessionData?.swapRequest?.id || ''}
                        onSubmit={handleGeneralReviewSubmit}
                        onSkip={() => setCurrentStep('role-selection')}
                    />
                )
            case 'role-selection':
                return <RoleSelection onContinue={handleRoleContinue} />
            case 'role-feedback':
                return (
                    <RoleSpecificFeedback
                        partnerName={partnerName}
                        sessionId={sessionId || sessionData?.id || ''}
                        role={currentFeedbackRole}
                        onSubmit={handleRoleFeedbackSubmit}
                        onSkip={handleFlowComplete}
                    />
                )
            case 'second-role-prompt':
                return (
                    <SecondRolePrompt
                        onContinue={handleSecondRoleContinue}
                        onSkip={handleFlowComplete}
                    />
                )
            case 'second-role-feedback':
                return (
                    <RoleSpecificFeedback
                        partnerName={partnerName}
                        sessionId={sessionId || sessionData?.id || ''}
                        role="teaching"
                        onSubmit={handleSecondRoleFeedbackSubmit}
                        onSkip={handleFlowComplete}
                    />
                )
            case 'report-issue':
                return (
                    <ReportIssueScreen
                        onBack={() => setCurrentStep('completed')}
                        onSubmit={handleReportIssue}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            <Header activeTab="Sessions" />
            <main className="flex-1 flex flex-col items-center justify-center py-8 px-4">
                {stepError && (
                    <ErrorBanner
                        message={stepError.message}
                        onRetry={stepError.onRetry}
                        onSkip={stepError.onSkip}
                    />
                )}
                {renderCurrentStep()}
            </main>
            <Footer />
        </div>
    )
}