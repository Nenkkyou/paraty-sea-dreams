import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const PlaceholderPage = ({ title, description, icon: Icon }: PlaceholderPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <Card className="border-0 shadow-lg max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ocean-navy/10 to-ocean-teal/10 flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-ocean-teal" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 mb-6">{description}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-50 py-2 px-4 rounded-lg">
            <Construction className="w-4 h-4" />
            <span>Em desenvolvimento</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlaceholderPage;
