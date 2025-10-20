import Home from "@/components/pages/home";
import Project from "@/components/pages/project";
import Contact from "@/components/pages/contact";
import Testimonials from "@/components/pages/testimonials";
import Skills from "@/components/pages/skills";
import ChatInterface from "@/components/ui/chatbot";
import { getProjects } from "@/lib/projects";
import { getTestimonials } from "@/lib/testimonials";
import { getSkills } from "@/lib/skills";

export default async function Portfolio() {
  const [skills, projects, testimonials] = await Promise.all([
    getSkills(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <main className="flex flex-col">
      <Home />
      <Skills skills={skills} />
      <Project projects={projects} />
      <Testimonials testimonials={testimonials} />
      <Contact />
      <ChatInterface />
    </main>
  );
}
