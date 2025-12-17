import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Smartphone, TrendingUp, CheckCircle, Clock, AlertTriangle, DollarSign, Users, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const mockTransactions = [
  { id: "1", student: "Kouamé Yao", amount: 150000, method: "Orange Money", status: "completed", date: "2024-01-15 10:30" },
  { id: "2", student: "Diallo Aminata", amount: 75000, method: "MTN Money", status: "completed", date: "2024-01-15 09:15" },
  { id: "3", student: "Koné Mamadou", amount: 150000, method: "Wave", status: "pending", date: "2024-01-15 14:20" },
  { id: "4", student: "Bamba Fatou", amount: 50000, method: "Orange Money", status: "failed", date: "2024-01-14 16:45" },
];

const paymentMethods = [
  { name: "Orange Money", value: 45, color: "#f97316" },
  { name: "MTN Money", value: 30, color: "#eab308" },
  { name: "Wave", value: 20, color: "#3b82f6" },
  { name: "Moov Money", value: 5, color: "#22c55e" },
];

const monthlyRevenue = [
  { month: "Sep", amount: 12500000 },
  { month: "Oct", amount: 8900000 },
  { month: "Nov", amount: 15200000 },
  { month: "Dec", amount: 6800000 },
  { month: "Jan", amount: 18500000 },
];

const PaiementMobile = () => {
  const stats = { total: 62150000, transactions: 423, pending: 12, successRate: 94 };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paiement Mobile</h1>
          <p className="text-muted-foreground">Orange Money, MTN Money, Wave, Moov Money</p>
        </div>
        <Button onClick={() => toast.success("Synchronisation en cours...")}>
          <RefreshCw className="h-4 w-4 mr-2" />Synchroniser
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg"><DollarSign className="h-5 w-5 text-green-500" /></div>
          <div><p className="text-sm text-muted-foreground">Total collecté</p><p className="text-2xl font-bold">{(stats.total/1000000).toFixed(1)}M FCFA</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg"><CreditCard className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-sm text-muted-foreground">Transactions</p><p className="text-2xl font-bold">{stats.transactions}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg"><Clock className="h-5 w-5 text-amber-500" /></div>
          <div><p className="text-sm text-muted-foreground">En attente</p><p className="text-2xl font-bold">{stats.pending}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg"><TrendingUp className="h-5 w-5 text-primary" /></div>
          <div><p className="text-sm text-muted-foreground">Taux succès</p><p className="text-2xl font-bold">{stats.successRate}%</p></div>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList><TabsTrigger value="transactions">Transactions</TabsTrigger><TabsTrigger value="analytics">Statistiques</TabsTrigger></TabsList>
        <TabsContent value="transactions">
          <Card><CardContent className="p-0">
            <Table><TableHeader><TableRow>
              <TableHead>Date</TableHead><TableHead>Élève</TableHead><TableHead>Montant</TableHead><TableHead>Méthode</TableHead><TableHead>Statut</TableHead>
            </TableRow></TableHeader><TableBody>
              {mockTransactions.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.date}</TableCell>
                  <TableCell className="font-medium">{t.student}</TableCell>
                  <TableCell>{t.amount.toLocaleString()} FCFA</TableCell>
                  <TableCell>{t.method}</TableCell>
                  <TableCell><Badge variant={t.status === "completed" ? "default" : t.status === "pending" ? "secondary" : "destructive"}>
                    {t.status === "completed" ? "Réussi" : t.status === "pending" ? "En attente" : "Échoué"}
                  </Badge></TableCell>
                </TableRow>
              ))}
            </TableBody></Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="grid grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle>Revenus mensuels</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyRevenue}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#3b82f6" /></BarChart>
              </ResponsiveContainer>
            </CardContent></Card>
            <Card><CardHeader><CardTitle>Méthodes de paiement</CardTitle></CardHeader><CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart><Pie data={paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {paymentMethods.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaiementMobile;
