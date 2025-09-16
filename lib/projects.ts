"use server";

import { projects } from "@/data/projects";
import { Project } from "@/types/projects";

export async function getProjects(): Promise<Project[]> {
  const res = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(projects);
      reject(new Error("Failed to fetch projects"));
    }, 1000);
  });
  return res as Promise<Project[]>;
}
