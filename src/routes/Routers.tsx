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
    PreviewPointsManage
} from '../pages'

const Routers: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/feedback" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/points-badges" element={<PointsAndBadges />} />
            <Route path="/history" element={<SessionHistory />} />
            <Route path="/feedback" element={<SessionFeedback />} />

            {/* Preview Routes */}
            <Route path="/preview/session-completed" element={<PreviewSessionCompleted />} />
            <Route path="/preview/badge-unlocked" element={<PreviewBadgeUnlocked />} />
            <Route path="/preview/feedback-form" element={<PreviewFeedbackForm />} />
            <Route path="/preview/manage-badges" element={<PreviewManageBadges />} />
            <Route path="/preview/points-manage" element={<PreviewPointsManage />} />

            {/* Fallback to dashboard */}
            <Route path="*" element={<Navigate to="/feedback" />} />
        </Routes>
    )
}

export default Routers
