"use server";

import { testimonials } from "@/data/testimonials";
import { Testimonials } from "@/types/testimonials";

export async function getTestimonials(): Promise<Testimonials[]> {
  const res = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(testimonials);
      reject(new Error("Failed to fetch testimonials"));
    }, 1000);
  });
  return res as Promise<Testimonials[]>;
}
