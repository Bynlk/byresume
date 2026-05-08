'use client'

import { ResumeData } from '@/types'

export default function ProfessionalTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data
    const renderHtml = (html: string) => ({ __html: html })

    // Professional section component with accent bar
    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-1 bg-blue-600 h-4"></div>
                <h3 className="text-sm font-bold text-gray-900 uppercase">{title}</h3>
            </div>
            <div className="ml-3 border-l-2 border-blue-100 pl-3">
                {children}
            </div>
        </div>
    )

    // Component map for sections
    const components: Record<string, JSX.Element | null> = {
        personal: personalInfo.summary ? (
            <Section title="Professional Summary">
                <div className="text-xs text-gray-700 leading-relaxed" dangerouslySetInnerHTML={renderHtml(personalInfo.summary)} />
            </Section>
        ) : null,

        experience: experience.length > 0 ? (
            <Section title="Professional Experience">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-800 text-xs">{exp.company}</h4>
                            <span className="text-[10px] text-blue-700 font-semibold">{exp.startDate} – {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] text-gray-600 font-medium mb-0.5" dangerouslySetInnerHTML={renderHtml(exp.position)} />
                        <div className="text-[10px] text-gray-700 leading-snug" dangerouslySetInnerHTML={renderHtml(exp.description)} />
                    </div>
                ))}
            </Section>
        ) : null,

        education: education.length > 0 ? (
            <Section title="Education">
                {education.map(edu => (
                    <div key={edu.id} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-gray-800 text-xs">{edu.school}</span>
                            <span className="text-[10px] text-blue-700 font-semibold">{edu.startDate} – {edu.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] text-gray-600">{edu.degree}{edu.field ? ` • ${edu.field}` : ''}</div>
                    </div>
                ))}
            </Section>
        ) : null,

        skills: skills.length > 0 ? (
            <Section title="Core Competencies">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {skills.map(s => (
                        <div key={typeof s === 'string' ? s : s.name} className="text-[10px] text-gray-800 flex items-center gap-1">
                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                            {typeof s === 'string' ? s : s.name}
                        </div>
                    ))}
                </div>
            </Section>
        ) : null,

        projects: projects.length > 0 ? (
            <Section title="Key Projects">
                {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-800 text-xs">{proj.name}</h4>
                            <span className="text-[10px] text-blue-700 font-semibold">{proj.startDate} – {proj.endDate || 'Present'}</span>
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <div className="text-[10px] text-gray-600 mb-0.5">
                                <span className="font-medium text-gray-700">Technologies: </span>
                                {proj.technologies.join(', ')}
                            </div>
                        )}
                        <div className="text-[10px] text-gray-700 leading-snug" dangerouslySetInnerHTML={renderHtml(proj.description)} />
                        {proj.link && (
                            <div className="mt-0.5">
                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-700 hover:underline">
                                    {proj.link.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </Section>
        ) : null,

        custom: customSections.length > 0 ? (
            <>
                {customSections.map(sec => (
                    <Section key={sec.id} title={sec.title}>
                        <div className="text-[10px] text-gray-700 leading-snug" dangerouslySetInnerHTML={renderHtml(sec.content)} />
                    </Section>
                ))}
            </>
        ) : null
    }

    const order = sectionOrder || ['personal', 'experience', 'education', 'skills', 'projects', 'custom']

    return (
        <div className="h-full font-sans text-gray-800 bg-white p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="text-left mb-6 pb-4 border-b-2 border-blue-600">
                <h1 className="text-2xl font-bold text-gray-900 mb-0.5" dangerouslySetInnerHTML={renderHtml(personalInfo.fullName || '')} />
                <p className="text-sm text-blue-700 font-medium mb-2" dangerouslySetInnerHTML={renderHtml(personalInfo.title || '')} />
                <div className="flex flex-wrap gap-3 text-[10px] text-gray-600">
                    {personalInfo.phone && <span className="font-medium">{personalInfo.phone}</span>}
                    {personalInfo.email && <span className="font-medium">{personalInfo.email}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.links?.map((l, i) => l.url && <span key={i} className="text-blue-700">{l.url.replace(/https?:\/\//, '')}</span>)}
                </div>
            </header>

            {/* Content */}
            <div className="space-y-1">
                {order.map(key => components[key] || null)}
            </div>
        </div>
    )
}