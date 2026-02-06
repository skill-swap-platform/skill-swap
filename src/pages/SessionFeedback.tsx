import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PostSessionLayout } from '@/components/layout/PostSessionLayout'
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
            // Start with learning role first
            setCurrentFeedbackRole('learning')
        } else {
            setCurrentFeedbackRole(role)
        }
        setCurrentStep('role-feedback')
    }

    const handleRoleFeedbackSubmit = (data: any) => {
        console.log('Role feedback submitted:', data)

        // If user selected 'both' and just finished first feedback (learning)
        if (selectedRole === 'both' && currentFeedbackRole === 'learning') {
            setCurrentStep('second-role-prompt')
        } else {
            // For single role (teaching or learning only), go to history
            handleFlowComplete()
        }
    }

    const handleSecondRoleContinue = () => {
        setCurrentFeedbackRole('teaching')
        setCurrentStep('second-role-feedback')
    }

    const handleSecondRoleFeedbackSubmit = (data: any) => {
        console.log('Second role feedback submitted:', data)
        // After second feedback, go to history
        handleFlowComplete()
    }

    const handleFlowComplete = () => {
        console.log('Flow completed! Redirecting to session history...')
        navigate('/history')
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
        <PostSessionLayout>
            {renderCurrentStep()}
        </PostSessionLayout>
    )
}
