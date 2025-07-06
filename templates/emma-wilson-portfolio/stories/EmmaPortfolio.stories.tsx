// AUTO-GENERATED STORY – interactive Emma-Wilson portfolio template with controls
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Rnd } from 'react-rnd';

// Base portfolio page (Next.js entrypoint)
import PortfolioPage from '../app/page';

// Optional decorative layers
import { FlickeringGrid } from "../../../aceternity-components-library/components/ui/flickering-grid";
import { Meteors } from "../../../aceternity-components-library/components/ui/meteors";
import { IconCloud } from "../../../aceternity-components-library/components/ui/icon-cloud";
import { Globe, Languages, Medal, Trophy, Users } from 'lucide-react';

/**
 * Extra args (beyond PortfolioPage) exposed to Storybook controls.
 */
interface ExtraArgs {
  /* Flickering grid */
  showFlickeringGrid: boolean;
  gridColor: string;
  fps: number;

  /* Meteors */
  showMeteors: boolean;
  meteorsCount: number;

  /* Icon cloud */
  showIconCloud: boolean;

  /* Content */
  heroName: string;
  heroRole: string;
  heroColor: string;
  roleColor: string;
  titleSize: number;

  /* Structure */
  showSkills: boolean;
  showExperience: boolean;
  showEducation: boolean;
  showAccomplishments: boolean;
  showLanguages: boolean;
  showProjects: boolean;
  showCertifications: boolean;
  showCourses: boolean;
  showVolunteer: boolean;
  showPublications: boolean;
  showContact: boolean;
}

// ---------------- Meta ----------------
const meta: Meta<typeof PortfolioPage> = {
  title: 'Templates/Portfolio/EmmaWilson',
  component: PortfolioPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000000' }],
    },
  },
  argTypes: {
    /* Flickering grid controls */
    showFlickeringGrid: { control: 'boolean', name: 'Show Grid' },
    gridColor: {
      control: 'color',
      if: { arg: 'showFlickeringGrid', truthy: true },
      name: 'Grid Color',
    },
    fps: {
      control: { type: 'range', min: 5, max: 60, step: 5 },
      if: { arg: 'showFlickeringGrid', truthy: true },
      name: 'Grid FPS',
    },

    /* Meteors controls */
    showMeteors: { control: 'boolean', name: 'Show Meteors' },
    meteorsCount: {
      control: { type: 'range', min: 5, max: 100, step: 5 },
      if: { arg: 'showMeteors', truthy: true },
      name: 'Meteors Count',
    },

    /* Icon cloud controls */
    showIconCloud: { control: 'boolean', name: 'Show Icon Cloud' },

    /* Content controls */
    heroName: { control: 'text', name: 'Hero Name' },
    heroRole: { control: 'text', name: 'Hero Role' },
    heroColor: { control: 'color', name: 'Hero Color' },
    roleColor: { control: 'color', name: 'Role Color' },
    titleSize: {
      control: { type: 'range', min: 24, max: 160, step: 4 },
      name: 'Hero Font Size (px)',
    },

    /* Structure toggles */
    showSkills: { control: 'boolean', name: 'Show Skills' },
    showExperience: { control: 'boolean', name: 'Show Experience' },
    showEducation: { control: 'boolean', name: 'Show Education' },
    showAccomplishments: { control: 'boolean', name: 'Show Accomplishments' },
    showLanguages: { control: 'boolean', name: 'Show Languages' },
    showProjects: { control: 'boolean', name: 'Show Projects' },
    showCertifications: { control: 'boolean', name: 'Show Certifications' },
    showCourses: { control: 'boolean', name: 'Show Courses' },
    showVolunteer: { control: 'boolean', name: 'Show Volunteer' },
    showPublications: { control: 'boolean', name: 'Show Publications' },
    showContact: { control: 'boolean', name: 'Show Contact' },
  },
  tags: ['autodocs'],
};
export default meta;

// ---------------- Story ----------------

type Story = StoryObj<typeof meta>;

const iconSet = [
  <Globe key="globe" className="text-sky-400" />,
  <Languages key="lang" className="text-green-400" />,
  <Medal key="medal" className="text-yellow-400" />,
  <Trophy key="trophy" className="text-orange-400" />,
  <Users key="users" className="text-purple-400" />,
];

export const Playground: Story = {
  args: {
    /* Grid */
    showFlickeringGrid: false,
    gridColor: '#38bdf8',
    fps: 30,

    /* Meteors */
    showMeteors: false,
    meteorsCount: 20,

    /* Icon cloud */
    showIconCloud: false,

    /* Content defaults */
    heroName: 'Emma Wilson',
    heroRole: 'Marketing Assistant',
    heroColor: '#FFFFFF',
    roleColor: '#FFFFFF',
    titleSize: 80,

    /* Structure defaults */
    showSkills: true,
    showExperience: true,
    showEducation: true,
    showAccomplishments: true,
    showLanguages: true,
    showProjects: true,
    showCertifications: true,
    showCourses: true,
    showVolunteer: true,
    showPublications: true,
    showContact: true,
  } as ExtraArgs,
  render: (args) => {
    const DynamicWrapper: React.FC = () => {
      const containerRef = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        // Update hero texts & styles
        const heading = container.querySelector('p.font-extrabold');
        const subHeading = container.querySelector('p.font-normal');
        if (heading) {
          heading.textContent = args.heroName;
          (heading as HTMLElement).style.color = args.heroColor;
          (heading as HTMLElement).style.fontSize = `${args.titleSize}px`;
          (heading as HTMLElement).style.opacity = '0';
        }
        if (subHeading) {
          subHeading.textContent = args.heroRole;
          (subHeading as HTMLElement).style.color = args.roleColor;
          (subHeading as HTMLElement).style.fontSize = `${Math.max(16, args.titleSize / 4)}px`;
          (subHeading as HTMLElement).style.opacity = '0';
        }

        // Section visibility
        const toggle = (id: string, show: boolean) => {
          const el = container.querySelector(`#${id}`);
          if (el) {
            (el as HTMLElement).style.display = show ? '' : 'none';
          }
        };
        // Rename "Profile" heading → "Professional Summary"
        const profileHeading = container.querySelector('#profile h2');
        if (profileHeading) {
          profileHeading.textContent = 'Professional Summary';
        }
        toggle('skills', args.showSkills);
        toggle('experience', args.showExperience);
        toggle('education', args.showEducation);
        toggle('accomplishments', args.showAccomplishments);
        toggle('languages', args.showLanguages);
        toggle('projects', args.showProjects);
        toggle('certifications', args.showCertifications);
        toggle('courses', args.showCourses);
        toggle('volunteer', args.showVolunteer);
        toggle('publications', args.showPublications);
        toggle('contact', args.showContact);
      }, [args]);

      return (
        <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
          {/* Portfolio content */}
          <PortfolioPage />

          {/* Original hero texts will be hidden individually in effect to avoid hiding our RND elements */}

          {/* Draggable/Resizable Hero Name */}
          <Rnd
            default={{ x: 0, y: 120, width: 600, height: 'auto' }}
            bounds="parent"
            enableResizing={{ bottomRight: true }}
            style={{ zIndex: 50, pointerEvents: 'auto' }}
          >
            <p
              style={{ color: args.heroColor, fontSize: args.titleSize, margin: 0, textAlign: 'center' }}
              className="font-extrabold tracking-tight w-full"
            >
              {args.heroName}
            </p>
          </Rnd>

          {/* Draggable/Resizable Hero Role */}
          <Rnd
            default={{ x: 0, y: 200, width: 400, height: 'auto' }}
            bounds="parent"
            enableResizing={{ bottomRight: true }}
            style={{ zIndex: 50, pointerEvents: 'auto' }}
          >
            <p
              style={{ color: args.roleColor, fontSize: Math.max(16, args.titleSize / 4), margin: 0, textAlign: 'center' }}
              className="font-normal w-full"
            >
              {args.heroRole}
            </p>
          </Rnd>

          {/* Decorative layers */}
          {args.showFlickeringGrid && (
            <div className="pointer-events-none absolute inset-0">
              <FlickeringGrid className="w-full h-full" color={args.gridColor} fps={args.fps} />
            </div>
          )}

          {args.showMeteors && (
            <div className="pointer-events-none absolute inset-0">
              <Meteors number={args.meteorsCount} />
            </div>
          )}

          {args.showIconCloud && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <IconCloud icons={iconSet} className="w-full h-full" />
            </div>
          )}
        </div>
      );
    };

    return <DynamicWrapper />;
  },
}; 