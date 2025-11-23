import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TransfersView = () => {
  const transfers = [
    { 
      type: "incoming", 
      amount: "$0.00", 
      status: "completed", 
      date: "2024-01-15",
      description: "Initial deposit"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Transfers</h2>
          <p className="text-white/60 mt-1">Manage your transactions and payments</p>
        </div>
        <Button className="bg-white text-black hover:bg-white/90">
          New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Total Balance</span>
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">$0.00</p>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">$0.00</p>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">$0.00</p>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Recent Transfers</h3>
        </div>
        <div className="divide-y divide-white/10">
          {transfers.length > 0 ? (
            transfers.map((transfer, index) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transfer.type === 'incoming' 
                      ? 'bg-green-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    {transfer.type === 'incoming' ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{transfer.description}</p>
                    <p className="text-sm text-white/60">{transfer.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transfer.type === 'incoming' 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {transfer.type === 'incoming' ? '+' : '-'}{transfer.amount}
                  </p>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-white/60 capitalize">{transfer.status}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <ArrowUpRight className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No transfers yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
