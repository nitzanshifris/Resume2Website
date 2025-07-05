"use client";

import { useCVData } from '@/contexts/CVContext';
import type { MapDot } from '@/component-library/components/ui/world-map';

// Major city coordinates for mapping
const cityCoordinates = {
  // Americas
  newYork: { lat: 40.7128, lng: -74.0060 },
  losAngeles: { lat: 34.0522, lng: -118.2437 },
  sanFrancisco: { lat: 37.7749, lng: -122.4194 },
  toronto: { lat: 43.6532, lng: -79.3832 },
  mexicoCity: { lat: 19.4326, lng: -99.1332 },
  saoPaulo: { lat: -23.5505, lng: -46.6333 },
  buenosAires: { lat: -34.6037, lng: -58.3816 },
  
  // Europe
  london: { lat: 51.5074, lng: -0.1278 },
  paris: { lat: 48.8566, lng: 2.3522 },
  berlin: { lat: 52.5200, lng: 13.4050 },
  madrid: { lat: 40.4168, lng: -3.7038 },
  rome: { lat: 41.9028, lng: 12.4964 },
  amsterdam: { lat: 52.3676, lng: 4.9041 },
  zurich: { lat: 47.3769, lng: 8.5417 },
  stockholm: { lat: 59.3293, lng: 18.0686 },
  
  // Asia
  tokyo: { lat: 35.6762, lng: 139.6503 },
  beijing: { lat: 39.9042, lng: 116.4074 },
  shanghai: { lat: 31.2304, lng: 121.4737 },
  hongKong: { lat: 22.3193, lng: 114.1694 },
  singapore: { lat: 1.3521, lng: 103.8198 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  dubai: { lat: 25.2048, lng: 55.2708 },
  seoul: { lat: 37.5665, lng: 126.9780 },
  
  // Oceania
  sydney: { lat: -33.8688, lng: 151.2093 },
  melbourne: { lat: -37.8136, lng: 144.9631 },
  auckland: { lat: -36.8485, lng: 174.7633 },
  
  // Africa
  cairo: { lat: 30.0444, lng: 31.2357 },
  johannesburg: { lat: -26.2041, lng: 28.0473 },
  nairobi: { lat: -1.2921, lng: 36.8219 },
  lagos: { lat: 6.5244, lng: 3.3792 },
};

export interface WorldMapAdapterData {
  experienceConnections: MapDot[];
  educationConnections: MapDot[];
  projectConnections: MapDot[];
  globalReachConnections: MapDot[];
}

export function useWorldMapAdapter(): WorldMapAdapterData {
  const { cvData } = useCVData();

  // Helper function to find coordinates for a location
  const findCoordinates = (location: string) => {
    if (!location) return null;
    
    const locationLower = location.toLowerCase();
    
    // Try to find exact match or partial match
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (locationLower.includes(city.toLowerCase()) || 
          city.toLowerCase().includes(locationLower)) {
        return coords;
      }
    }
    
    // Default fallbacks based on common patterns
    if (locationLower.includes('remote')) {
      return cityCoordinates.sanFrancisco; // Default remote location
    }
    
    return null;
  };

  // Create connections based on work experience locations
  const experienceConnections: MapDot[] = [];
  if (cvData?.workExperience && cvData.workExperience.length > 1) {
    for (let i = 0; i < cvData.workExperience.length - 1; i++) {
      const currentLocation = findCoordinates(cvData.workExperience[i].location || '');
      const nextLocation = findCoordinates(cvData.workExperience[i + 1].location || '');
      
      if (currentLocation && nextLocation) {
        experienceConnections.push({
          start: currentLocation,
          end: nextLocation
        });
      }
    }
  }

  // Create connections based on education locations
  const educationConnections: MapDot[] = [];
  if (cvData?.education && cvData.education.length > 0) {
    cvData.education.forEach((edu, index) => {
      const eduLocation = findCoordinates(edu.institution || '');
      
      // Connect education to first work experience if available
      if (eduLocation && index === 0 && cvData?.workExperience?.[0]) {
        const firstJobLocation = findCoordinates(cvData.workExperience[0].location || '');
        if (firstJobLocation) {
          educationConnections.push({
            start: eduLocation,
            end: firstJobLocation
          });
        }
      }
    });
  }

  // Create connections based on project locations or global reach
  const projectConnections: MapDot[] = [];
  if (cvData?.projects && cvData.projects.length > 0) {
    // Create a network showing project reach
    const baseLocation = cvData?.personalInfo?.location 
      ? findCoordinates(cvData.personalInfo.location) 
      : cityCoordinates.sanFrancisco;
      
    if (baseLocation) {
      // Connect to major tech hubs to show global reach
      const techHubs = [
        cityCoordinates.london,
        cityCoordinates.tokyo,
        cityCoordinates.singapore,
        cityCoordinates.sydney
      ];
      
      techHubs.forEach(hub => {
        projectConnections.push({
          start: baseLocation,
          end: hub
        });
      });
    }
  }

  // Create a global reach visualization
  const globalReachConnections: MapDot[] = [
    // Americas to Europe
    { start: cityCoordinates.newYork, end: cityCoordinates.london },
    { start: cityCoordinates.sanFrancisco, end: cityCoordinates.paris },
    
    // Europe to Asia
    { start: cityCoordinates.london, end: cityCoordinates.singapore },
    { start: cityCoordinates.berlin, end: cityCoordinates.bangalore },
    
    // Asia to Oceania
    { start: cityCoordinates.singapore, end: cityCoordinates.sydney },
    { start: cityCoordinates.tokyo, end: cityCoordinates.melbourne },
    
    // Cross-continental
    { start: cityCoordinates.newYork, end: cityCoordinates.tokyo },
    { start: cityCoordinates.london, end: cityCoordinates.sydney },
  ];

  return {
    experienceConnections,
    educationConnections,
    projectConnections,
    globalReachConnections
  };
}

// Helper function to create custom connections based on skills
export function createSkillBasedConnections(skills: string[]): MapDot[] {
  const connections: MapDot[] = [];
  
  // Map skills to relevant tech hub locations
  const skillHubMap: Record<string, typeof cityCoordinates[keyof typeof cityCoordinates]> = {
    'javascript': cityCoordinates.sanFrancisco,
    'react': cityCoordinates.sanFrancisco,
    'python': cityCoordinates.seattle || cityCoordinates.sanFrancisco,
    'java': cityCoordinates.bangalore,
    'aws': cityCoordinates.seattle || cityCoordinates.sanFrancisco,
    'cloud': cityCoordinates.singapore,
    'ai': cityCoordinates.toronto,
    'ml': cityCoordinates.toronto,
    'blockchain': cityCoordinates.zurich,
    'fintech': cityCoordinates.london,
  };
  
  const mappedLocations = new Set<typeof cityCoordinates[keyof typeof cityCoordinates]>();
  
  skills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    for (const [key, location] of Object.entries(skillHubMap)) {
      if (skillLower.includes(key)) {
        mappedLocations.add(location);
      }
    }
  });
  
  // Create connections between skill hubs
  const locations = Array.from(mappedLocations);
  for (let i = 0; i < locations.length - 1; i++) {
    connections.push({
      start: locations[i],
      end: locations[i + 1]
    });
  }
  
  return connections;
}