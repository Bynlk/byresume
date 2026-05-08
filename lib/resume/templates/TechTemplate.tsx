'use client'

import { ResumeData } from '@/types'
import { Terminal, Code, GitBranch, Cpu, Database, FolderGit2, GraduationCap } from 'lucide-react'

export default function TechTemplate({ data }: { data: ResumeData }) {
    const { personalInfo, experience, education, skills, projects, customSections } = data
    const renderHtml = (html: string) => ({ __html: html })

    return (
        <div className="h-full font-mono text-sm text-gray-300 bg-[#1e1e1e] p-4 rounded-sm overflow-hidden border border-gray-700" style={{ fontFamily: "'Noto Sans Mono', monospace" }}>
            {/* Top Bar Decoration */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500 ml-4 flex items-center gap-2">
                    <Terminal size={12} />
                    ~/resume/{personalInfo.fullName?.toLowerCase().replace(/\s+/g, '_')}.tsx
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-full">

                {/* Left Column - Meta */}
                <div className="col-span-4 border-r border-gray-700 pr-4 flex flex-col gap-6">
                    <div>
                        <h1 className="text-xl font-bold text-blue-400 mb-2">const profile = {'{'}</h1>
                        <div className="pl-4 text-xs space-y-1.5 text-green-300">
                            <div className="flex"><span className="text-purple-400 w-16">name:</span> "{personalInfo.fullName}",</div>
                            <div className="flex"><span className="text-purple-400 w-16">title:</span> "{personalInfo.title}",</div>
                            {personalInfo.email && <div className="flex"><span className="text-purple-400 w-16">email:</span> "{personalInfo.email}",</div>}
                            {personalInfo.phone && <div className="flex"><span className="text-purple-400 w-16">phone:</span> "{personalInfo.phone}",</div>}
                            {personalInfo.location && <div className="flex"><span className="text-purple-400 w-16">loc:</span> "{personalInfo.location}",</div>}
                        </div>
                        <h1 className="text-xl font-bold text-blue-400 mt-2">{'}'}</h1>
                    </div>

                    {skills.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 text-yellow-400 font-bold mb-3">
                                <Cpu size={14} />
                                <span>Skills.json</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map(s => (
                                    <span key={typeof s === 'string' ? s : s.name} className="bg-blue-900/30 text-blue-200 px-2 py-1 rounded text-[10px] border border-blue-800">
                                        {typeof s === 'string' ? s : s.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {education.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 text-yellow-400 font-bold mb-3">
                                <GraduationCap size={14} />
                                <span>Education.log</span>
                            </div>
                            {education.map(edu => (
                                <div key={edu.id} className="mb-4 text-xs">
                                    <div className="text-purple-300 font-bold">import {edu.school}</div>
                                    <div className="text-gray-400">as {edu.degree}{edu.field ? ` • ${edu.field}` : ''}</div>
                                    <div className="text-gray-600 font-mono no-underline">[{edu.startDate} - {edu.endDate || 'Now'}]</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Main */}
                <div className="col-span-8">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold mb-4 border-b border-gray-800 pb-2">
                            <Code size={16} />
                            <span>Summary.md</span>
                        </div>
                        <div className="text-gray-300 text-xs leading-relaxed font-sans" dangerouslySetInnerHTML={renderHtml(personalInfo.summary || '')} />
                    </div>

                    {experience.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-yellow-400 font-bold mb-4 border-b border-gray-800 pb-2">
                                <GitBranch size={16} />
                                <span>Work_Experience.ts</span>
                            </div>

                            <div className="space-y-6">
                                {experience.map((exp, idx) => (
                                    <div key={exp.id} className="relative pl-6 border-l border-gray-700">
                                        <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <span className="text-blue-400 font-bold">function</span>
                                                <span className="text-yellow-200 font-bold ml-2">{exp.company.replace(/\s+/g, '')}</span>
                                                <span className="text-gray-500">() {'{'}</span>
                                            </div>
                                            <span className="text-gray-600 text-[10px] mono">
                                 // {exp.startDate} - {exp.endDate || 'Now'}
                                            </span>
                                        </div>
                                        <div className="pl-4 border-l border-gray-800 ml-1">
                                            <div className="text-green-400 text-xs mb-2" dangerouslySetInnerHTML={renderHtml(`// ${exp.position}`)} />
                                            <div className="text-gray-400 text-xs leading-relaxed font-sans opacity-90" dangerouslySetInnerHTML={renderHtml(exp.description)} />
                                        </div>
                                        <div className="text-gray-500 mt-1">{'}'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {projects.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-yellow-400 font-bold mb-4 border-b border-gray-800 pb-2">
                                <FolderGit2 size={16} />
                                <span>Projects.ts</span>
                            </div>

                            <div className="space-y-6">
                                {projects.map((proj, idx) => (
                                    <div key={proj.id} className="relative pl-6 border-l border-gray-700">
                                        <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <span className="text-blue-400 font-bold">const</span>
                                                <span className="text-yellow-200 font-bold ml-2">{proj.name.replace(/\s+/g, '')}</span>
                                                <span className="text-gray-500">=</span>
                                                <span className="text-gray-400"> {'{'}</span>
                                            </div>
                                            <span className="text-gray-600 text-[10px] mono">
                                 // {proj.startDate} - {proj.endDate || 'Now'}
                                            </span>
                                        </div>
                                        <div className="pl-4 border-l border-gray-800 ml-1">
                                            {proj.technologies && proj.technologies.length > 0 && (
                                                <div className="text-purple-300 text-xs mb-1">
                                                    stack: [{proj.technologies.join(', ')}],
                                                </div>
                                            )}
                                            <div className="text-gray-400 text-xs leading-relaxed font-sans opacity-90" dangerouslySetInnerHTML={renderHtml(proj.description)} />
                                            {proj.link && (
                                                <div className="text-blue-400 text-xs mt-1">
                                                    link: "{proj.link}",
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-gray-500 mt-1">{'}'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {customSections.length > 0 && (
                        <div>
                            {customSections.map(sec => (
                                <div key={sec.id} className="mb-6">
                                    <div className="flex items-center gap-2 text-yellow-400 font-bold mb-4 border-b border-gray-800 pb-2">
                                        <Code size={16} />
                                        <span>{sec.title.replace(/\s+/g, '_')}.txt</span>
                                    </div>
                                    <div className="text-gray-300 text-xs leading-relaxed font-sans" dangerouslySetInnerHTML={renderHtml(sec.content)} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
