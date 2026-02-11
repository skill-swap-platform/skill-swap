import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
    Dashboard,
    PointsAndBadges,
    SessionHistory,
    SessionFeedback,
    PreviewSessionCompleted,
    PreviewBadgeUnlocked,
    PreviewFeedbackForm,
    PreviewManageBadges,
    PreviewPointsManage,
    OnboardingInterests,
    OnboardingTeaching,
    OnboardingProfile,
    OnboardingLoading,
    Login,
    Register
} from '../pages'
const Routers: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/onboarding/interests" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/points-badges" element={<PointsAndBadges />} />
            <Route path="/history" element={<SessionHistory />} />
            <Route path="/feedback" element={<SessionFeedback />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/onboarding/interests" element={<OnboardingInterests />} />
            <Route path="/onboarding/teaching" element={<OnboardingTeaching />} />
            <Route path="/onboarding/profile" element={<OnboardingProfile />} />
            <Route path="/onboarding/loading" element={<OnboardingLoading />} />
            <Route path="/preview/session-completed" element={<PreviewSessionCompleted />} />
            <Route path="/preview/badge-unlocked" element={<PreviewBadgeUnlocked />} />
            <Route path="/preview/feedback-form" element={<PreviewFeedbackForm />} />
            <Route path="/preview/manage-badges" element={<PreviewManageBadges />} />
            <Route path="/preview/points-manage" element={<PreviewPointsManage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default Routers
