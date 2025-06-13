import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, Calendar, TrendingUp, DollarSign, Brain, Activity, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, Bar, ComposedChart, PieChart, Pie, Cell } from 'recharts';
import { useDataStore } from '@/store/dataStore';
import { useAuthStore } from '@/store/authStore';

const dataAppointments = [
  { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 300, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 278, pv: 3908, amt: 2000 },
  { name: 'May', uv: 189, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 239, pv: 3800, amt: 2500 },
];

const dataRevenue = [
  { name: 'Jan', revenue: 12000 }, { name: 'Feb', revenue: 15000 },
  { name: 'Mar', revenue: 13000 }, { name: 'Apr', revenue: 17000 },
  { name: 'May', revenue: 16000 }, { name: 'Jun', revenue: 19000 },
];

const dataNoShow = [
  { name: 'Predicted No-Show', value: 15, fill: '#ef4444' },
  { name: 'Predicted Show', value: 85, fill: '#10b981' },
];

const AITreatmentSuggestions = [
    { condition: "Hypertension", suggestion: "Consider Lisinopril 10mg once daily. Monitor BP closely." },
    { condition: "Type 2 Diabetes", suggestion: "Metformin 500mg twice daily. Advise lifestyle modifications." },
    { condition: "Common Cold", suggestion: "Recommend rest, hydration, and OTC decongestants if needed." },
];


function AnalyticsPage() {
  const { appointments, billing } = useDataStore();
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="healthcare-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart2 className="w-6 h-6 text-teal-600" />
              <span>AI Analytics Dashboard</span>
            </CardTitle>
            <CardDescription>Insights and predictions powered by AI</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="healthcare-card h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2"><Calendar className="w-5 h-5 text-blue-500" /><span>Appointment Volume Forecast</span></CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dataAppointments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 6 }} name="Predicted Volume"/>
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" name="Actual Volume"/>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="healthcare-card h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2"><DollarSign className="w-5 h-5 text-green-500" /><span>Revenue Projection</span></CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={dataRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend wrapperStyle={{fontSize: "12px"}}/>
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Projected Revenue"/>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="healthcare-card h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2"><Users className="w-5 h-5 text-red-500" /><span>Patient No-Show Prediction</span></CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={dataNoShow} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} labelLine={false}
                   label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                     const RADIAN = Math.PI / 180;
                     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                     const x = cx + radius * Math.cos(-midAngle * RADIAN);
                     const y = cy + radius * Math.sin(-midAngle * RADIAN);
                     return (
                       <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10}>
                         {`${(percent * 100).toFixed(0)}%`}
                       </text>
                     );
                   }}>
                    {dataNoShow.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2">
                <p className="text-2xl font-bold text-red-500">15%</p>
                <p className="text-xs text-gray-500">Predicted No-Show Rate (Next 7 Days)</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {user?.role_name === 'Doctor' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2"><Brain className="w-5 h-5 text-purple-500" /><span>AI Treatment Suggestions</span></CardTitle>
               <CardDescription>Based on patient history and current guidelines (Mock Data)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {AITreatmentSuggestions.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-purple-700 text-sm">{item.condition}</p>
                        <p className="text-xs text-gray-600">{item.suggestion}</p>
                    </div>
                ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

    </div>
  );
}

export default AnalyticsPage;