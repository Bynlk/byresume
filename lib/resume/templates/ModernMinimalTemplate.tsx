'use client'

import { ResumeData } from '@/types'

export default function ModernMinimalTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data
    const renderHtml = (html: string) => ({ __html: html })

    // Minimal section component
    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</h3>
            {children}
        </div>
    )

    // Component map for sections
    const components: Record<string, JSX.Element | null> = {
        personal: personalInfo.summary ? (
            <Section title="About">
                <div className="text-[10px] text-gray-600 leading-relaxed" dangerouslySetInnerHTML={renderHtml(personalInfo.summary)} />
            </Section>
        ) : null,

        experience: experience.length > 0 ? (
            <Section title="Experience">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-900 text-xs">{exp.company}</h4>
                            <span className="text-[9px] text-gray-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[9px] text-gray-700 font-medium mb-0.5" dangerouslySetInnerHTML={renderHtml(exp.position)} />
                        <div className="text-[9px] text-gray-600 leading-snug" dangerouslySetInnerHTML={renderHtml(exp.description)} />
                    </div>
                ))}
            </Section>
        ) : null,

        education: education.length > 0 ? (
            <Section title="Education">
                {education.map(edu => (
                    <div key={edu.id} className="mb-1.5 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-gray-900 text-xs">{edu.school}</span>
                            <span className="text-[9px] text-gray-500">{edu.startDate} – {edu.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[9px] text-gray-600">{edu.degree}{edu.field ? ` • ${edu.field}` : ''}</div>
                    </div>
                ))}
            </Section>
        ) : null,

        skills: skills.length > 0 ? (
            <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                    {skills.map(s => (
                        <span key={typeof s === 'string' ? s : s.name} className="text-[9px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            {typeof s === 'string' ? s : s.name}
                        </span>
                    ))}
                </div>
            </Section>
        ) : null,

        projects: projects.length > 0 ? (
            <Section title="Projects">
                {projects.map(proj => (
                    <div key={proj.id} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-900 text-xs">{proj.name}</h4>
                            <span className="text-[9px] text-gray-500">{proj.startDate} – {proj.endDate || 'Present'}</span>
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <div className="text-[9px] text-gray-600 mb-0.5">
                                {proj.technologies.join(', ')}
                            </div>
                        )}
                        <div className="text-[9px] text-gray-600 leading-snug" dangerouslySetInnerHTML={renderHtml(proj.description)} />
                        {proj.link && (
                            <div className="mt-0.5">
                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[9px] text-gray-500 hover:underline">
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
                        <div className="text-[9px] text-gray-600 leading-snug" dangerouslySetInnerHTML={renderHtml(sec.content)} />
                    </Section>
                ))}
            </>
        ) : null
    }

    const order = sectionOrder || ['personal', 'experience', 'education', 'skills', 'projects', 'custom']

    return (
        <div className="h-full font-sans text-gray-800 bg-white p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900 mb-0.5" dangerouslySetInnerHTML={renderHtml(personalInfo.fullName || '')} />
                <p className="text-xs text-gray-500 font-medium" dangerouslySetInnerHTML={renderHtml(personalInfo.title || '')} />
                <div className="flex flex-wrap gap-2 mt-2 text-[9px] text-gray-500">
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.links?.map((l, i) => l.url && <span key={i} className="text-gray-600">{l.url.replace(/https?:\/\//, '')}</span>)}
                </div>
            </header>

            {/* Content */}
            <div className="space-y-1">
                {order.map(key => components[key] || null)}
            </div>
        </div>
    )
}