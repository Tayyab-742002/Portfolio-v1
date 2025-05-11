"use client";
import { FC, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Toaster, toast } from "react-hot-toast";
import { SuccessIcon, ErrorIcon, WarningIcon } from "@/components/icons/ToastIcons";

/**
 * Props for `Contact`.
 */
export type ContactProps = SliceComponentProps<Content.ContactSlice>;

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Component for "Contact" Slices.
 */
const Contact: FC<ContactProps> = ({ slice }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors", {
        style: {
          background: '#14141e',
          color: '#fff',
          border: '1px solid #4f8fff',
          boxShadow: '0 0 15px rgba(79, 143, 255, 0.3)',
        },
        icon: <WarningIcon />,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: "xdtayyab0@gmail.com",
      };

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      toast.success("Message sent successfully!", {
        style: {
          background: '#14141e',
          color: '#fff',
          border: '1px solid #4f8fff',
          boxShadow: '0 0 15px rgba(79, 143, 255, 0.3)',
        },
        icon: <SuccessIcon />,
        duration: 5000,
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send message. Please try again.", {
        style: {
          background: '#14141e',
          color: '#fff',
          border: '1px solid #4f8fff',
          boxShadow: '0 0 15px rgba(79, 143, 255, 0.3)',
        },
        icon: <ErrorIcon />,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <section
      className="min-h-screen relative py-20 px-4"
      data-slice-type="contact"
    >
      {/* Section Header */}
      <motion.div
        className="mb-20 pl-4 md:pl-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4">
          <span className="text-[#4f8fff] text-lg tracking-wider neon-text">
            07
          </span>
          <h2 className="text-2xl font-bold text-white tracking-wider">
            GET IN TOUCH
          </h2>
        </div>
        <div className="w-32 h-0.5 mt-2 bg-[#4f8fff] ml-9 neon-divider" />
      </motion.div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div>
            <h3 className="text-white text-xl mb-8">Contact Information</h3>

            {/* Contact Details */}
            <div className="space-y-6">
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center">
                  <span className="text-[#4f8fff]">@</span>
                </div>
                <span className="text-white">{slice.primary.email}</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-4"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center">
                  <span className="text-[#4f8fff]">P</span>
                </div>
                <span className="text-white">{slice.primary.phone_number}</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-4"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center">
                  <span className="text-[#4f8fff]">L</span>
                </div>
                <span className="text-white">{slice.primary.address}</span>
              </motion.div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white text-xl mb-6">Connect With Me</h3>
            <div className="flex gap-3">
              {slice.primary.social_links.map((item, index) => (
                <div key={index} className="flex gap-3">
                  {item.linkedln && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PrismicNextLink
                        field={item.linkedln}
                        className="w-8 h-8 rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center text-[#4f8fff] hover:bg-[#4f8fff] hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="12" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </PrismicNextLink>
                    </motion.div>
                  )}
                  {item.github && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PrismicNextLink
                        field={item.github}
                        className="w-8 h-8 rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center text-[#4f8fff] hover:bg-[#4f8fff] hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                      </PrismicNextLink>
                    </motion.div>
                  )}
                  {item.instagram && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <PrismicNextLink
                        field={item.instagram}
                        className="w-8 h-8 rounded-full bg-[#14141e] border border-[#4f8fff] flex items-center justify-center text-[#4f8fff] hover:bg-[#4f8fff] hover:text-white transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </PrismicNextLink>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#14141e]  border border-[#252535] rounded-xl p-8 w-full max-w-xl mx-auto lg:mr-0"
          style={{
            animation: "float 4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
            boxShadow: `
              0 0 15px rgba(79, 143, 255, 0.07),
              0 0 30px rgba(79, 143, 255, 0.03),
              0 0 45px rgba(79, 143, 255, 0.015),
              inset 0 0 15px rgba(79, 143, 255, 0.02)
            `,
          }}
        >
          <h3 className="text-white text-2xl mb-8">Send Me a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-[#14141e] border ${
                  errors.name ? "border-red-500" : "border-[#252535]"
                } rounded-lg p-4 text-white focus:border-[#4f8fff] transition-colors outline-none text-base`}
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">{errors.name}</span>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[#14141e] border ${
                  errors.email ? "border-red-500" : "border-[#252535]"
                } rounded-lg p-4 text-white focus:border-[#4f8fff] transition-colors outline-none text-base`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email}
                </span>
              )}
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full bg-[#14141e] border ${
                  errors.message ? "border-red-500" : "border-[#252535]"
                } rounded-lg p-4 text-white focus:border-[#4f8fff] transition-colors outline-none resize-none text-base`}
                disabled={isSubmitting}
              />
              {errors.message && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.message}
                </span>
              )}
            </motion.div>

            <div className="flex justify-center mt-8">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(79, 143, 255, 0.4)",
                }}
                type="submit"
                whileTap={{ scale: 0.95 }}
                className="button-shine bg-[#4f8fff] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#4f8fff]/90 transition-all duration-300 text-sm font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transform transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        d="M13 3L22 12L13 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12H22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#4f8fff]/0 via-white/20 to-[#4f8fff]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .neon-text {
          text-shadow: 0 0 10px rgba(79, 143, 255, 0.5);
        }
        .neon-divider {
          box-shadow: 0 0 10px rgba(79, 143, 255, 0.3);
        }
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }

        /* Add a subtle glow effect to the form inputs on focus */
        input:focus,
        textarea:focus {
          box-shadow: 0 0 15px rgba(79, 143, 255, 0.15);
        }
      `}</style>
    </section>
  );
};

export default Contact;
