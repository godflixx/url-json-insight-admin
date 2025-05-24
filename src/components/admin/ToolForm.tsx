// ToolForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdmin } from '@/contexts/AdminContext';
import { AITool, PricingType } from '@/types/admin';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { X, Plus } from 'lucide-react';
import UrlSubmissionForm from './UrlSubmissionForm';

// --- Zod schema ---
const toolFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  website: z.string().url('Must be a valid URL'),
  image: z.string().url('Must be a valid URL'),
  thumbnail: z.string().url('Must be a valid URL'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  pricing_type: z.enum(['Free', 'Freemium', 'Paid', 'Subscription']),
  pricing_details: z
    .object({
      starting_price: z.number().optional(),
      has_free_trial: z.boolean().optional(),
      trial_days: z.number().optional(),
    })
    .optional(),
  features: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
    })
  ),
  use_cases: z.array(z.string()),
  compatible_platforms: z.array(z.string()),
  integrations: z.array(z.string()),
  api_available: z.boolean(),
  api_documentation: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  creator: z.string().optional(),
  creator_website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  version: z.string().optional(),
  tags: z.array(z.string()),
});
type ToolFormValues = z.infer<typeof toolFormSchema>;

// --- prepareDefaultValues ---
const prepareDefaultValues = (tool: AITool | null): ToolFormValues => {
  if (!tool) {
    return {
      title: '',
      description: '',
      website: '',
      image: '',
      thumbnail: '',
      categories: [],
      pricing_type: 'Free' as PricingType,
      pricing_details: { starting_price: 0, has_free_trial: false, trial_days: 0 },
      features: [{ name: '', description: '' }],
      use_cases: [''],
      compatible_platforms: [],
      integrations: [],
      api_available: false,
      api_documentation: '',
      creator: '',
      creator_website: '',
      version: '',
      tags: [],
    };
  }
  return {
    ...tool,
    api_documentation: tool.api_documentation || '',
    creator: tool.creator || '',
    creator_website: tool.creator_website || '',
    version: tool.version || '',
    categories: tool.categories || [],
    features: tool.features || [{ name: '', description: '' }],
    use_cases: tool.use_cases || [''],
    compatible_platforms: tool.compatible_platforms || [],
    integrations: tool.integrations || [],
    tags: tool.tags || [],
    pricing_details:
      tool.pricing_details || { starting_price: 0, has_free_trial: false, trial_days: 0 },
  };
};

const ToolForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedTool, tools } = useAdmin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolFormSchema),
    defaultValues: prepareDefaultValues(selectedTool),
  });

  useEffect(() => {
    if (id && !selectedTool) {
      const toolToEdit = tools.find((t) => t.id === id);
      if (toolToEdit) {
        form.reset(prepareDefaultValues(toolToEdit));
      }
    }
  }, [id, selectedTool, tools, form]);

  const handleExtractedData = (data: AITool) => {
    form.reset(prepareDefaultValues(data));
  };

  const onSubmit = async (values: ToolFormValues) => {
    const cleanedValues = {
      ...values,
      categories: values.categories.filter((c) => c.trim() !== ''),
      features: values.features.filter(
        (f) => f.name.trim() !== '' || f.description.trim() !== ''
      ),
      use_cases: values.use_cases.filter((uc) => uc.trim() !== ''),
      compatible_platforms: values.compatible_platforms.filter((p) => p.trim() !== ''),
      integrations: values.integrations.filter((i) => i.trim() !== ''),
      tags: values.tags.filter((t) => t.trim() !== ''),
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/store-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_data: cleanedValues }),

      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      navigate('/admin/tools');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      form.setError('title', { type: 'manual', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Array field handlers ---
  const addCategory = () => {
    const cat = newCategory.trim();
    if (cat && !form.getValues().categories.includes(cat)) {
      form.setValue('categories', [...form.getValues().categories, cat]);
      setNewCategory('');
    }
  };
  const removeCategory = (index: number) => {
    form.setValue(
      'categories',
      form.getValues().categories.filter((_, i) => i !== index)
    );
  };

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !form.getValues().tags.includes(tag)) {
      form.setValue('tags', [...form.getValues().tags, tag]);
      setNewTag('');
    }
  };
  const removeTag = (index: number) => {
    form.setValue('tags', form.getValues().tags.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    form.setValue('features', [
      ...form.getValues().features,
      { name: '', description: '' },
    ]);
  };
  const removeFeature = (index: number) => {
    form.setValue(
      'features',
      form.getValues().features.filter((_, i) => i !== index)
    );
  };

  const addUseCase = () => {
    form.setValue('use_cases', [...form.getValues().use_cases, '']);
  };
  const removeUseCase = (index: number) => {
    form.setValue(
      'use_cases',
      form.getValues().use_cases.filter((_, i) => i !== index)
    );
  };

  const commonPlatforms = [
    'Web',
    'iOS',
    'Android',
    'Windows',
    'macOS',
    'Linux',
    'Chrome Extension',
    'Firefox Extension',
    'Slack',
    'Discord',
  ];
  const togglePlatform = (platform: string) => {
    const current = form.getValues().compatible_platforms;
    form.setValue(
      'compatible_platforms',
      current.includes(platform)
        ? current.filter((p) => p !== platform)
        : [...current, platform]
    );
  };

  const commonIntegrations = [
    'Slack',
    'Discord',
    'Teams',
    'Google Workspace',
    'Microsoft Office',
    'Zapier',
    'Notion',
    'Trello',
    'GitHub',
    'GitLab',
    'Figma',
  ];
  const toggleIntegration = (integration: string) => {
    const current = form.getValues().integrations;
    form.setValue(
      'integrations',
      current.includes(integration)
        ? current.filter((i) => i !== integration)
        : [...current, integration]
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* URL extractor */}
        {!id && <UrlSubmissionForm onDataReceived={handleExtractedData} />}

        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit AI Tool' : 'Add New AI Tool'}</CardTitle>
            <CardDescription>
              {id
                ? 'Update the information for this AI tool.'
                : 'Fill out the form to add a new AI tool to the catalog.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Categories & Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categories and Tags</h3>

              <div>
                <FormLabel>Categories</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {form.getValues().categories.map((cat, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                      {cat}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-4 w-4"
                        onClick={() => removeCategory(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a category..."
                    className="mr-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCategory} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {form.formState.errors.categories && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.categories.message}
                  </p>
                )}
              </div>

              <div>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {form.getValues().tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1 text-sm">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-4 w-4"
                        onClick={() => removeTag(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="mr-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing</h3>

              <FormField
                control={form.control}
                name="pricing_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Freemium">Freemium</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('pricing_type') !== 'Free' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricing_details.starting_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="pricing_details.has_free_trial"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Has Free Trial</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch('pricing_details.has_free_trial') && (
                      <FormField
                        control={form.control}
                        name="pricing_details.trial_days"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trial Period (days)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Features</h3>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-1" /> Add Feature
                </Button>
              </div>

              {form.getValues().features.map((_, idx) => (
                <div key={idx} className="space-y-4 p-4 border rounded-md relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeFeature(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <FormField
                    control={form.control}
                    name={`features.${idx}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feature Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`features.${idx}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <Separator />

            {/* Use Cases */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Use Cases</h3>
                <Button type="button" variant="outline" size="sm" onClick={addUseCase}>
                  <Plus className="h-4 w-4 mr-1" /> Add Use Case
                </Button>
              </div>

              {form.getValues().use_cases.map((_, idx) => (
                <div key={idx} className="flex items-center">
                  <FormField
                    control={form.control}
                    name={`use_cases.${idx}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder={`Use case ${idx + 1}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => removeUseCase(idx)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Compatible Platforms */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Compatible Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {commonPlatforms.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={form.getValues().compatible_platforms.includes(p) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => togglePlatform(p)}
                  >
                    {p}
                  </Button>
                ))}
              </div>
              <FormField
                control={form.control}
                name="compatible_platforms"
                render={() => <FormItem><FormMessage /></FormItem>}
              />
            </div>

            <Separator />

            {/* Integrations */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Integrations</h3>
              <div className="flex flex-wrap gap-2">
                {commonIntegrations.map((i) => (
                  <Button
                    key={i}
                    type="button"
                    variant={form.getValues().integrations.includes(i) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleIntegration(i)}
                  >
                    {i}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* API Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">API Information</h3>
              <FormField
                control={form.control}
                name="api_available"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>API Available</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.watch('api_available') && (
                <FormField
                  control={form.control}
                  name="api_documentation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Documentation URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <Separator />

            {/* Creator Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Creator Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="creator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator/Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="creator_website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator/Company Website</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/tools')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : id ? 'Update Tool' : 'Create Tool'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ToolForm;
