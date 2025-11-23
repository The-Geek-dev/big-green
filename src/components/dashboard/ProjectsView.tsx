import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProjectsView = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Projects</h1>
          <p className="text-white/50">View all your environmental impact projects</p>
        </div>
        <Button 
          size="sm" 
          className="bg-green-500 hover:bg-green-600 text-black font-medium"
          onClick={() => navigate("/application")}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-white/50 text-sm mb-4">Create your first project to get started</p>
            <Button 
              variant="outline" 
              className="bg-white/5 border-white/10 hover:bg-white/10"
              onClick={() => navigate("/application")}
            >
              Start Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
