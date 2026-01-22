import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { useState } from "react";

interface ScenarioData {
  totalBonus: number;
  monthlyBonus: number;
  bonusPercentage: number;
  marketingPercentage: number;
}

interface ScenarioComparisonProps {
  baselineScenario: ScenarioData;
  deepIntegrationLevel: string;
  onDeepIntegrationLevelChange: (level: string) => void;
}

export function ScenarioComparison({
  baselineScenario,
  deepIntegrationLevel,
  onDeepIntegrationLevelChange,
}: ScenarioComparisonProps) {
  // Deep integration multipliers based on level
  const deepIntegrationMultipliers: Record<string, number> = {
    "1.5": 1.5,
    "3": 3,
    "4": 4,
    "5": 5,
  };

  const multiplier = deepIntegrationMultipliers[deepIntegrationLevel] || 1.5;
  
  // Calculate deep integration scenario
  const deepIntegrationScenario: ScenarioData = {
    totalBonus: baselineScenario.totalBonus * (multiplier / 5.4),
    monthlyBonus: (baselineScenario.totalBonus * (multiplier / 5.4)) / 3, // Assuming 3 months
    bonusPercentage: multiplier,
    marketingPercentage: baselineScenario.marketingPercentage,
  };

  // Calculate differences
  const bonusDifference = deepIntegrationScenario.totalBonus - baselineScenario.totalBonus;
  const bonusDifferencePercent = ((bonusDifference / baselineScenario.totalBonus) * 100).toFixed(1);

  // Prepare data for comparison chart
  const comparisonData = [
    {
      name: "Базовый режим",
      "Общий бонус (₽)": baselineScenario.totalBonus,
      "Бонус в месяц (₽)": baselineScenario.monthlyBonus,
    },
    {
      name: "Глубокая интеграция",
      "Общий бонус (₽)": deepIntegrationScenario.totalBonus,
      "Бонус в месяц (₽)": deepIntegrationScenario.monthlyBonus,
    },
  ];

  // Prepare data for growth chart
  const growthData = [
    {
      name: "Общий бонус",
      "Базовый режим": baselineScenario.totalBonus,
      "Глубокая интеграция": deepIntegrationScenario.totalBonus,
      difference: bonusDifference,
    },
    {
      name: "Бонус в месяц",
      "Базовый режим": baselineScenario.monthlyBonus,
      "Глубокая интеграция": deepIntegrationScenario.monthlyBonus,
      difference: deepIntegrationScenario.monthlyBonus - baselineScenario.monthlyBonus,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg text-purple-300">Параметры глубокой интеграции</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="integration-level" className="text-sm text-gray-300">
                Уровень вознаграждения (% от СОЗ)
              </Label>
              <Select value={deepIntegrationLevel} onValueChange={onDeepIntegrationLevelChange}>
                <SelectTrigger id="integration-level" className="mt-2 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="1.5">1.5% - СУПЕР ЛАЙТ (базовый)</SelectItem>
                  <SelectItem value="3">3% - ЛАЙТ</SelectItem>
                  <SelectItem value="4">4% - ВЫГОДНЫЙ</SelectItem>
                  <SelectItem value="5">5% - ДОХОДНЫЙ</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-gray-400">
                При глубокой интеграции требуются дополнительные условия: выполнение планов по приоритетным концернам, СТМ, УСТМ, ВМТ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Tabs */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="comparison" className="text-sm">Сравнение</TabsTrigger>
          <TabsTrigger value="metrics" className="text-sm">Метрики</TabsTrigger>
          <TabsTrigger value="details" className="text-sm">Детали</TabsTrigger>
        </TabsList>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          {/* Comparison Chart */}
          <Card className="border-orange-500/30 bg-gradient-to-br from-orange-950/20 to-transparent">
            <CardHeader>
              <CardTitle className="text-base">Сравнение бонусов</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }}
                    formatter={(value) => `₽${value.toLocaleString('ru-RU')}`}
                  />
                  <Legend />
                  <Bar dataKey="Общий бонус (₽)" fill="#f97316" />
                  <Bar dataKey="Бонус в месяц (₽)" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-500/30 bg-gradient-to-br from-green-950/20 to-transparent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Разница в общем бонусе</p>
                  <p className="text-3xl font-bold text-green-400">
                    +₽{bonusDifference.toLocaleString('ru-RU')}
                  </p>
                  <p className="text-xs text-green-300 mt-2">
                    +{bonusDifferencePercent}% от базового
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-transparent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Бонус в месяц (ГИ)</p>
                  <p className="text-3xl font-bold text-purple-400">
                    ₽{deepIntegrationScenario.monthlyBonus.toLocaleString('ru-RU')}
                  </p>
                  <p className="text-xs text-purple-300 mt-2">
                    vs ₽{baselineScenario.monthlyBonus.toLocaleString('ru-RU')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/30 bg-gradient-to-br from-orange-950/20 to-transparent">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Доля бонуса в СОЗ</p>
                  <p className="text-3xl font-bold text-orange-400">
                    {deepIntegrationScenario.bonusPercentage.toFixed(1)}%
                  </p>
                  <p className="text-xs text-orange-300 mt-2">
                    vs {baselineScenario.bonusPercentage.toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-transparent">
            <CardHeader>
              <CardTitle className="text-base">График роста бонусов</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #444" }}
                    formatter={(value) => `₽${value.toLocaleString('ru-RU')}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="Базовый режим" stroke="#7c3aed" strokeWidth={2} />
                  <Line type="monotone" dataKey="Глубокая интеграция" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-950/20 to-transparent">
            <CardHeader>
              <CardTitle className="text-base">Сравнительная таблица</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-3 text-gray-300">Показатель</th>
                      <th className="text-right py-2 px-3 text-gray-300">Базовый режим</th>
                      <th className="text-right py-2 px-3 text-gray-300">Глубокая интеграция</th>
                      <th className="text-right py-2 px-3 text-gray-300">Разница</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-2 px-3 text-gray-300">Общий бонус (₽)</td>
                      <td className="text-right py-2 px-3 text-purple-300">
                        {baselineScenario.totalBonus.toLocaleString('ru-RU')}
                      </td>
                      <td className="text-right py-2 px-3 text-orange-300">
                        {deepIntegrationScenario.totalBonus.toLocaleString('ru-RU')}
                      </td>
                      <td className="text-right py-2 px-3 text-green-400 font-semibold">
                        +{bonusDifference.toLocaleString('ru-RU')}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-2 px-3 text-gray-300">Бонус в месяц (₽)</td>
                      <td className="text-right py-2 px-3 text-purple-300">
                        {baselineScenario.monthlyBonus.toLocaleString('ru-RU')}
                      </td>
                      <td className="text-right py-2 px-3 text-orange-300">
                        {deepIntegrationScenario.monthlyBonus.toLocaleString('ru-RU')}
                      </td>
                      <td className="text-right py-2 px-3 text-green-400 font-semibold">
                        +{(deepIntegrationScenario.monthlyBonus - baselineScenario.monthlyBonus).toLocaleString('ru-RU')}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-2 px-3 text-gray-300">Доля бонуса в СОЗ (%)</td>
                      <td className="text-right py-2 px-3 text-purple-300">
                        {baselineScenario.bonusPercentage.toFixed(1)}%
                      </td>
                      <td className="text-right py-2 px-3 text-orange-300">
                        {deepIntegrationScenario.bonusPercentage.toFixed(1)}%
                      </td>
                      <td className="text-right py-2 px-3 text-green-400 font-semibold">
                        +{(deepIntegrationScenario.bonusPercentage - baselineScenario.bonusPercentage).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-950/20 to-transparent">
            <CardHeader>
              <CardTitle className="text-base">Условия глубокой интеграции</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-yellow-300 mb-2">Уровень {deepIntegrationLevel}% - Обязательные условия:</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>✓ Исполнение Матрицы по средневзвешенному уровню остатков ассортимента в АУ ({'>'}40%)</li>
                  <li>✓ Выполнение плана закупки СТМ (≥100%)</li>
                  <li>✓ Выполнение плана закупа ассортимента УСТМ (≥50%)</li>
                  <li>✓ Выполнение плана закупа ассортимента ВМТ (≥60%-90% в зависимости от уровня)</li>
                  <li>✓ Выполнение плана закупа по приоритетным концернам ФОС ({'>'}80%, 6 месяцев)</li>
                  <li>✓ Выполнение плана закупа по приоритетным концернам ПРИОРИТЕТ ({'>'}80%, 3-5 месяцев)</li>
                  <li>✓ Отсутствие прямых контрактов и пересечений с другими маркетинговыми союзами</li>
                </ul>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold text-yellow-300 mb-2">Приоритетные концерны (ФОС):</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>• Акрихин Бренды</div>
                  <div>• Гротекс (Солофарм)</div>
                  <div>• Обновление (Реневал)</div>
                  <div>• КРКА</div>
                  <div>• Опеллa (Сандоз ОТС)</div>
                  <div>• Петровакс Фарм</div>
                  <div>• СанФарма-Ранбаксі</div>
                  <div>• Северная Звезда</div>
                  <div>• Новартис</div>
                  <div>• Матерія Медика</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="font-semibold text-yellow-300 mb-2">Приоритетные концерны (ПРИОРИТЕТ):</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>• Астра Зенека</div>
                  <div>• Берлин-Хеми/А.Менарини</div>
                  <div>• Биокодекс</div>
                  <div>• Велфарм</div>
                  <div>• Вертекс</div>
                  <div>• Герофарм</div>
                  <div>• Канонфарма</div>
                  <div>• Медисорб</div>
                  <div>• Русфик (Бушара)</div>
                  <div>• Сандоз</div>
                  <div>• Солотрейд</div>
                  <div>• Сотекс</div>
                  <div>• Ядран</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
