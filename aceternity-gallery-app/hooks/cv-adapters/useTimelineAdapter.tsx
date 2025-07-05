import { useMemo } from "react";
import { useCVData } from "../useCVData";
import type { TimelineEntry } from "@/components/ui/timeline/timeline.types";

export function useTimelineAdapter() {
  const cvData = useCVData();

  const timelineData = useMemo((): TimelineEntry[] => {
    if (!cvData) {
      return [
        {
          title: "2024",
          content: (
            <div>
              <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                Upload your CV to see your professional journey in timeline format
              </p>
            </div>
          ),
        },
      ];
    }

    const entries: TimelineEntry[] = [];

    // Add work experience entries
    if (cvData.workExperience?.length > 0) {
      cvData.workExperience.forEach((job) => {
        const year = job.startDate ? new Date(job.startDate).getFullYear().toString() : "Recent";
        
        entries.push({
          title: year,
          content: (
            <div>
              <h4 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                {job.position} at {job.company}
              </h4>
              {job.description && (
                <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                  {job.description}
                </p>
              )}
              {job.highlights && job.highlights.length > 0 && (
                <div className="space-y-2">
                  {job.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
                      ✅ {highlight}
                    </div>
                  ))}
                </div>
              )}
              {job.startDate && (
                <p className="text-xs text-neutral-500 mt-4">
                  {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : "Present"}
                </p>
              )}
            </div>
          ),
        });
      });
    }

    // Add education entries
    if (cvData.education?.length > 0) {
      cvData.education.forEach((edu) => {
        const year = edu.endDate ? new Date(edu.endDate).getFullYear().toString() : "Education";
        
        entries.push({
          title: year,
          content: (
            <div>
              <h4 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                {edu.degree}
              </h4>
              <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                {edu.institution}
              </p>
              {edu.description && (
                <p className="text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                  {edu.description}
                </p>
              )}
            </div>
          ),
        });
      });
    }

    // Add projects as achievements
    if (cvData.projects?.length > 0) {
      const projectsByYear: Record<string, typeof cvData.projects> = {};
      
      cvData.projects.forEach((project) => {
        const year = project.date ? new Date(project.date).getFullYear().toString() : "Projects";
        if (!projectsByYear[year]) {
          projectsByYear[year] = [];
        }
        projectsByYear[year].push(project);
      });

      Object.entries(projectsByYear).forEach(([year, projects]) => {
        entries.push({
          title: year,
          content: (
            <div>
              <h4 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
                Key Projects
              </h4>
              <div className="space-y-4">
                {projects.map((project, idx) => (
                  <div key={idx}>
                    <h5 className="font-medium mb-2 text-neutral-800 dark:text-neutral-200">
                      {project.name}
                    </h5>
                    {project.description && (
                      <p className="mb-2 text-xs font-normal text-neutral-700 md:text-sm dark:text-neutral-300">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, techIdx) => (
                          <span key={techIdx} className="text-xs bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ),
        });
      });
    }

    // Sort entries by year (most recent first)
    entries.sort((a, b) => {
      const getYear = (title: string) => {
        const match = title.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
      };
      return getYear(b.title) - getYear(a.title);
    });

    return entries.length > 0 ? entries : [
      {
        title: "Get Started",
        content: (
          <div>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Upload your CV to see your professional journey displayed in this beautiful timeline format
            </p>
          </div>
        ),
      },
    ];
  }, [cvData]);

  return {
    data: timelineData,
  };
}