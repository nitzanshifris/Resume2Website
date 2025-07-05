import { ComponentAdapter } from "../adapter-types";
import { IconHome, IconUser, IconBriefcase, IconMail, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

/**
 * Adapter for the FloatingDock component
 * Transforms CV data into floating dock navigation items
 */
export const FloatingDockAdapter: ComponentAdapter = {
  name: "floating-dock",
  
  transform: (data) => {
    // Extract navigation items from CV data
    const items = [];
    
    // Always add home
    items.push({
      title: "Home",
      icon: IconHome,
      href: "#home"
    });
    
    // Add about if personal info exists
    if (data.personalInfo) {
      items.push({
        title: "About",
        icon: IconUser,
        href: "#about"
      });
    }
    
    // Add projects if they exist
    if (data.projects && data.projects.length > 0) {
      items.push({
        title: "Projects",
        icon: IconBriefcase,
        href: "#projects"
      });
    }
    
    // Add contact
    items.push({
      title: "Contact",
      icon: IconMail,
      href: "#contact"
    });
    
    // Add social links if they exist
    if (data.personalInfo?.github) {
      items.push({
        title: "GitHub",
        icon: IconBrandGithub,
        href: data.personalInfo.github
      });
    }
    
    if (data.personalInfo?.linkedin) {
      items.push({
        title: "LinkedIn",
        icon: IconBrandLinkedin,
        href: data.personalInfo.linkedin
      });
    }
    
    return {
      items,
      desktopClassName: "fixed bottom-8 left-1/2 -translate-x-1/2",
      mobileClassName: "fixed bottom-4 right-4"
    };
  },
  
  styles: {
    wrapper: "",
    content: ""
  }
};