import { AccordionItem } from './AccordionItem'

const faqData = [
  {
    question: 'How long does the conversion process take?',
    answer: 'Typically, the conversion process takes between 5 to 7 business days, depending on the complexity of the resume.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Our pricing is based on the package you choose. Please visit our pricing page for detailed information.',
  },
  {
    question: 'Do I need any technical skills to use this?',
    answer: 'Not at all! We handle all the technical aspects. You just need to provide your resume file, and we do the rest.',
  },
  {
    question: 'Can I get a custom domain name?',
    answer: 'Yes, custom domain names are available as an add-on service. You can choose your desired domain during the checkout process.',
  },
  {
    question: 'Can I customize the design and layout?',
    answer: 'Absolutely. We offer several templates and customization options to ensure your interactive resume matches your personal brand.',
  },
  {
    question: 'What if I\'m not satisfied with the result?',
    answer: 'We offer a satisfaction guarantee. You will have a chance to review the website and request revisions before it goes live.',
  },
   {
    question: 'What file formats do you accept?',
    answer: 'We accept most common file formats, including PDF, DOCX, and TXT files.',
  },
  {
    question: 'Do you provide hosting and maintenance?',
    answer: 'Yes, all our plans include secure hosting and basic maintenance to ensure your website is always online and up-to-date.',
  },
];

export function FaqSection() {
  return (
    // NOTE: This component should be placed on a colorful or image background
    // for the glass effect to be noticeable.
    <div className="p-8">
      <section className="liquid-glass p-8 sm:p-12">
        {/* Stacking context wrapper */}
        <div style={{ position: 'relative', zIndex: 2 }}>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-gray-300">
              Everything you need to know about transforming your resume into an
              interactive website
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
              {faqData.map((item, index) => (
                <AccordionItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 