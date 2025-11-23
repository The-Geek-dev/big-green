import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MyGardensView = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Gardens</h1>
          <p className="text-white/50">Manage and track all your garden projects</p>
        </div>
        <Button 
          size="sm" 
          className="bg-green-500 hover:bg-green-600 text-black font-medium"
          onClick={() => navigate("/application")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Garden
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No gardens yet</h3>
            <p className="text-white/50 text-sm mb-4">Start your first garden project to see it here</p>
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/10 hover:bg-white/10"
              onClick={() => navigate("/application")}
            >
              Create Garden
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
