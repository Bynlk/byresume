'use client'

import React from 'react'
import { ResumeData } from '@/types'
import { Phone, Mail, Map, Link as IconLink, Github, Linkedin, Calendar, MapPin, Globe } from 'lucide-react'

interface ModernTemplateProps {
    data: ResumeData
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
    const { personalInfo, experience, education, skills, projects, customSections, sectionOrder } = data

    const renderHtml = (html: string) => ({ __html: html })

    const getLinkIcon = (url: string) => {
        const lowerUrl = url.toLowerCase()
        if (lowerUrl.includes('github')) return <Github size={14} />
        if (lowerUrl.includes('linkedin')) return <Linkedin size={14} />
        return <Globe size={14} /> // Default globe for others
    }

    // Helper component for sections
    const Section = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
        <div className={`section mb-6 ${className}`}>
            <div className="section-title text-lg font-bold text-gray-800 border-b-2 border-gray-800 mb-3 pb-1 uppercase tracking-wide">
                {title}
            </div>
            {children}
        </div>
    )

    const components: Record<string, JSX.Element | null> = {
        personal: personalInfo.summary ? (
            <Section title="个人简介" className="section-summary">
                <div
                    className="item-content text-sm text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={renderHtml(personalInfo.summary)}
                />
            </Section>
        ) : null,

        experience: experience.length > 0 ? (
            <Section title="工作经历" className="section-work">
                {experience.map(exp => (
                    <div key={exp.id} className="resume-item mb-4 last:mb-0">
                        <div className="item-header flex justify-between items-baseline mb-1">
                            <span className="company font-bold text-gray-800 text-base">{exp.company}</span>
                            <span className="date text-xs text-gray-500 font-medium">
                                {exp.startDate} - {exp.endDate || '至今'}
                            </span>
                        </div>
                        {exp.position && (
                            <div className="role text-sm font-semibold text-gray-700 mb-1" dangerouslySetInnerHTML={renderHtml(exp.position)} />
                        )}
                        {exp.description && (
                            <div
                                className="desc text-sm text-gray-600 leading-snug"
                                dangerouslySetInnerHTML={renderHtml(exp.description)}
                            />
                        )}
                    </div>
                ))}
            </Section>
        ) : null,

        education: education.length > 0 ? (
            <Section title="教育经历" className="section-education">
                {education.map(edu => (
                    <div key={edu.id} className="resume-item mb-3 last:mb-0">
                        <div className="item-header flex justify-between items-baseline">
                            <span className="school font-bold text-gray-800 text-base">{edu.school}</span>
                            <span className="date text-xs text-gray-500 font-medium">
                                {edu.startDate} - {edu.endDate || '至今'}
                            </span>
                        </div>
                        <div className="degree text-sm text-gray-700">
                            {edu.degree} {edu.field && `• ${edu.field}`}
                        </div>
                        {edu.description && (
                            <div
                                className="desc text-sm text-gray-600 leading-snug mt-1"
                                dangerouslySetInnerHTML={renderHtml(edu.description)}
                            />
                        )}
                    </div>
                ))}
            </Section>
        ) : null,

        skills: skills.length > 0 ? (
            <Section title="技能特长" className="section-skills">
                <div className="item-content text-sm text-gray-700 leading-relaxed">
                    {skills.map(s => typeof s === 'string' ? s : s.name).join(' • ')}
                </div>
            </Section>
        ) : null,

        projects: projects.length > 0 ? (
            <Section title="项目经历" className="section-projects">
                {projects.map(proj => (
                    <div key={proj.id} className="resume-item mb-4 last:mb-0">
                        <div className="item-header flex justify-between items-baseline mb-1">
                            <span className="project-name font-bold text-gray-800 text-base">{proj.name}</span>
                            <span className="date text-xs text-gray-500 font-medium">
                                {proj.startDate} - {proj.endDate || '至今'}
                            </span>
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                            <div className="technologies text-xs text-gray-600 mb-1">
                                <span className="font-medium">技术栈: </span>
                                {proj.technologies.join(', ')}
                            </div>
                        )}
                        {proj.description && (
                            <div
                                className="desc text-sm text-gray-600 leading-snug"
                                dangerouslySetInnerHTML={renderHtml(proj.description)}
                            />
                        )}
                        {proj.link && (
                            <div className="link mt-1">
                                <a
                                    href={proj.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <IconLink size={12} />
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
                    <Section key={sec.id} title={sec.title} className="section-custom">
                        <div
                            className="item-content text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={renderHtml(sec.content)}
                        />
                    </Section>
                ))}
            </>
        ) : null
    }

    const order = sectionOrder || ['personal', 'experience', 'education', 'skills', 'custom']

    return (
        <div className="resume-paper template1 h-full flex flex-col font-sans" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
            {/* Header */}
            <div className="t1-header text-center mb-6 pb-4 border-b border-gray-200">
                <h1
                    className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-tight"
                    dangerouslySetInnerHTML={renderHtml(personalInfo.fullName || '姓名')}
                />
                {personalInfo.title && (
                    <p
                        className="job text-lg text-gray-600 mb-3 font-medium"
                        dangerouslySetInnerHTML={renderHtml(personalInfo.title)}
                    />
                )}

                <div className="contact-line flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                    {personalInfo.phone && (
                        <span className="flex items-center gap-1.5">
                            <Phone size={14} />
                            <span dangerouslySetInnerHTML={renderHtml(personalInfo.phone)} />
                        </span>
                    )}
                    {personalInfo.email && (
                        <span className="flex items-center gap-1.5">
                            <Mail size={14} />
                            <span dangerouslySetInnerHTML={renderHtml(personalInfo.email)} />
                        </span>
                    )}
                    {personalInfo.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            <span dangerouslySetInnerHTML={renderHtml(personalInfo.location)} />
                        </span>
                    )}
                    {personalInfo.links?.filter(l => l.url).map((link, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            {getLinkIcon(link.url)}
                            <span dangerouslySetInnerHTML={renderHtml(link.url.replace(/^https?:\/\//, ''))} />
                        </span>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="t1-body flex-1">
                {order.map(key => (
                    <React.Fragment key={key}>
                        {components[key] || null}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}
