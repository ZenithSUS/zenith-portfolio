export interface Project {
  title: string;
  description: string;
  link: string;
  demo?: string;
  tech: string[];
  image: string; // main image / thumbnail
  images?: string[]; // extra screenshots
  features: string[];
}
