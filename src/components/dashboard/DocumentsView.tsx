import { FileText, Download, Upload, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const DocumentsView = () => {
  const documents = [
    { name: "Garden Project Report 2024", type: "PDF", size: "2.4 MB", date: "2024-01-15" },
    { name: "Sustainability Certificate", type: "PDF", size: "1.1 MB", date: "2024-01-10" },
    { name: "Impact Analysis Q1", type: "XLSX", size: "856 KB", date: "2024-01-05" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Documents</h2>
          <p className="text-white/60 mt-1">Manage your project documents and reports</p>
        </div>
        <Button className="bg-white text-black hover:bg-white/90">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <Card key={index} className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{doc.name}</h3>
                    <p className="text-sm text-white/60">
                      {doc.type} • {doc.size} • {doc.date}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="bg-white/5 border-white/10 p-12 text-center">
            <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">No documents yet</p>
          </Card>
        )}
      </div>
    </div>
  );
};
