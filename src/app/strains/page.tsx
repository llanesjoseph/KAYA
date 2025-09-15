'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Star, 
  Filter, 
  TrendingUp, 
  Award,
  Leaf,
  Users,
  ChevronRight,
  Plus,
  Heart,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import {
  searchStrains,
  getPopularStrains,
  getTopRatedStrains,
  type StrainProfile,
  type StrainType,
  type GrowingDifficulty,
  STRAIN_EFFECTS,
  STRAIN_FLAVORS,
} from '@/lib/strains';

export default function StrainsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [strains, setStrains] = useState<(StrainProfile & { id: string })[]>([]);
  const [popularStrains, setPopularStrains] = useState<(StrainProfile & { id: string })[]>([]);
  const [topRatedStrains, setTopRatedStrains] = useState<(StrainProfile & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<StrainType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<GrowingDifficulty | 'all'>('all');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [thcRange, setThcRange] = useState([0, 30]);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'reviews' | 'newest'>('name');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedEffects.length > 0) {
      handleSearch();
    }
  }, [searchTerm, selectedType, selectedDifficulty, selectedEffects, thcRange, sortBy]);

  const loadInitialData = async () => {
    try {
      const [initialStrains, popular, topRated] = await Promise.all([
        searchStrains(undefined, undefined, 'name', 20),
        getPopularStrains(6),
        getTopRatedStrains(6),
      ]);
      
      setStrains(initialStrains.strains);
      setPopularStrains(popular);
      setTopRatedStrains(topRated);
    } catch (error) {
      console.error('Error loading strains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      const filters: any = {};
      
      if (selectedType !== 'all') filters.type = selectedType;
      if (selectedDifficulty !== 'all') filters.growingDifficulty = selectedDifficulty;
      if (selectedEffects.length > 0) filters.effects = selectedEffects;
      if (thcRange[0] > 0) filters.minTHC = thcRange[0];
      if (thcRange[1] < 30) filters.maxTHC = thcRange[1];

      const result = await searchStrains(searchTerm || undefined, filters, sortBy, 50);
      setStrains(result.strains);
    } catch (error) {
      console.error('Error searching strains:', error);
    } finally {
      setSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDifficulty('all');
    setSelectedEffects([]);
    setThcRange([0, 30]);
    setSortBy('name');
  };

  const toggleEffect = (effect: string) => {
    setSelectedEffects(prev => 
      prev.includes(effect) 
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    );
  };

  if (loading) {
    return (
      <AuthGuard>
        <AppShell>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </AppShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                Strain Database
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover and explore cannabis strains with detailed profiles and reviews
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Strain
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="browse">Browse Strains</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
              <TabsTrigger value="my-lists">My Lists</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filters */}
              <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
                {/* Filter Sidebar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search strains..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type</label>
                      <Select value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="indica">Indica</SelectItem>
                          <SelectItem value="sativa">Sativa</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* THC Range */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        THC Range: {thcRange[0]}% - {thcRange[1]}%
                      </label>
                      <Slider
                        value={thcRange}
                        onValueChange={setThcRange}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Growing Difficulty */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Growing Difficulty</label>
                      <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Effects */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Effects</label>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {STRAIN_EFFECTS.slice(0, 15).map((effect) => (
                          <Badge
                            key={effect}
                            variant={selectedEffects.includes(effect) ? 'default' : 'outline'}
                            className="cursor-pointer text-xs"
                            onClick={() => toggleEffect(effect)}
                          >
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="reviews">Most Reviews</SelectItem>
                          <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {searching ? 'Searching...' : `${strains.length} strains found`}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {strains.map((strain) => (
                      <Card key={strain.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{strain.name}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {strain.type}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{strain.overallRating.toFixed(1)}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({strain.totalReviews})
                                  </span>
                                </div>
                              </CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {strain.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">THC:</span>
                              <span>{strain.thcRange.min}% - {strain.thcRange.max}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">CBD:</span>
                              <span>{strain.cbdRange.min}% - {strain.cbdRange.max}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Flowering:</span>
                              <span>{strain.floweringTime} days</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {strain.effects.slice(0, 3).map((effect) => (
                              <Badge key={effect} variant="secondary" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-2 border-t">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>12.3k</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{strain.totalReviews}</span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {strains.length === 0 && !searching && (
                    <div className="text-center py-12">
                      <Leaf className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">No strains found</h3>
                      <p className="text-muted-foreground">Try adjusting your search filters</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="popular" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">Most Popular Strains</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {popularStrains.map((strain, index) => (
                  <Card key={strain.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                          <CardTitle className="text-lg">{strain.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{strain.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{strain.overallRating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{strain.totalReviews} reviews</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {strain.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {strain.effects.slice(0, 4).map((effect) => (
                          <Badge key={effect} variant="secondary" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="top-rated" className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">Top Rated Strains</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topRatedStrains.map((strain) => (
                  <Card key={strain.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{strain.name}</CardTitle>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-bold text-yellow-700">{strain.overallRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{strain.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {strain.totalReviews} reviews
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {strain.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {strain.effects.slice(0, 4).map((effect) => (
                          <Badge key={effect} variant="secondary" className="text-xs">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-lists" className="space-y-6">
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Your Strain Lists</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom lists to track strains you want to try, are growing, or have tried.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First List
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppShell>
    </AuthGuard>
  );
}