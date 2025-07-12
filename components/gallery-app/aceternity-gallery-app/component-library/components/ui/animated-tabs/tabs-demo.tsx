"use client";
 
import { Tabs } from "./tabs-base";
 
export function TabsDemo() {
  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Product Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Services tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Playground",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Playground tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Content",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Content tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Random",
      value: "random",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Random tab</p>
          <DummyContent />
        </div>
      ),
    },
  ];
 
  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
      <Tabs tabs={tabs} />
    </div>
  );
}
 
const DummyContent = () => {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-[60%] md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto flex items-center justify-center">
      <svg
        className="w-40 h-40 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    </div>
  );
};

export function TabsMinimal() {
  const tabs = [
    {
      title: "Home",
      value: "home",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-xl p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Home</p>
          <p className="text-gray-600 dark:text-gray-300">Welcome to our homepage. Here you'll find the latest updates and featured content.</p>
        </div>
      ),
    },
    {
      title: "About",
      value: "about",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-xl p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">About Us</p>
          <p className="text-gray-600 dark:text-gray-300">Learn more about our mission, values, and the team behind our success.</p>
        </div>
      ),
    },
    {
      title: "Contact",
      value: "contact",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-xl p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Contact</p>
          <p className="text-gray-600 dark:text-gray-300">Get in touch with us through our various channels.</p>
        </div>
      ),
    },
  ];
 
  return (
    <div className="h-[20rem] [perspective:1000px] relative flex flex-col max-w-2xl mx-auto w-full items-start justify-start my-20">
      <Tabs tabs={tabs} />
    </div>
  );
}

export function TabsColorful() {
  const tabs = [
    {
      title: "Red",
      value: "red",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-red-500 to-pink-600">
          <p className="text-3xl font-bold text-white">Red Theme</p>
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-white/20 rounded-lg backdrop-blur-sm" />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Blue",
      value: "blue",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-blue-500 to-cyan-600">
          <p className="text-3xl font-bold text-white">Blue Theme</p>
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-white/20 rounded-lg backdrop-blur-sm" />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Green",
      value: "green",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-green-500 to-emerald-600">
          <p className="text-3xl font-bold text-white">Green Theme</p>
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-white/20 rounded-lg backdrop-blur-sm" />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Purple",
      value: "purple",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-purple-500 to-indigo-600">
          <p className="text-3xl font-bold text-white">Purple Theme</p>
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-white/20 rounded-lg backdrop-blur-sm" />
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];
 
  return (
    <div className="h-[30rem] [perspective:1000px] relative flex flex-col max-w-4xl mx-auto w-full items-start justify-start my-20">
      <Tabs 
        tabs={tabs}
        activeTabClassName="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-300"
      />
    </div>
  );
}

export function TabsWithIcons() {
  const tabs = [
    {
      title: "📊 Analytics",
      value: "analytics",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-indigo-500 to-purple-600">
          <p className="text-3xl font-bold text-white mb-4">Analytics Dashboard</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-white/80 text-sm mb-2">Total Views</p>
              <p className="text-4xl font-bold text-white">1.2M</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-white/80 text-sm mb-2">Active Users</p>
              <p className="text-4xl font-bold text-white">843K</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "👥 Users",
      value: "users",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-green-500 to-teal-600">
          <p className="text-3xl font-bold text-white mb-4">User Management</p>
          <div className="space-y-4">
            {["John Doe", "Jane Smith", "Bob Johnson"].map((name, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
                <p className="text-white font-medium">{name}</p>
                <span className="text-white/70 text-sm">Active</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "⚙️ Settings",
      value: "settings",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-gray-700 to-gray-900">
          <p className="text-3xl font-bold text-white mb-4">Settings</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-white">Dark Mode</span>
              <div className="w-12 h-6 bg-white/20 rounded-full p-1">
                <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-white">Notifications</span>
              <div className="w-12 h-6 bg-white/20 rounded-full p-1">
                <div className="w-4 h-4 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
 
  return (
    <div className="h-[25rem] [perspective:1000px] relative flex flex-col max-w-3xl mx-auto w-full items-start justify-start my-20">
      <Tabs tabs={tabs} tabClassName="text-sm" />
    </div>
  );
}

export function TabsResponsive() {
  const tabs = [
    {
      title: "Overview",
      value: "overview",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 md:p-10 bg-gradient-to-br from-blue-600 to-indigo-700">
          <p className="text-xl md:text-3xl font-bold text-white mb-4">Project Overview</p>
          <p className="text-white/80 text-sm md:text-base">
            Get a comprehensive view of your project's progress, milestones, and key metrics all in one place.
          </p>
        </div>
      ),
    },
    {
      title: "Tasks",
      value: "tasks",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 md:p-10 bg-gradient-to-br from-orange-500 to-red-600">
          <p className="text-xl md:text-3xl font-bold text-white mb-4">Task Management</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white font-medium">In Progress</p>
              <p className="text-3xl font-bold text-white mt-2">12</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white font-medium">Completed</p>
              <p className="text-3xl font-bold text-white mt-2">45</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Team",
      value: "team",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 md:p-10 bg-gradient-to-br from-teal-500 to-green-600">
          <p className="text-xl md:text-3xl font-bold text-white mb-4">Team Collaboration</p>
          <p className="text-white/80 text-sm md:text-base">
            Connect with your team members, share updates, and collaborate effectively.
          </p>
        </div>
      ),
    },
    {
      title: "Reports",
      value: "reports",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 md:p-10 bg-gradient-to-br from-purple-600 to-pink-700">
          <p className="text-xl md:text-3xl font-bold text-white mb-4">Reports & Analytics</p>
          <p className="text-white/80 text-sm md:text-base">
            Generate detailed reports and gain insights from your project data.
          </p>
        </div>
      ),
    },
  ];
 
  return (
    <div className="h-[20rem] md:h-[25rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start my-20">
      <Tabs 
        tabs={tabs} 
        containerClassName="flex-wrap md:flex-nowrap"
        contentClassName="mt-16 md:mt-32"
      />
    </div>
  );
}