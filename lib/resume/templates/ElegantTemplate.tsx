'use client'

import { ResumeData } from '@/types'

export default function ElegantTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data
    const renderHtml = (html: string) => ({ __html: html })

    // Elegant section component
    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-amber-600"></div>
                <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">{title}</h3>
            </div>
            {children}
        </div>
    )

    // Component map for sections
    const components: Record<string, JSX.Element | null> = {
        personal: personalInfo.summary ? (
            <Section title="个人简介">
                <div className="text-xs text-gray-700 leading-relaxed" dangerouslySetInnerHTML={renderHtml(personalInfo.summary)} />
            </Section>
        ) : null,

        experience: experience.length > 0 ? (
            <Section title="工作经历">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-800 text-xs">{exp.company}</h4>
                            <span className="text-[10px] text-amber-700 font-medium">{exp.startDate} – {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] text-gray-600 italic mb-0.5" dangerouslySetInnerHTML={renderHtml(exp.position)} />
                        <div className="text-[10px] text-gray-700 leading-snug" dangerouslySetInnerHTML={renderHtml(exp.description)} />
                    </div>
                ))}
            </Section>
        ) : null,

        education: education.length > 0 ? (
            <Section title="教育背景">
                {education.map(edu => (
                    <div key={edu.id} className="mb-2 last:mb-0">
                        <div className="flex justify-between items-baseline">
                            <span className="font-bold text-gray-800 text-xs">{edu.school}</span>
                            <span className="text-[10px] text-amber-700">{edu.startDate} – {edu.endDate || 'Present'}</span>
                        </div>
                        <div className="text-[10px] text-gray-600">{edu.degree}{edu.field ? ` • ${edu.field}` : ''}</div>
                    </div>
                ))}
            </Section>
        ) : null,

        skills: skills.length > 0 ? (
            <Section title="专业技能">
                <div className="flex flex-wrap gap-1">
                    {skills.map(s => (
                        <span key={typeof s === 'string' ? s : s.name} className="text-[10px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                            {typeof s === 'string' ? s : s.name}
                        </span>
                    ))}
                </div>
            </Section>
        ) : null,

        projects: projects.length > 0 ? (
            <Section title="项目经验">
                {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-gray-800 text-xs">{proj.name}</h4>
                            <span className="text-[10px] text-amber-700 font-medium">{proj.startDate} – {proj.endDate || 'Present'}</span>
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <div className="text-[10px] text-gray-600 mb-0.5">
                                <span className="font-medium">Tech: </span>
                                {proj.technologies.join(', ')}
                            </div>
                        )}
                        <div className="text-[10px] text-gray-700 leading-snug" dangerouslySetInnerHTML={renderHtml(proj.description)} />
                        {proj.link && (
                            <div className="mt-0.5">
                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-amber-700 hover:underline">
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
        <div className="h-full font-serif text-gray-800 bg-gradient-to-br from-amber-50 to-white p-6" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {/* Header */}
            <header className="text-center mb-6 pb-4 border-b border-amber-200">
                <h1 className="text-2xl font-bold text-amber-900 mb-1" dangerouslySetInnerHTML={renderHtml(personalInfo.fullName || '')} />
                <p className="text-sm text-amber-800 font-medium" dangerouslySetInnerHTML={renderHtml(personalInfo.title || '')} />
                <div className="flex flex-wrap justify-center gap-3 mt-2 text-[10px] text-amber-900">
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.links?.map((l, i) => l.url && <span key={i}>{l.url.replace(/https?:\/\//, '')}</span>)}
                </div>
            </header>

            {/* Content */}
            <div className="space-y-1">
                {order.map(key => components[key] || null)}
            </div>
        </div>
    )
}