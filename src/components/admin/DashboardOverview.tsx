
import React, { useMemo } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff'];

const DashboardOverview: React.FC = () => {
  const { tools } = useAdmin();

  // Calculate statistics for the dashboard
  const stats = useMemo(() => {
    if (!tools || tools.length === 0) {
      return {
        totalTools: 0,
        pricingDistribution: [],
        categoriesCount: [],
        tagsCount: [],
        platformsCount: [],
      };
    }

    // Count pricing types
    const pricingCounts: Record<string, number> = {};
    tools.forEach(tool => {
      pricingCounts[tool.pricing_type] = (pricingCounts[tool.pricing_type] || 0) + 1;
    });
    
    const pricingDistribution = Object.keys(pricingCounts).map(key => ({
      name: key,
      value: pricingCounts[key]
    }));

    // Count categories
    const categoryMap: Record<string, number> = {};
    tools.forEach(tool => {
      tool.categories.forEach(category => {
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });
    });
    
    const categoriesCount = Object.keys(categoryMap)
      .map(key => ({ name: key, count: categoryMap[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count tags
    const tagMap: Record<string, number> = {};
    tools.forEach(tool => {
      tool.tags.forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });
    
    const tagsCount = Object.keys(tagMap)
      .map(key => ({ name: key, count: tagMap[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count platforms
    const platformMap: Record<string, number> = {};
    tools.forEach(tool => {
      tool.compatible_platforms.forEach(platform => {
        platformMap[platform] = (platformMap[platform] || 0) + 1;
      });
    });
    
    const platformsCount = Object.keys(platformMap)
      .map(key => ({ name: key, count: platformMap[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalTools: tools.length,
      pricingDistribution,
      categoriesCount,
      tagsCount,
      platformsCount,
    };
  }, [tools]);

  if (!tools || tools.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Data</CardTitle>
            <CardDescription>
              No tools have been added yet. Fetch data from the API or add new tools to see dashboard statistics.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tools</CardDescription>
            <CardTitle className="text-3xl">{stats.totalTools}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Free Tools</CardDescription>
            <CardTitle className="text-3xl">
              {stats.pricingDistribution.find(item => item.name === 'Free')?.value || 0}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid Tools</CardDescription>
            <CardTitle className="text-3xl">
              {(stats.pricingDistribution.find(item => item.name === 'Paid')?.value || 0) +
               (stats.pricingDistribution.find(item => item.name === 'Subscription')?.value || 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-3xl">
              {stats.categoriesCount.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pricing Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pricing Distribution</CardTitle>
            <CardDescription>
              Distribution of tools by pricing model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pricingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.pricingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Categories */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>
              Most common categories in the tools database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.categoriesCount.slice(0, 5)}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top Tags */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.tagsCount.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag.name} ({tag.count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Supported Platforms */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Supported Platforms</CardTitle>
            <CardDescription>
              Platforms compatibility across all tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.platformsCount}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
