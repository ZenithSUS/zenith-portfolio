"use client";

import { motion } from "framer-motion";
import Particles from "@/components/ui/particles";
import BackgroundMist from "@/components/ui/background-mist";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import Header from "../ui/header";
import { sendMessage } from "@/actions/send-message";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitted(true);
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("message", formData.message);

      const response = await sendMessage(data);
      setFormData({ name: "", email: "", message: "" });
      if (response.success) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <motion.section
      id="contact"
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:px-8 sm:py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Background */}
      <BackgroundMist />
      <Particles />

      {/* Title */}
      <Header>
        <div className="flex items-center gap-2">
          <FaEnvelope color="#00cfff" /> Contact Me
        </div>
      </Header>

      {/* Contact Form */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glow-border bg-foreground/30 relative flex w-full max-w-lg flex-col gap-5 rounded-2xl p-8 shadow-lg backdrop-blur-lg"
        onSubmit={handleSubmit}
      >
        <motion.input
          type="text"
          placeholder="Your Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #00cfff" }}
          className="bg-background/50 text-text rounded-lg px-4 py-3 focus:outline-none"
        />
        <motion.input
          type="email"
          placeholder="Your Email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #00cfff" }}
          className="bg-background/50 text-text rounded-lg px-4 py-3 focus:outline-none"
        />
        <motion.textarea
          placeholder="Your Message..."
          name="message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={5}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #00cfff" }}
          className="bg-background/50 text-text resize-none rounded-lg px-4 py-3 focus:outline-none"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px #7f00ff" }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitted}
          className="bg-primary text-background rounded-lg px-6 py-3 font-semibold shadow-md transition disabled:pointer-events-none disabled:opacity-50"
        >
          Send Message
        </motion.button>
      </motion.form>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="z-10 mt-8 flex gap-6"
      >
        <a
          href="https://github.com/ZenithSUS"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:scale-110"
        >
          <FaGithub className="h-8 w-8" />
        </a>
        <motion.a
          href="https://www.linkedin.com/in/jeran-christopher-d-merino-24672a348/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileFocus={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <FaLinkedin className="h-8 w-8" />
        </motion.a>
        <a
          href="mailto:jeranmerino147@gmail.com"
          target="_blank"
          className="cursor-pointer transition hover:scale-110"
        >
          <FaEnvelope className="h-8 w-8" />
        </a>
      </motion.div>
    </motion.section>
  );
}
