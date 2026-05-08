'use client'

import { ResumeData } from '@/types'

export default function CreativeTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects, customSections } = data
    const renderHtml = (html: string) => ({ __html: html })

    return (
        <div className="h-full flex flex-row font-sans text-gray-800 text-[10px]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
            {/* Sidebar */}
            <div className="w-[32%] bg-slate-900 text-white min-h-full p-4 flex flex-col">
                {/* Avatar Placeholder or Initials */}
                <div className="w-12 h-12 bg-slate-700 rounded-full mb-4 flex items-center justify-center text-xl font-bold mx-auto border-2 border-slate-600">
                    {personalInfo.fullName?.charAt(0) || 'Me'}
                </div>

                {/* Contact */}
                <div className="mb-5 text-[10px] space-y-1.5 opacity-90">
                    <h3 className="text-[9px] uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-700 pb-1">Contact</h3>
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
                    {personalInfo.location && <div>{personalInfo.location}</div>}
                    {personalInfo.links?.map((l, i) => l.url && <div key={i} className="break-all text-[9px] text-blue-300">{l.url.replace(/https?:\/\//, '')}</div>)}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-[9px] uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-700 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                            {skills.map(s => (
                                <span key={typeof s === 'string' ? s : s.name} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                    {typeof s === 'string' ? s : s.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education (Sidebar style) */}
                {education.length > 0 && (
                    <div className="mb-5">
                        <h3 className="text-[9px] uppercase tracking-widest text-slate-400 mb-2 border-b border-slate-700 pb-1">Education</h3>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-2 last:mb-0 text-[9px] text-slate-300">
                                <div className="font-bold text-white mb-0.5">{edu.school}</div>
                                <div>{edu.degree}{edu.field ? ` • ${edu.field}` : ''}</div>
                                <div className="text-slate-500 mt-0.5">{edu.startDate} - {edu.endDate || 'Now'}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 bg-white">
                <header className="mb-5">
                    <h1 className="text-2xl font-black text-slate-900 mb-1 leading-tight uppercase" dangerouslySetInnerHTML={renderHtml(personalInfo.fullName || '')} />
                    <p className="text-sm text-indigo-500 font-medium tracking-wide" dangerouslySetInnerHTML={renderHtml(personalInfo.title || '')} />
                </header>

                {personalInfo.summary && (
                    <div className="mb-5">
                        <h2 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-indigo-500 block"></span>
                            ABOUT ME
                        </h2>
                        <div className="text-xs text-gray-600 leading-snug" dangerouslySetInnerHTML={renderHtml(personalInfo.summary)} />
                    </div>
                )}

                {experience.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-indigo-500 block"></span>
                            EXPERIENCE
                        </h2>
                        <div className="space-y-4">
                            {experience.map(exp => (
                                <div key={exp.id} className="relative pl-4 border-l border-indigo-100">
                                    <div className="absolute -left-[4px] top-1 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-xs font-bold text-slate-800">{exp.company}</h3>
                                        <span className="text-[10px] text-indigo-400 font-bold bg-indigo-50 px-1.5 py-0.25 rounded-full">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-600 font-semibold mb-0.5" dangerouslySetInnerHTML={renderHtml(exp.position)} />
                                    <div className="text-[10px] text-gray-500 leading-snug" dangerouslySetInnerHTML={renderHtml(exp.description)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {projects.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-indigo-500 block"></span>
                            PROJECTS
                        </h2>
                        <div className="space-y-4">
                            {projects.map(proj => (
                                <div key={proj.id} className="relative pl-4 border-l border-indigo-100">
                                    <div className="absolute -left-[4px] top-1 w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-xs font-bold text-slate-800">{proj.name}</h3>
                                        <span className="text-[10px] text-indigo-400 font-bold bg-indigo-50 px-1.5 py-0.25 rounded-full">{proj.startDate} - {proj.endDate || 'Present'}</span>
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
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 hover:underline">
                                                {proj.link.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {customSections.map(sec => (
                    <div key={sec.id} className="mb-4">
                        <h2 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                            <span className="w-6 h-0.5 bg-indigo-500 block"></span>
                            {sec.title.toUpperCase()}
                        </h2>
                        <div className="text-xs text-gray-600 leading-snug" dangerouslySetInnerHTML={renderHtml(sec.content)} />
                    </div>
                ))}

            </div>
        </div>
    )
}
