export interface ArtistProfile {
  name: string;
  role: string;
  bio: string;
  software: string[];
  hardware: string[];
  email: string;
  instagram: string;
  twitter: string;
  avatarUrl: string;
  softwareTitle?: string;
}

export interface DuoConfig {
  name?: string;
  subtitle: string;
  combinedBio?: string;
  creativeStatement?: string;
  mainVisualUrl: string;
  headerTag?: string;
  headerVersion?: string;
  section1Title?: string;
  section2Title?: string;
  section3Title?: string;
  section2InnerTitle?: string;
  tabAllTitle?: string;
  tabArtistsTitle?: string;
  tabGigsTitle?: string;
  tabRiderTitle?: string;
}

export interface RiderRequirements {
  ownEquipment: string[];
  stageRequirements: string[];
  additionalNotes?: string;
  sectionTitle?: string;
  sectionSub?: string;
  ownEquipmentTitle?: string;
  stageRequirementsTitle?: string;
  additionalNotesTitle?: string;
}

export interface GigLog {
  id: string;
  eventName: string;
  city: string;
  year: string;
  description: string;
  artistId?: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface PressKitData {
  duoConfig: DuoConfig;
  artist1: ArtistProfile;
  artist2: ArtistProfile;
  rider: RiderRequirements;
  gigs: GigLog[];
}
