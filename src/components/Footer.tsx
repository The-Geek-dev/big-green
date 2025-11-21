import { Twitter, Facebook, Linkedin, Youtube, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import logoWhite from "@/assets/logo-color.png";

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full py-12 mt-20 bg-black"
    >
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <img src={logoWhite} alt="Big Green" className="h-16 w-auto" />
            <div className="flex space-x-3">
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-md bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-md bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-md bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-md bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4 text-white" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-md bg-primary/20 hover:bg-primary flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">What We Do</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Our Impact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Jumpstart
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Home Gardens
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Grantmaking
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Big Green</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Work at Big Green
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Finances
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  Get In Touch
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  For Educators
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
              Terms of Service
            </a>
          </div>
          <p className="text-xs text-gray-400">
            Copyright © {new Date().getFullYear()} All Rights Reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;