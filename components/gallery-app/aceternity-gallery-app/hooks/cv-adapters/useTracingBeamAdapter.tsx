import { useMemo } from "react";
import { useCVData } from "../useCVData";
import { calsans } from "@/fonts/calsans";
import { twMerge } from "tailwind-merge";

interface TracingBeamContent {
  title: string;
  description: React.ReactNode;
  badge: string;
  image?: string;
}

export function useTracingBeamAdapter() {
  const cvData = useCVData();

  const content = useMemo((): TracingBeamContent[] => {
    if (!cvData) {
      return [
        {
          title: "Professional Journey",
          description: (
            <>
              <p>
                Upload your CV to see your career highlights presented in a
                beautiful scrollable timeline format.
              </p>
            </>
          ),
          badge: "Get Started",
        },
      ];
    }

    const items: TracingBeamContent[] = [];

    // Add personal summary
    if (cvData.personalInfo?.summary) {
      items.push({
        title: `About ${cvData.personalInfo.name || "Me"}`,
        description: (
          <>
            <p>{cvData.personalInfo.summary}</p>
          </>
        ),
        badge: "Introduction",
      });
    }

    // Add work experience
    if (cvData.workExperience?.length > 0) {
      cvData.workExperience.forEach((job, index) => {
        items.push({
          title: `${job.position} at ${job.company}`,
          description: (
            <>
              {job.description && <p className="mb-4">{job.description}</p>}
              {job.highlights && job.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1">
                  {job.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
              {job.startDate && (
                <p className="text-sm text-gray-500 mt-4">
                  {new Date(job.startDate).toLocaleDateString()} -{" "}
                  {job.endDate
                    ? new Date(job.endDate).toLocaleDateString()
                    : "Present"}
                </p>
              )}
            </>
          ),
          badge: "Experience",
        });
      });
    }

    // Add education
    if (cvData.education?.length > 0) {
      cvData.education.forEach((edu) => {
        items.push({
          title: `${edu.degree} - ${edu.institution}`,
          description: (
            <>
              {edu.description && <p>{edu.description}</p>}
              {edu.endDate && (
                <p className="text-sm text-gray-500 mt-2">
                  Graduated: {new Date(edu.endDate).getFullYear()}
                </p>
              )}
            </>
          ),
          badge: "Education",
        });
      });
    }

    // Add key projects
    if (cvData.projects?.length > 0) {
      const topProjects = cvData.projects.slice(0, 3);
      topProjects.forEach((project) => {
        items.push({
          title: project.name,
          description: (
            <>
              {project.description && <p className="mb-4">{project.description}</p>}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </>
          ),
          badge: "Project",
          image: project.image,
        });
      });
    }

    // Add skills summary
    if (cvData.skills?.length > 0) {
      const skillsByCategory = cvData.skills.reduce((acc, skill) => {
        const category = skill.category || "Technical";
        if (!acc[category]) acc[category] = [];
        acc[category].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);

      items.push({
        title: "Skills & Expertise",
        description: (
          <>
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="mb-4">
                <h4 className="font-semibold mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        ),
        badge: "Skills",
      });
    }

    return items;
  }, [cvData]);

  return {
    className: "px-6",
    content,
    renderContent: (item: TracingBeamContent, index: number) => (
      <div key={`content-${index}`} className="mb-10">
        <h2 className="bg-black dark:bg-white text-white dark:text-black rounded-full text-sm w-fit px-4 py-1 mb-4">
          {item.badge}
        </h2>

        <p className={twMerge(calsans.className, "text-xl mb-4")}>
          {item.title}
        </p>

        <div className="text-sm prose prose-sm dark:prose-invert">
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              height="400"
              width="600"
              className="rounded-lg mb-10 object-cover w-full h-48"
            />
          )}
          {item.description}
        </div>
      </div>
    ),
  };
}