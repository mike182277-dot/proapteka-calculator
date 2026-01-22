import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, TrendingUp } from 'lucide-react';
import { ScenarioComparison } from './ScenarioComparison';

interface MarketingEvent {
  id: string;
  name: string;
  enabled: boolean;
  shareOfPurchase: number; // в процентах
  profitability: number; // в процентах
}

const MARKETING_EVENTS: MarketingEvent[] = [
  { id: 'purchases', name: 'ЗАКУПКИ ПО КОНЦЕРНАМ (план на квартал)', enabled: true, shareOfPurchase: 28, profitability: 3.4 },
  { id: 'vmt', name: 'ВМТ', enabled: true, shareOfPurchase: 6, profitability: 22 },
  { id: 'ustm', name: 'УСТМ (план закупа на месяц)', enabled: true, shareOfPurchase: 7, profitability: 10 },
  { id: 'stm', name: 'СТМ (план закупки на квартал)', enabled: true, shareOfPurchase: 2.92, profitability: 19.9 },
  { id: 'matrix', name: 'МАТРИЦА с поддержанием на остатке', enabled: true, shareOfPurchase: 12, profitability: 5 },
  { id: 'warehouse', name: 'ПОСТАВКИ СО СКЛАДА ПА', enabled: true, shareOfPurchase: 8.1, profitability: 4.5 },
  { id: 'daygoods', name: 'Товар дня (обычный и ВМТ)', enabled: true, shareOfPurchase: 1.64, profitability: 35 },
  { id: 'commercial', name: 'КОММЕРЧЕСКИЙ ВВОД', enabled: true, shareOfPurchase: 0.1, profitability: 100 },
  { id: 'trademark', name: 'ТРЕЙД МАРКЕТИНГ (Обучение, Программа "Лояльность")', enabled: true, shareOfPurchase: 0.1, profitability: 10 },
  { id: 'cv', name: 'ЗАКУП НА ЦВ ПРОТЕК', enabled: true, shareOfPurchase: 20, profitability: 1 },
];

export default function Calculator() {
  // Основные параметры
  const [soz, setSoz] = useState(2500000); // СОЗ в рублях
  const [months, setMonths] = useState(3); // количество месяцев
  const [pharmacies, setPharmacies] = useState(1); // количество аптек

  // Маркетинговые события
  const [events, setEvents] = useState<MarketingEvent[]>(MARKETING_EVENTS);
  const [deepIntegrationLevel, setDeepIntegrationLevel] = useState('1.5');

  // Расчеты
  const calculations = useMemo(() => {
    const totalSoz = soz * months * pharmacies;
    
    let totalBonus = 0;
    let totalMarketingShare = 0;
    const eventCalculations: Array<{
      id: string;
      name: string;
      purchaseAmount: number;
      bonus: number;
      profitability: number;
    }> = [];

    events.forEach(event => {
      if (event.enabled) {
        const purchaseAmount = totalSoz * (event.shareOfPurchase / 100);
        const bonus = purchaseAmount * (event.profitability / 100);
        totalBonus += bonus;
        totalMarketingShare += event.shareOfPurchase;

        eventCalculations.push({
          id: event.id,
          name: event.name,
          purchaseAmount,
          bonus,
          profitability: event.profitability,
        });
      }
    });

    // Комплексное письмо - 10% от суммы бонуса
    const complexLetterBonus = totalBonus * 0.1;
    totalBonus += complexLetterBonus;

    const bonusPercentage = totalSoz > 0 ? (totalBonus / totalSoz) * 100 : 0;
    const bonusPerMonth = totalBonus / (months * pharmacies);

    return {
      totalSoz,
      totalBonus,
      bonusPercentage,
      bonusPerMonth,
      totalMarketingShare,
      eventCalculations,
      complexLetterBonus,
    };
  }, [soz, months, pharmacies, events]);

  const toggleEvent = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e));
  };

  const updateEventShare = (id: string, share: number) => {
    setEvents(events.map(e => e.id === id ? { ...e, shareOfPurchase: share } : e));
  };

  const updateEventProfitability = (id: string, profit: number) => {
    setEvents(events.map(e => e.id === id ? { ...e, profitability: profit } : e));
  };

  // Данные для графиков
  const chartData = calculations.eventCalculations
    .filter(e => e.bonus > 0)
    .map(e => ({
      name: e.name.substring(0, 20),
      bonus: Math.round(e.bonus),
      profitability: e.profitability,
    }))
    .sort((a, b) => b.bonus - a.bonus);

  const pieData = calculations.eventCalculations
    .filter(e => e.bonus > 0)
    .map((e, idx) => ({
      name: e.name.substring(0, 15),
      value: Math.round(e.bonus),
      color: ['#f97316', '#7c3aed', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'][idx % 8],
    }));

  const COLORS = ['#f97316', '#7c3aed', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Калькулятор бонусов ПроАптека</h1>
          <p className="text-slate-400">Расчет ожидаемых бонусов при сотрудничестве с ООО "ПроАптека"</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 mb-6">
            <TabsTrigger value="calculator" className="text-base">Калькулятор</TabsTrigger>
            <TabsTrigger value="comparison" className="text-base">Сравнение сценариев</TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Inputs */}
              <div className="lg:col-span-1 space-y-6">
                {/* Basic Parameters */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Основные параметры</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300 mb-2 block">СОЗ в квартал (руб.)</Label>
                      <Input
                        type="number"
                        value={soz}
                        onChange={(e) => setSoz(Number(e.target.value))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">Количество месяцев</Label>
                      <Input
                        type="number"
                        value={months}
                        onChange={(e) => setMonths(Number(e.target.value))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 mb-2 block">Количество аптек</Label>
                      <Input
                        type="number"
                        value={pharmacies}
                        onChange={(e) => setPharmacies(Number(e.target.value))}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </Card>

                {/* Key Metrics */}
                <Card className="bg-gradient-to-br from-purple-600/20 to-orange-600/20 border-purple-500/30 backdrop-blur-sm p-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4">ИТОГОВЫЕ ПОКАЗАТЕЛИ</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Общий бонус (квартал)</p>
                      <p className="text-3xl font-bold text-orange-400">
                        {Math.round(calculations.totalBonus).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <p className="text-slate-400 text-sm mb-1">Бонус в месяц</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {Math.round(calculations.bonusPerMonth).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <p className="text-slate-400 text-sm mb-1">Доля бонуса в СОЗ</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {calculations.bonusPercentage.toFixed(2)}%
                      </p>
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <p className="text-slate-400 text-sm mb-1">Доля маркетинга в СОЗ</p>
                      <p className="text-xl font-bold text-pink-400">
                        {calculations.totalMarketingShare.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Visualizations */}
              <div className="lg:col-span-2 space-y-6">
                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bar Chart */}
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-4">
                    <h3 className="text-sm font-semibold text-white mb-4">Бонусы по мероприятиям</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                          labelStyle={{ color: '#f1f5f9' }}
                        />
                        <Bar dataKey="bonus" fill="#f97316" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Pie Chart */}
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-4">
                    <h3 className="text-sm font-semibold text-white mb-4">Распределение бонусов</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toLocaleString('ru-RU')}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                          labelStyle={{ color: '#f1f5f9' }}
                          formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                {/* Events Configuration */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Маркетинговые мероприятия</h3>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                        <Switch
                          checked={event.enabled}
                          onCheckedChange={() => toggleEvent(event.id)}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{event.name}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Input
                            type="number"
                            value={event.shareOfPurchase}
                            onChange={(e) => updateEventShare(event.id, Number(e.target.value))}
                            className="w-16 bg-slate-600 border-slate-500 text-white text-xs"
                            step="0.1"
                            disabled={!event.enabled}
                          />
                          <Input
                            type="number"
                            value={event.profitability}
                            onChange={(e) => updateEventProfitability(event.id, Number(e.target.value))}
                            className="w-16 bg-slate-600 border-slate-500 text-white text-xs"
                            step="0.1"
                            disabled={!event.enabled}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Detailed Breakdown Table */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Детальный расчет по мероприятиям</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-2 px-2 text-slate-300">Мероприятие</th>
                          <th className="text-right py-2 px-2 text-slate-300">Участие</th>
                          <th className="text-right py-2 px-2 text-slate-300">Сумма (₽)</th>
                          <th className="text-right py-2 px-2 text-slate-300">Доля закупа (%)</th>
                          <th className="text-right py-2 px-2 text-slate-300">Доходность (%)</th>
                          <th className="text-right py-2 px-2 text-slate-300">Бонус (₽)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculations.eventCalculations.map((event) => (
                          <tr key={event.id} className="border-b border-slate-800 hover:bg-slate-700/30">
                            <td className="py-2 px-2 text-slate-300">{event.name}</td>
                            <td className="text-right py-2 px-2 text-cyan-400">Да</td>
                            <td className="text-right py-2 px-2 text-purple-300">{event.purchaseAmount.toLocaleString('ru-RU')}</td>
                            <td className="text-right py-2 px-2 text-orange-300">{((event.purchaseAmount / calculations.totalSoz) * 100).toFixed(1)}%</td>
                            <td className="text-right py-2 px-2 text-green-300">{event.profitability.toFixed(1)}%</td>
                            <td className="text-right py-2 px-2 font-semibold text-yellow-300">{event.bonus.toLocaleString('ru-RU')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <ScenarioComparison
              baselineScenario={{
                totalBonus: calculations.totalBonus,
                monthlyBonus: calculations.bonusPerMonth,
                bonusPercentage: calculations.bonusPercentage,
                marketingPercentage: calculations.totalMarketingShare,
              }}
              deepIntegrationLevel={deepIntegrationLevel}
              onDeepIntegrationLevelChange={setDeepIntegrationLevel}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
