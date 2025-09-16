import skills from "@/data/skills";
import { Skills } from "@/types/skills";

export async function getSkills(): Promise<Skills[]> {
  const res = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(skills);
      reject(new Error("Failed to fetch skills"));
    }, 1000);
  });
  return res as Promise<Skills[]>;
}
