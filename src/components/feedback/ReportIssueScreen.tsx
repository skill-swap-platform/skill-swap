import React, { useState } from 'react'
import { ArrowLeft, Upload } from 'lucide-react'

interface ReportIssueScreenProps {
    onBack: () => void
    onSubmit: (data: any) => void
}

type IssueType = 'session' | 'points' | 'behavior' | 'technical' | 'other' | null

export const ReportIssueScreen: React.FC<ReportIssueScreenProps> = ({ onBack, onSubmit }) => {
    const [selectedIssue, setSelectedIssue] = useState<IssueType>(null)
    const [description, setDescription] = useState('')
    const [screenshot, setScreenshot] = useState<File | null>(null)

    const issueOptions = [
        { id: 'session', label: 'Session Issue' },
        { id: 'points', label: 'Points Issue' },
        { id: 'behavior', label: 'User Behavior' },
        { id: 'technical', label: 'Technical Problem' },
        { id: 'other', label: 'Other' }
    ]

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0])
        }
    }

    const handleSubmit = () => {
        onSubmit({
            issueType: selectedIssue,
            description,
            screenshot
        })
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-8 border-2 border-[#3E8FCC] shadow-sm">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">Report Issue</h2>
                    </div>

                    {/* Issue Type Selection */}
                    <div className="space-y-4 mb-6">
                        <label className="text-sm font-bold text-gray-900">What went wrong?</label>
                        <div className="space-y-3">
                            {issueOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSelectedIssue(option.id as IssueType)}
                                    className={`w-full px-4 py-3 rounded-xl text-left transition-all ${selectedIssue === option.id
                                        ? 'bg-[#E5F1FF] border-2 border-[#3E8FCC] text-gray-900'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4 mb-6">
                        <label className="text-sm font-bold text-gray-900">Tell us more</label>
                        <div className="relative">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="write here about your self . . ."
                                className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-[#3E8FCC] resize-none text-sm text-gray-600"
                                maxLength={500}
                            />
                            <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                                {description.length}/500
                            </span>
                        </div>
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-4 mb-8">
                        <label className="text-sm font-bold text-gray-900">
                            Attach Screenshot <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="screenshot-upload"
                            />
                            <label
                                htmlFor="screenshot-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#3E8FCC] hover:bg-gray-50 transition-all"
                            >
                                <Upload className="w-6 h-6 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-600">
                                    {screenshot ? screenshot.name : 'Tap to upload'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedIssue || !description}
                        className={`w-full h-12 rounded-xl font-bold transition-all ${selectedIssue && description
                            ? 'bg-[#3E8FCC] text-white hover:bg-[#2F71A3] shadow-sm'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}
