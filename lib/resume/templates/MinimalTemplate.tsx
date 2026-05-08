'use client'

import { ResumeData } from '@/types'

export default function MinimalTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data
    const renderHtml = (html: string) => ({ __html: html })

    const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{title}</h3>
            {children}
        </div>
    )

    const components: Record<string, JSX.Element | null> = {
        personal: personalInfo.summary ? (
            <div className="mb-5 text-gray-600 leading-snug text-xs" dangerouslySetInnerHTML={renderHtml(personalInfo.summary)} />
        ) : null,

        experience: experience.length > 0 ? (
            <Section title="EXPERIENCE">
                {experience.map(exp => (
                    <div key={exp.id} className="mb-3 last:mb-0 group">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-medium text-gray-900 text-sm">{exp.company}</h4>
                            <span className="text-[10px] text-gray-400 group-hover:text-gray-600 transition-colors">
                                {exp.startDate} – {exp.endDate || 'Present'}
                            </span>
                        </div>
                        <div className="text-xs text-gray-800 mb-0.5 italic" dangerouslySetInnerHTML={renderHtml(exp.position)} />
                        <div className="text-[10px] text-gray-500 leading-snug" dangerouslySetInnerHTML={renderHtml(exp.description)} />
                    </div>
                ))}
            </Section>
        ) : null,

        education: education.length > 0 ? (
            <Section title="EDUCATION">
                {education.map(edu => (
                    <div key={edu.id} className="mb-2 last:mb-0 flex justify-between items-baseline border-b border-gray-100 pb-1 last:border-0 last:pb-0">
                        <div>
                            <div className="font-medium text-gray-900 text-xs">{edu.school}</div>
                            <div className="text-[10px] text-gray-500">{edu.degree} {edu.field}</div>
                        </div>
                        <div className="text-[10px] text-gray-400">{edu.startDate} – {edu.endDate || 'Present'}</div>
                    </div>
                ))}
            </Section>
        ) : null,

        skills: skills.length > 0 ? (
            <Section title="SKILLS">
                <div className="flex flex-wrap gap-1 text-[10px] text-gray-600">
                    {skills.map(s => (
                        <span key={typeof s === 'string' ? s : s.name} className="bg-gray-50 px-1.5 py-0.5 rounded">
                            {typeof s === 'string' ? s : s.name}
                        </span>
                    ))}
                </div>
            </Section>
        ) : null,

        projects: projects.length > 0 ? (
            <Section title="PROJECTS">
                {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0 group">
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-medium text-gray-900 text-sm">{proj.name}</h4>
                            <span className="text-[10px] text-gray-400 group-hover:text-gray-600 transition-colors">
                                {proj.startDate} – {proj.endDate || 'Present'}
                            </span>
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <div className="text-[10px] text-gray-600 mb-0.5">
                                <span className="font-medium">Tech: </span>
                                {proj.technologies.join(', ')}
                            </div>
                        )}
                        <div className="text-[10px] text-gray-500 leading-snug" dangerouslySetInnerHTML={renderHtml(proj.description)} />
                        {proj.link && (
                            <div className="mt-0.5">
                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline">
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
                        <div className="text-[10px] text-gray-500 leading-snug" dangerouslySetInnerHTML={renderHtml(sec.content)} />
                    </Section>
                ))}
            </>
        ) : null
    }

    const order = sectionOrder || ['personal', 'experience', 'education', 'skills', 'projects', 'custom']

    return (
        <div className="h-full font-serif text-gray-800 max-w-[90%] mx-auto py-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <header className="mb-6 border-b border-black pb-4">
                <h1 className="text-2xl font-light tracking-tight mb-1" dangerouslySetInnerHTML={renderHtml(personalInfo.fullName || '')} />
                <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-500 tracking-wide uppercase" dangerouslySetInnerHTML={renderHtml(personalInfo.title || '')} />
                    <div className="text-[10px] text-gray-400 text-right space-y-0.25">
                        {personalInfo.email && <div>{personalInfo.email}</div>}
                        {personalInfo.phone && <div>{personalInfo.phone}</div>}
                        {personalInfo.links?.map((l, i) => l.url && <div key={i}>{l.url.replace(/https?:\/\//, '')}</div>)}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-2">
                {order.map(key => components[key] || null)}
            </div>
        </div>
    )
}
