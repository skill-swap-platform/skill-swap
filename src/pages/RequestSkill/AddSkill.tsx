import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { Loader2 } from 'lucide-react';
import { skillService, userService } from '@/api/services/user.service';

const LANGUAGES = [
  'English',
  'Arabic',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Italian',
  'Portuguese',
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const SESSION_DURATIONS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
];

interface SkillOption {
  id: string;
  name: string;
}

interface RequestSkillNavigationState {
  receiverId?: string;
  requestedSkillId?: string;
  requestedSkillName?: string;
  newSkill?: SkillOption;
}

const levelMap: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'> = {
  Beginner: 'BEGINNER',
  Intermediate: 'INTERMEDIATE',
  Advanced: 'EXPERT',
};

const AddSkill: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [showLanguagePanel, setShowLanguagePanel] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement | null>(null);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number | null>(null);
  const [allSkills, setAllSkills] = useState<SkillOption[]>([]);
  const [searchResults, setSearchResults] = useState<SkillOption[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillOption | null>(null);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestContext = (location.state as RequestSkillNavigationState | null) ?? null;

  const isPublishDisabled = useMemo(() => {
    return !title.trim() || !description.trim() || !language || !skillLevel || !sessionDuration;
  }, [title, description, language, skillLevel, sessionDuration]);

  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        setIsLoadingSkills(true);
        const response = await skillService.getAllSkills();
        const raw = response?.data ?? response;
        const finalSkills = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];

        const mappedSkills = finalSkills
          .filter((skill: { id?: unknown; name?: unknown }) =>
            typeof skill?.id === 'string' && typeof skill?.name === 'string'
          )
          .map((skill: { id: string; name: string }) => ({
            id: skill.id,
            name: skill.name,
          }));

        setAllSkills(mappedSkills);
      } catch (error) {
        console.error('[AddSkill] Failed to load skills:', error);
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchAllSkills();
  }, []);

  useEffect(() => {
    if (title.trim().length < 2 || selectedSkill) {
      setSearchResults([]);
      return;
    }

    const normalized = title.trim().toLowerCase();
    const filtered = allSkills
      .filter((skill) => skill.name.toLowerCase().includes(normalized))
      .slice(0, 8);

    setSearchResults(filtered);
  }, [title, selectedSkill, allSkills]);

  useEffect(() => {
    if (!showLanguagePanel) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!languageDropdownRef.current?.contains(event.target as Node)) {
        setShowLanguagePanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguagePanel]);

  const handleBack = () => {
    navigate('/request-skill', { state: requestContext ?? undefined });
  };

  const handlePublish = async () => {
    if (isPublishDisabled || isPublishing) return;

    try {
      setIsPublishing(true);
      setErrorMsg(null);

      let finalSkill = selectedSkill;

      if (!finalSkill) {
        const exactMatch = allSkills.find(
          (skill) => skill.name.toLowerCase() === title.trim().toLowerCase()
        );

        if (exactMatch) {
          finalSkill = exactMatch;
        } else {
          const createRes = await skillService.createSkill(title.trim());
          const created = createRes?.data?.data ?? createRes?.data ?? null;

          if (created?.id && created?.name) {
            finalSkill = {
              id: created.id,
              name: created.name,
            };
          } else {
            throw new Error('Could not create skill. Please try again.');
          }
        }
      }

      if (!finalSkill?.id) {
        throw new Error('Please select a valid skill first.');
      }

      const response = await userService.addSkill({
        skillId: finalSkill.id,
        level: levelMap[skillLevel ?? 'Beginner'],
        yearsOfExperience: 0,
        sessionLanguage: language,
        skillDescription: description.trim(),
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to add skill.');
      }

      const createdUserSkill = response.data as { id?: string } | undefined;
      const createdUserSkillId = createdUserSkill?.id;

      if (!createdUserSkillId) {
        throw new Error('Skill was added but no skill id was returned.');
      }

      navigate('/request-skill', {
        state: {
          ...(requestContext ?? {}),
          newSkill: {
            id: createdUserSkillId,
            name: finalSkill.name,
          },
        } satisfies RequestSkillNavigationState,
      });
    } catch (error) {
      console.error('[AddSkill] Publish failed:', error);
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message
        || (error as { message?: string })?.message
        || 'Failed to add skill. Please try again.';
      setErrorMsg(message);
    } finally {
      setIsPublishing(false);
    }
  };


  return (
    <div className="flex min-h-screen flex-col bg-gray-light">
      <Header activeTab="Requests" />
      <div className="flex flex-1 flex-col items-center px-4 py-6 sm:px-5 sm:py-10">
        <div className="w-full max-w-[846px] rounded-[20px] bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-5 sm:mb-6 flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Go back"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M13.3333 26.6667L4.66663 18L13.3333 9.33334" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M27.3333 18H4.66663" stroke="#0C0D0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="m-0 text-2xl sm:text-3xl font-bold text-[#0c0d0f]">Add a Skill</h1>
          </div>

          <form className="flex flex-col gap-5">
            <div className="relative flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0c0d0f]">
                Skill Title <span className="text-[#dc2626]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setSelectedSkill(null);
                    setErrorMsg(null);
                  }}
                  placeholder="e.g. Mobile Photography Basics"
                  className="h-12 w-full rounded-[10px] border border-[#e5e7eb] px-4 text-[14px] text-[#0c0d0f] placeholder:text-[#9ca3af] focus:border-[#3272a3] focus:outline-none"
                />
                {isLoadingSkills && (
                  <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-[#9ca3af]" />
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white shadow-lg">
                  {searchResults.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => {
                        setTitle(skill.name);
                        setSelectedSkill(skill);
                        setSearchResults([]);
                        setErrorMsg(null);
                      }}
                      className="w-full px-4 py-3 text-left text-[14px] text-[#0c0d0f] hover:bg-[#f9fafb]"
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0c0d0f]">Skill Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What will the learner gain? What topics will you cover?"
                className="min-h-[120px] rounded-[10px] border border-[#e5e7eb] px-4 py-3 text-[14px] text-[#0c0d0f] placeholder:text-[#9ca3af] focus:border-[#3272a3] focus:outline-none resize-none"
              />
            </div>

            <div className="flex flex-col gap-2" ref={languageDropdownRef}>
              <label className="text-sm font-semibold text-[#0c0d0f]">Language</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLanguagePanel((prev) => !prev)}
                  className={`h-12 w-full rounded-[10px] border bg-white px-4 text-left text-[14px] focus:outline-none ${showLanguagePanel ? 'border-[#3272a3]' : 'border-[#e5e7eb]'
                    } ${language ? 'text-[#0c0d0f]' : 'text-[#9ca3af]'}`}
                >
                  {language || 'Select Language'}
                </button>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <path d="M4 6L8 10L12 6" stroke="#0C0D0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {showLanguagePanel && (
                  <div
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-10 rounded-[10px] bg-[#f9fafb] py-2 shadow-[0px_0px_4.7px_rgba(0,0,0,0.25)]"
                  >
                    <div className="bg-[rgba(62,143,204,0.2)] px-4 py-2 text-[14px] text-[#0c0d0f]">
                      Tongue
                    </div>
                    <div className="max-h-[200px] overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          className={`flex w-full px-4 py-2 text-left text-[14px] text-[#0c0d0f] hover:bg-white ${lang === language ? 'font-semibold text-[#3272a3]' : ''
                            }`}
                          onClick={() => {
                            setLanguage(lang);
                            setShowLanguagePanel(false);
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-[#0c0d0f]">Skill Level</label>
                <span
                  aria-label="Skill level info"
                  className="flex items-center justify-center rounded-full"
                  style={{ border: '0.5px solid #666', width: 12, height: 12 }}
                >
                  <span className="text-[8px] leading-none text-[#666]">!</span>
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SKILL_LEVELS.map((level) => {
                  const isActive = skillLevel === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSkillLevel(level)}
                      className={`h-12 rounded-[12px] border text-[14px] font-medium transition-colors ${isActive ? 'border-[#3272a3] bg-[rgba(50,114,163,0.08)] text-[#0c0d0f]' : 'border-[#e5e7eb] bg-white text-[#666]'
                        }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-[#0c0d0f]">Session Duration</label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SESSION_DURATIONS.map((duration) => {
                  const isSelected = sessionDuration === duration.value;
                  return (
                    <button
                      key={duration.value}
                      type="button"
                      onClick={() => setSessionDuration(duration.value)}
                      className={`h-12 rounded-[12px] border text-[14px] font-medium transition-colors ${isSelected ? 'border-[#3272a3] bg-[rgba(50,114,163,0.08)] text-[#0c0d0f]' : 'border-[#e5e7eb] bg-white text-[#666]'
                        }`}
                    >
                      {duration.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishDisabled || isPublishing}
                className={`h-12 w-full sm:w-[160px] rounded-[10px] text-[16px] font-medium text-white transition-opacity ${
                  isPublishDisabled || isPublishing ? 'bg-[#9ca3af] opacity-70' : 'bg-[#3272a3] hover:opacity-90'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Publish
                </span>
              </button>
            </div>
            {errorMsg ? <p className="text-sm text-[#dc2626]">{errorMsg}</p> : null}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddSkill;
