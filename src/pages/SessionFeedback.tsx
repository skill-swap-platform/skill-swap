import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { RoleSelection } from '@/components/feedback/RoleSelection'
import { SessionCompletedScreen } from '@/components/feedback/SessionCompletedScreen'
import { GeneralReview } from '@/components/feedback/GeneralReview'
import { RoleSpecificFeedback } from '@/components/feedback/RoleSpecificFeedback'
import { SecondRolePrompt } from '@/components/feedback/SecondRolePrompt'
import { ReportIssueScreen } from '@/components/feedback/ReportIssueScreen'
import { BadgeUnlockedScreen } from '@/components/gamification/BadgeUnlockedScreen'

type Step = 'badge-unlocked' | 'completed' | 'general-review' | 'role-selection' | 'role-feedback' | 'second-role-prompt' | 'second-role-feedback' | 'report-issue'

export const SessionFeedback: React.FC = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState<Step>('badge-unlocked')
    const [selectedRole, setSelectedRole] = useState<'teaching' | 'learning' | 'both'>('learning')
    const [currentFeedbackRole, setCurrentFeedbackRole] = useState<'teaching' | 'learning'>('learning')

    const partnerName = 'Alex Davidson'

    const handleBadgeContinue = () => {
        setCurrentStep('completed')
    }

    const handleSessionContinue = () => {
        setCurrentStep('general-review')
    }

    const handleGeneralReviewSubmit = (data: any) => {
        console.log('General review submitted:', data)
        setCurrentStep('role-selection')
    }

    const handleRoleContinue = (role: 'teaching' | 'learning' | 'both') => {
        setSelectedRole(role)
        if (role === 'both') {
            setCurrentFeedbackRole('learning')
        } else {
            setCurrentFeedbackRole(role)
        }
        setCurrentStep('role-feedback')
    }

    const handleRoleFeedbackSubmit = (data: any) => {
        console.log('Role feedback submitted:', data)

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

    const handleSecondRoleFeedbackSubmit = (data: any) => {
        console.log('Second role feedback submitted:', data)
        handleFlowComplete()
    }

    const handleFlowComplete = () => {
        console.log('Flow completed! Redirecting to session history...')
        navigate('/session-history')
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'badge-unlocked':
                return <BadgeUnlockedScreen onContinue={handleBadgeContinue} />
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
                        role="teaching"
                        onSubmit={handleSecondRoleFeedbackSubmit}
                        onSkip={handleFlowComplete}
                    />
                )
            case 'report-issue':
                return (
                    <ReportIssueScreen
                        onBack={() => setCurrentStep('completed')}
                        onSubmit={(data) => {
                            console.log('Report submitted:', data)
                            setCurrentStep('completed')
                        }}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            <Header activeTab="Sessions" />
            <main className="flex-1 flex items-center justify-center py-8">
                {renderCurrentStep()}
            </main>
            <Footer />
        </div>
    )
}
