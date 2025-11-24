import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface InspirationalQuoteProps {
  quote: string;
  highlightedWords: string[];
  author: string;
  location?: string;
}

export const InspirationalQuote = ({ 
  quote, 
  highlightedWords, 
  author,
  location 
}: InspirationalQuoteProps) => {
  // Function to highlight specific words in the quote
  const renderQuoteWithHighlights = () => {
    let processedQuote = quote;
    
    highlightedWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      processedQuote = processedQuote.replace(
        regex, 
        '<span class="bg-primary/20 px-2 py-1">$1</span>'
      );
    });
    
    return { __html: processedQuote };
  };

  return (
    <section className="relative py-32 bg-background">
      <div className="container max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Quote Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <Quote className="w-16 h-16 md:w-24 md:h-24 text-primary" fill="currentColor" />
          </motion.div>

          {/* Quote Text */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono leading-tight mb-12"
            dangerouslySetInnerHTML={renderQuoteWithHighlights()}
          />

          {/* Attribution */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-foreground/70 font-medium"
          >
            — {author}{location && `, ${location}`}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
