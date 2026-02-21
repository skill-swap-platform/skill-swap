import React, { useState, useEffect, useCallback } from 'react'
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
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'
interface Toast { id: number; message: string; type: ToastType }

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
            <div
                key={t.id}
                onClick={() => onDismiss(t.id)}
                className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all animate-in slide-in-from-top-2 cursor-pointer ${t.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800'
                    : t.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-blue-50 border border-blue-200 text-blue-800'
                    }`}
            >
                {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                {t.message}
            </div>
        ))}
    </div>
)

type Step =
    | 'badge-unlocked'
    | 'completed'
    | 'general-review'
    | 'role-selection'
    | 'role-feedback'
    | 'second-role-prompt'
    | 'second-role-feedback'
    | 'report-issue'
const isUUID = (id: string | null | undefined): boolean => {
    if (!id) return false;
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
};

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
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
    }, [])

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) {
                setError('Session ID is missing. Please select a session from your history.')
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)

                if (!currentUser) {
                    const userRes = await userService.getCurrentProfile()
                    if (userRes.success) {
                        setCurrentUser(userRes.data)
                    }
                }

                if (sessionId === '3b6f1d2e-1111-4b2c-9c2f-1a2b3c4d5e6f') {
                    setSessionData({
                        id: '3b6f1d2e-1111-4b2c-9c2f-1a2b3c4d5e6f',
                        partnerName: 'Test Partner',
                        skill: { name: 'JavaScript Basics' },
                        swapRequest: { id: 'd979cfc4-b2e0-4d0a-93cd-6f1f8c53f01e' }
                    })
                    setIsLoading(false)
                    return
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
                    setError('Session not found in the database.')
                }
            } catch (err: any) {
                console.error('Failed to fetch session detail:', err)
                setError(err.response?.data?.message || 'Could not load session details from the server.')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSession()
    }, [sessionId, currentUser])
    const getPartner = () => {
        if (!sessionData || !currentUser) return null
        if (sessionData.host?.id === currentUser.id) return sessionData.attendee
        return sessionData.host
    }
    const partner = getPartner()
    const partnerName = partner?.userName || sessionData?.partnerName || 'Alex Davidson'

    const handleBadgeContinue = () => {
        setCurrentStep('completed')
    }

    const isUUID = (id: string | undefined): boolean => {
        if (!id) return false;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    };

    const handleSessionContinue = () => {
        setCurrentStep('general-review')
    }

    const handleGeneralReviewSubmit = async (data: any) => {
        try {
            const rawSwapId = sessionData?.swapRequest?.id;

            if (isUUID(rawSwapId)) {
                await sessionService.submitReview({
                    swapRequestId: rawSwapId!,
                    comment: data.comment || '',
                    isPublic: data.isPublic ?? true
                })
                showToast('Review submitted successfully! ✓', 'success')
            } else {
                showToast('Review saved (demo session)', 'info')
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to submit review. Please try again.'
            showToast(msg, 'error')
            console.error('[GeneralReview] Submission failed:', err)
        }
        setCurrentStep('role-selection')
    }

    const handleRoleContinue = (role: 'teaching' | 'learning' | 'both') => {
        setSelectedRole(role)
        setCurrentFeedbackRole(role === 'both' ? 'learning' : role)
        setCurrentStep('role-feedback')
    }

    const handleRoleFeedbackSubmit = async (data: any) => {
        const { ratings, improvements, bestPart } = data;

        try {
            const rawSessionId = sessionId || sessionData?.id;
            const isTeaching = currentFeedbackRole === 'teaching';

            const feedbackPayload = isTeaching ? {
                sessionId: rawSessionId || '',
                communication: Number(ratings.communication) || 5,
                strengths: bestPart || 'N/A',
                improvements: improvements || 'N/A',
                sessionFocus: Number(ratings.sessionFocus) || 5,
                activeParticipation: Number(ratings.activeParticipation) || 5,
                openToFeedback: Number(ratings.openToFeedback) || 5,
                onTime: true
            } : {
                sessionId: rawSessionId || '',
                communication: Number(ratings.communication) || 5,
                strengths: bestPart || 'N/A',
                improvements: improvements || 'N/A',
                learningFocus: Number(ratings.learningFocus) || 5,
                clarity: Number(ratings.clarity) || 5,
                patience: Number(ratings.patience) || 5,
                sessionStructure: Number(ratings.sessionStructure) || 5,
                onTime: true
            };

            if (isUUID(rawSessionId)) {
                await sessionService.submitRoleFeedback(currentFeedbackRole, feedbackPayload)
                showToast(`${isTeaching ? 'Teaching' : 'Learning'} feedback submitted! ✓`, 'success')
            } else {
                showToast('Feedback saved (demo session)', 'info')
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to submit feedback. Please try again.'
            showToast(msg, 'error')
            console.error(`[RoleFeedback] ${currentFeedbackRole} submission failed:`, err)
        }

        if (selectedRole === 'both' && currentFeedbackRole === 'learning') {
            setCurrentStep('second-role-prompt')
        } else {
            handleFlowComplete()
        }
    }

    const handleSecondRoleContinue = () => {
        setCurrentFeedbackRole('teaching')
        setCurrentStep('second-role-feedback')
    }

    const handleSecondRoleFeedbackSubmit = async (data: any) => {
        const { ratings, improvements, bestPart } = data;

        try {
            const rawSessionId = sessionId || sessionData?.id;

            const feedbackPayload = {
                sessionId: rawSessionId || '',
                communication: Number(ratings.communication) || 5,
                strengths: bestPart || 'N/A',
                improvements: improvements || 'N/A',
                onTime: true,
                sessionFocus: Number(ratings.sessionFocus) || 5,
                activeParticipation: Number(ratings.activeParticipation) || 5,
                openToFeedback: Number(ratings.openToFeedback) || 5
            }

            if (isUUID(rawSessionId)) {
                await sessionService.submitRoleFeedback('teaching', feedbackPayload)
                showToast('Teaching feedback submitted! ✓', 'success')
            } else {
                showToast('Feedback saved (demo session)', 'info')
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to submit feedback. Please try again.'
            showToast(msg, 'error')
            console.error('[SecondRoleFeedback] Submission failed:', err)
        }
        handleFlowComplete()
    }

    const handleFlowComplete = () => {
        console.log('Flow completed! Redirecting to session history...')
        navigate('/session-history')
    }

    const handleReportIssue = async (data: any) => {
        const currentId = sessionId || sessionData?.id;
        try {
            await sessionService.reportIssue(currentId, data)
            showToast('Issue reported. We will review it shortly.', 'success')
        } catch (err: any) {
            showToast('Could not send the report. Please try again.', 'error')
            console.error('[ReportIssue] Failed:', err)
        } finally {
            setCurrentStep('completed')
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

        if (error && !sessionData) {
            return (
                <div className="p-10 text-center bg-white rounded-[24px] shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
                    <p className="text-red-500 mb-6">{error}</p>
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
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            <Header activeTab="Sessions" />
            <main className="flex-1 flex flex-col items-center justify-center py-8 px-4">
                {renderCurrentStep()}
            </main>
            <Footer />
        </div>
    )
}