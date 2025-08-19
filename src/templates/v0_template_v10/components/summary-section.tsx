import type React from "react"
import TypingAnimation from "./typing-animation"

interface SummarySectionProps {
  data: {
    summaryText: string
    yearsOfExperience: number
    keySpecializations: string[]
    careerHighlights: string[]
  }
}

const SummarySection: React.FC<SummarySectionProps> = ({ data }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Summary</h2>
        <p className="text-gray-700 leading-relaxed mb-8">
          {data.summaryText && <TypingAnimation text={data.summaryText} />}
        </p>

        {data.yearsOfExperience && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Years of Experience</h3>
            <p className="text-gray-700">{data.yearsOfExperience}+ Years</p>
          </div>
        )}

        {data.keySpecializations && data.keySpecializations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Specializations</h3>
            <ul className="list-disc list-inside text-gray-700">
              {data.keySpecializations.map((specialization, index) => (
                <li key={index}>{specialization}</li>
              ))}
            </ul>
          </div>
        )}

        {data.careerHighlights && data.careerHighlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Career Highlights</h3>
            <ul className="list-disc list-inside text-gray-700">
              {data.careerHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default SummarySection
