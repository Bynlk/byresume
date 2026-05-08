'use client'

import { ResumeData } from '@/types'

export default function ClassicTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data
    const renderHtml = (html: string) => ({ __html: html })

    const Separator = () => <div className="border-t border-black my-4 w-full h-px opacity-20" />

    // Create component map for sections
    const components: Record<string, JSX.Element | null> = {
        personal: personalInfo.summary ? (
            <div className="text-center max-w-[85%] mx-auto text-sm leading-snug text-gray-700">
                <div dangerouslySetInnerHTML={renderHtml(personalInfo.summary)} />
                <Separator />
            </div>
        ) : null,

        experience: experience.length > 0 ? (
            <section>
                <h2 className="text-center font-bold uppercase text-sm tracking-widest mb-3 text-black border-b border-black pb-1 mx-auto w-32">Experience</h2>
                {experience.map(exp => (
                    <div key={exp.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-end mb-0.5">
                            <h3 className="font-bold text-base">{exp.company}</h3>
                            <span className="text-xs italic font-sans text-gray-600">{exp.startDate} – {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-800 mb-0.5 italic" dangerouslySetInnerHTML={renderHtml(exp.position)} />
                        <div className="text-xs text-gray-700 leading-snug text-justify" dangerouslySetInnerHTML={renderHtml(exp.description)} />
                    </div>
                ))}
            </section>
        ) : null,

        education: education.length > 0 ? (
            <section>
                <h2 className="text-center font-bold uppercase text-sm tracking-widest mb-3 mt-6 text-black border-b border-black pb-1 mx-auto w-32">Education</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {education.map(edu => (
                        <div key={edu.id}>
                            <div className="font-bold text-sm">{edu.school}</div>
                            <div className="text-xs italic mb-0.5">
                                {edu.degree}{edu.field ? ` • ${edu.field}` : ''}
                            </div>
                            <div className="text-[10px] font-sans text-gray-500">{edu.startDate} – {edu.endDate || 'Present'}</div>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,

        skills: skills.length > 0 ? (
            <section>
                <h2 className="text-center font-bold uppercase text-sm tracking-widest mb-2 mt-4 text-black border-b border-black pb-1 mx-auto w-32">Skills</h2>
                <div className="text-center text-xs">
                    {skills.map(s => typeof s === 'string' ? s : s.name).join('  •  ')}
                </div>
            </section>
        ) : null,

        projects: projects.length > 0 ? (
            <section>
                <h2 className="text-center font-bold uppercase text-sm tracking-widest mb-3 mt-6 text-black border-b border-black pb-1 mx-auto w-32">Projects</h2>
                {projects.map(proj => (
                    <div key={proj.id} className="mb-3 last:mb-0">
                        <div className="flex justify-between items-end mb-0.5">
                            <h3 className="font-bold text-base">{proj.name}</h3>
                            <span className="text-xs italic font-sans text-gray-600">{proj.startDate} – {proj.endDate || 'Present'}</span>
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <div className="text-xs text-gray-700 mb-0.5">
                                <span className="font-medium">Tech: </span>
                                {proj.technologies.join(', ')}
                            </div>
                        )}
                        <div className="text-xs text-gray-700 leading-snug text-justify" dangerouslySetInnerHTML={renderHtml(proj.description)} />
                        {proj.link && (
                            <div className="mt-0.5">
                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline">
                                    {proj.link.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        ) : null,

        custom: customSections.length > 0 ? (
            <>
                {customSections.map(sec => (
                    <section key={sec.id}>
                        <h2 className="text-center font-bold uppercase text-sm tracking-widest mb-3 mt-6 text-black border-b border-black pb-1 mx-auto w-32">{sec.title}</h2>
                        <div className="text-xs text-gray-700 leading-snug text-justify" dangerouslySetInnerHTML={renderHtml(sec.content)} />
                    </section>
                ))}
            </>
        ) : null
    }

    // Use sectionOrder to determine display order, default to traditional order
    const order = sectionOrder || ['personal', 'experience', 'education', 'skills', 'projects', 'custom']

    return (
        <div className="h-full font-serif text-gray-900 bg-[#fafafa]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-2" dangerouslySetInnerHTML={renderHtml(personalInfo.fullName || '')} />
                <div className="text-sm italic text-gray-600 mb-4" dangerouslySetInnerHTML={renderHtml(personalInfo.title || '')} />

                <div className="flex justify-center flex-wrap gap-4 text-xs text-gray-600 font-sans border-t border-b border-gray-300 py-2">
                    {[
                        personalInfo.phone,
                        personalInfo.email,
                        personalInfo.location,
                        ...(personalInfo.links?.map(l => l.url) || [])
                    ].filter(Boolean).map((item, i) => (
                        <span key={i} className="" dangerouslySetInnerHTML={renderHtml(item as string)} />
                    ))}
                </div>
            </header>

            <div className="space-y-4">
                {order.map(key => components[key] || null)}
            </div>

        </div>
    )
}
