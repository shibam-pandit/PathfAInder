export function generateResume({ basicInfo, professionalSummary, education, workExperiences, projects, skills, achievements, customSections }) {
    const htmlLines = [
        `<div class="resume-wrapper" style="font-family: Arial, Calibri, Georgia; font-feature-settings: 'lnum'; font-variant-numeric: lining-nums; line-height: 1.3; color: #333; padding: 10px 20px;">`,
        `  <div class="header" style="text-align: center; margin-bottom: 12px;">`,
        `    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 6px; margin-top: 0; border:none;">${basicInfo.name?.replace(/[<>&"]/g, '') || 'Name'}</h1>`,
        `    <div style="font-size: 13px; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; line-height: 1.5;">`
    ];

    if (basicInfo.email) htmlLines.push(`      <span><a href="mailto:${basicInfo.email}" style="color: #2563eb; text-decoration: none;">${basicInfo.email}</a></span>`);
    if (basicInfo.contactNumber) htmlLines.push(`      <span> ${basicInfo.contactNumber}</span>`);
    if (basicInfo.location) htmlLines.push(`      <span>${basicInfo.location}</span>`);
    htmlLines.push(`    </div>`);
    htmlLines.push(`    <div style="font-size: 13px; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-top: 3px;">`);
    if (basicInfo.linkedin) htmlLines.push(`      <span><a href="${basicInfo.linkedin}" style="color: #2563eb; text-decoration: none;">${basicInfo.linkedin}</a></span>`);
    if (basicInfo.github) htmlLines.push(`      <span><a href="${basicInfo.github}" style="color: #2563eb; text-decoration: none;">${basicInfo.github}</a></span>`);
    if (basicInfo.portfolio) htmlLines.push(`      <span><a href="${basicInfo.portfolio}" style="color: #2563eb; text-decoration: none;">${basicInfo.portfolio}</a></span>`);
    htmlLines.push(`    </div>`);
    htmlLines.push(`  </div>`);

    if (professionalSummary?.trim()) {
        htmlLines.push(`  <div class="section" style="margin-bottom: 12px;">`);
        htmlLines.push(`    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #2563eb; margin-bottom: 3px; margin-top: 8px; letter-spacing: 0.5px; border:none;">Professional Summary</h2>`);
        htmlLines.push(`    <div style="border-bottom: 1px solid #2563eb; margin-bottom: 8px;"></div>`);
        htmlLines.push(`    <p style="font-size: 13px; margin: 0; text-align: justify;">${professionalSummary}</p>`);
        htmlLines.push(`  </div>`);
    }

    if (education?.length && education[0].institution?.trim()) {
        htmlLines.push(`  <div class="section" style="margin-bottom: 12px;">`);
        htmlLines.push(`    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #2563eb; margin-bottom: 3px; margin-top: 8px; letter-spacing: 0.5px; border:none;">Education</h2>`);
        htmlLines.push(`    <div style="border-bottom: 1px solid #2563eb; margin-bottom: 8px;"></div>`);
        
        education.forEach(edu => {
            htmlLines.push(`    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0;">`);
            htmlLines.push(`      <div style="font-size: 13px; font-weight: bold;">${edu.institution}</div>`);
            htmlLines.push(`      <div style="font-size: 13px;">${edu.startYear || ''} — ${edu.graduationYear || ''}</div>`);
            htmlLines.push(`    </div>`);
            htmlLines.push(`    <div style="font-size: 13px; margin-bottom: 1px;">${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</div>`);
            
            let info = [];
            if (edu.duration) info.push(edu.duration);
            if (edu.cgpa) info.push(`CGPA: ${edu.cgpa}`);
            if (info.length) htmlLines.push(`    <div style="font-size: 13px; margin-bottom: 6px;">${info.join(' | ')}</div>`);
            else htmlLines.push(`    <div style="margin-bottom: 6px;"></div>`);
        });
        
        htmlLines.push(`  </div>`);
    }

    const validExperiences = workExperiences.filter(exp => exp.jobTitle?.trim());
    if (validExperiences.length > 0) {
        htmlLines.push(`  <div class="section" style="margin-bottom: 12px;">`);
        htmlLines.push(`    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #2563eb; margin-bottom: 3px; margin-top: 8px; letter-spacing: 0.5px; border:none;">Work Experience</h2>`);
        htmlLines.push(`    <div style="border-bottom: 1px solid #2563eb; margin-bottom: 8px;"></div>`);
        
        validExperiences.forEach(exp => {
            const start = exp.startDate || '';
            const end = exp.currentlyWorkingHere ? 'Present' : exp.endDate || '';
            
            htmlLines.push(`    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px;">`);
            htmlLines.push(`      <span style="font-size: 13px; font-weight: bold;">${exp.jobTitle} | ${exp.companyName}</span>`);
            htmlLines.push(`      <span style="font-size: 13px;">${start} — ${end}</span>`);
            htmlLines.push(`    </div>`);
            
            if (exp.responsibilities?.trim()) {
                htmlLines.push(`    <ul style="list-style-type: disc; padding-left: 18px; margin: 2px 0 8px 0;">`);
                exp.responsibilities.trim().split('. ').forEach(res => {
                    if (res.trim()) {
                        htmlLines.push(`      <li style="font-size: 13px; margin-bottom: 1px;">${res}</li>`);
                    }
                });
                htmlLines.push(`    </ul>`);
            }
        });
        
        htmlLines.push(`  </div>`);
    }

    const validProjects = projects.filter(p => p.projectTitle?.trim());
    if (validProjects.length > 0) {
        htmlLines.push(`  <div class="section" style="margin-bottom: 12px;">`);
        htmlLines.push(`    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #2563eb; margin-bottom: 3px; margin-top: 8px; letter-spacing: 0.5px; border:none;">Projects</h2>`);
        htmlLines.push(`    <div style="border-bottom: 1px solid #2563eb; margin-bottom: 8px;"></div>`);
        
        validProjects.forEach(proj => {
            htmlLines.push(`    <div style="margin-bottom: 6px;">`);
            htmlLines.push(`      <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 1px; flex-wrap: wrap;">`);
            htmlLines.push(`        <span style="font-size: 13px; font-weight: bold;">${proj.projectTitle}</span>`);
            
            htmlLines.push(`<div style="display: flex; gap: 14px; flex-wrap: wrap;">`);
            if (proj.liveDemoLink) 
                htmlLines.push(`        <a href="${proj.liveDemoLink}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 12px;">Live Demo</a>`);
            if (proj.githubLink)
                htmlLines.push(`        <a href="${proj.githubLink}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 12px;">GitHub Repo</a>`);
            
            htmlLines.push(`      </div>`);
            htmlLines.push(`      </div>`);
            
            if (proj.technologiesUsed?.length)
                htmlLines.push(`      <div style="font-size: 12px; margin-bottom: 3px;">${proj.technologiesUsed.join(', ')}</div>`);
            
            if (proj.projectDescription?.trim()) {
                htmlLines.push(`      <ul style="list-style-type: disc; padding-left: 18px; margin: 2px 0 4px 0;">`);
                const lines = proj.projectDescription.trim().split('. ').filter(Boolean);
                lines.forEach(line => {
                    if (line.trim()) {
                        htmlLines.push(`        <li style="font-size: 13px; margin-bottom: 1px;">${line}</li>`);
                    }
                });
                htmlLines.push(`      </ul>`);
            }
            
            htmlLines.push(`    </div>`);
        });
        
        htmlLines.push(`  </div>`);
    }

    const validSkills = skills.filter(skill => skill?.trim());
    if (validSkills.length > 0) {
        htmlLines.push(`  <div class="section" style="margin-bottom: 12px;">`);
        htmlLines.push(`    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #2563eb; margin-bottom: 3px; margin-top: 8px; letter-spacing: 0.5px; border:none;">Skills</h2>`);
        htmlLines.push(`    <div style="border-bottom: 1px solid #2563eb; margin-bottom: 8px;"></div>`);
        htmlLines.push(`    <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px;">`);
        validSkills.forEach(skill => {
            if (skill.trim()) {
                htmlLines.push(`      <div>${skill}</div>`);
            }
        });
        htmlLines.push(`    </div>`);
        htmlLines.push(`  </div>`);
    }

    const validAchievements = achievements.filter(a => a?.trim());
    if (validAchievements.length > 0) {
        htmlLines.push(`  <div class="section" style="margin-bottom: 12px;">`);
        htmlLines.push(`    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #2563eb; margin-bottom: 3px; margin-top: 8px; letter-spacing: 0.5px; border:none;">Achievements</h2>`);
        htmlLines.push(`    <div style="border-bottom: 1px solid #2563eb; margin-bottom: 8px;"></div>`);
        
        htmlLines.push(`    <ul style="list-style-type: disc; padding-left: 18px; margin: 0;">`);
        validAchievements.forEach(a => {
            if (a.trim()) {
                htmlLines.push(`      <li style="font-size: 13px; margin-bottom: 2px;">${a}</li>`);
            }
        });
        htmlLines.push(`    </ul>`);
        
        htmlLines.push(`  </div>`);
    }

    const validCustomSections = customSections.filter(sec => sec.name?.trim() && sec.content?.trim());
    if (validCustomSections.length > 0) {
        validCustomSections.forEach(sec => {
            htmlLines.push(`  <div class="section" style="margin-bottom: 12px;">`);
            htmlLines.push(`    <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #2563eb; margin-bottom: 3px; margin-top: 8px; letter-spacing: 0.5px; border:none;">${sec.name}</h2>`);
            htmlLines.push(`    <div style="border-bottom: 1px solid #2563eb; margin-bottom: 8px;"></div>`);
            
            if (sec.content.includes('\n')) {
                htmlLines.push(`    <ul style="list-style-type: disc; padding-left: 18px; margin: 0;">`);
                sec.content.trim().split('\n').forEach(line => {
                    if (line.trim()) {
                        htmlLines.push(`      <li style="font-size: 13px; margin-bottom: 2px;">${line}</li>`);
                    }
                });
                htmlLines.push(`    </ul>`);
            } else {
                sec.content.trim().split('\n').forEach(line => {
                    htmlLines.push(`    <p style="font-size: 13px; margin-bottom: 2px;">${line}</p>`);
                });
            }
            
            htmlLines.push(`  </div>`);
        });
    }

    htmlLines.push(`</div>`);

    return htmlLines.join('\n');
}