// src/components/admin/ToolForm.tsx

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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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

// --- Company schema & defaults ---
const companyDataSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  location: z.string(),
  revenue: z.string(),
  valuation: z.string(),
  funding: z.string(),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  founder: z.object({
    name: z.string(),
    title: z.string(),
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
  }),
  news: z.array(
    z.object({ title: z.string(), date: z.string(), url: z.string().url() })
  ),
});
type CompanyFormValues = z.infer<typeof companyDataSchema>;

const prepareDefaultCompanyValues = (
  company: CompanyFormValues | null
): CompanyFormValues => {
  if (!company) {
    return {
      name: '',
      location: '',
      revenue: '',
      valuation: '',
      funding: '',
      linkedin: '',
      twitter: '',
      founder: { name: '', title: '', linkedin: '', twitter: '' },
      news: [],
    };
  }
  return {
    ...company,
    linkedin: company.linkedin || '',
    twitter: company.twitter || '',
  };
};

// --- Agent schema ---
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
  features: z.array(z.object({ name: z.string(), description: z.string() })),
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

// --- Combined schema & types ---
const fullFormSchema = z.object({
  company_data: companyDataSchema,
  agent_data: toolFormSchema,
});
type FullFormValues = z.infer<typeof fullFormSchema>;

// --- Prepare defaults for both ---
const prepareDefaultValues = (
  tool: AITool | null,
  company: CompanyFormValues | null
): FullFormValues => ({
  company_data: prepareDefaultCompanyValues(company),
  agent_data: tool
    ? {
        ...tool,
        api_documentation: tool.api_documentation || '',
        creator: tool.creator || '',
        creator_website: tool.creator_website || '',
        version: tool.version || '',
        categories: tool.categories || [],
        features: tool.features || [{ name: '', description: '' }],
        use_cases: tool.use_cases || [],
        compatible_platforms: tool.compatible_platforms || [],
        integrations: tool.integrations || [],
        tags: tool.tags || [],
        pricing_details:
          tool.pricing_details || { starting_price: 0, has_free_trial: false, trial_days: 0 },
      }
    : {
        title: '',
        description: '',
        website: '',
        image: '',
        thumbnail: '',
        categories: [],
        pricing_type: 'Free' as PricingType,
        pricing_details: { starting_price: 0, has_free_trial: false, trial_days: 0 },
        features: [{ name: '', description: '' }],
        use_cases: [],
        compatible_platforms: [],
        integrations: [],
        api_available: false,
        api_documentation: '',
        creator: '',
        creator_website: '',
        version: '',
        tags: [],
      },
});

const ToolForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedTool, tools } = useAdmin();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyFormValues | null>(null);

  // Restore these states
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [newIntegrationItem, setNewIntegrationItem] = useState('');

  const form = useForm<FullFormValues>({
    resolver: zodResolver(fullFormSchema),
    defaultValues: prepareDefaultValues(selectedTool, companyData),
  });
  const { control, watch, reset, getValues, setValue, formState } = form;

  // Watch under agent_data
  const features = watch('agent_data.features');
  const useCases = watch('agent_data.use_cases');
  const categories = watch('agent_data.categories');
  const tags = watch('agent_data.tags');
  const compatiblePlatforms = watch('agent_data.compatible_platforms');
  const integrations = watch('agent_data.integrations');

  useEffect(() => {
    if (id && !selectedTool) {
      const toolToEdit = tools.find((t) => t.id === id);
      if (toolToEdit) {
        reset(prepareDefaultValues(toolToEdit, companyData));
      }
    }
  }, [id, selectedTool, tools, reset, companyData]);

  const handleExtractedData = (data: {
    company_data: CompanyFormValues;
    agent_data: AITool;
  }) => {
    setCompanyData(data.company_data);
    reset(prepareDefaultValues(data.agent_data, data.company_data));
  };

  const onSubmit = async (values: FullFormValues) => {
    setIsSubmitting(true);

    // Clean agent_data arrays
    const cleanedAgent = {
      ...values.agent_data,
      categories: values.agent_data.categories.filter(Boolean),
      features: values.agent_data.features.filter((f) => f.name || f.description),
      use_cases: values.agent_data.use_cases.filter(Boolean),
      compatible_platforms: values.agent_data.compatible_platforms.filter(Boolean),
      integrations: values.agent_data.integrations.filter(Boolean),
      tags: values.agent_data.tags.filter(Boolean),
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/store-agent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
           company_data: { company_data: values.company_data },
          agent_data:   { agent_data:   cleanedAgent   },
          }),
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      navigate('/admin/tools');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      form.setError('agent_data.title', { type: 'manual', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCategory = () => {
    const arr = getValues('agent_data.categories');
    if (newCategory.trim() && !arr.includes(newCategory.trim())) {
      setValue('agent_data.categories', [...arr, newCategory.trim()]);
      setNewCategory('');
    }
  };
  const removeCategory = (i: number) =>
    setValue(
      'agent_data.categories',
      getValues('agent_data.categories').filter((_, idx) => idx !== i)
    );

  const addTag = () => {
    const arr = getValues('agent_data.tags');
    if (newTag.trim() && !arr.includes(newTag.trim())) {
      setValue('agent_data.tags', [...arr, newTag.trim()]);
      setNewTag('');
    }
  };
  const removeTag = (i: number) =>
    setValue(
      'agent_data.tags',
      getValues('agent_data.tags').filter((_, idx) => idx !== i)
    );

  const addFeature = () =>
    setValue('agent_data.features', [...getValues('agent_data.features'), { name: '', description: '' }]);
  const removeFeature = (i: number) =>
    setValue(
      'agent_data.features',
      getValues('agent_data.features').filter((_, idx) => idx !== i)
    );

  const addUseCase = () =>
    setValue('agent_data.use_cases', [...getValues('agent_data.use_cases'), '']);
  const removeUseCase = (i: number) =>
    setValue(
      'agent_data.use_cases',
      getValues('agent_data.use_cases').filter((_, idx) => idx !== i)
    );

  const addPlatform = () => {
    const arr = getValues('agent_data.compatible_platforms');
    if (newPlatform.trim() && !arr.includes(newPlatform.trim())) {
      setValue('agent_data.compatible_platforms', [...arr, newPlatform.trim()]);
      setNewPlatform('');
    }
  };
  const removePlatform = (i: number) =>
    setValue(
      'agent_data.compatible_platforms',
      getValues('agent_data.compatible_platforms').filter((_, idx) => idx !== i)
    );

  const addIntegration = () => {
    const arr = getValues('agent_data.integrations');
    if (newIntegrationItem.trim() && !arr.includes(newIntegrationItem.trim())) {
      setValue('agent_data.integrations', [...arr, newIntegrationItem.trim()]);
      setNewIntegrationItem('');
    }
  };
  const removeIntegration = (i: number) =>
    setValue(
      'agent_data.integrations',
      getValues('agent_data.integrations').filter((_, idx) => idx !== i)
    );
    // inside your component fn, alongside categories/tags etc:
const news = watch('company_data.news');

const addNewsItem = () => {
  const arr = getValues('company_data.news') || [];
  setValue('company_data.news', [
    ...arr,
    { title: '', date: '', url: '' },
  ]);
};

const removeNewsItem = (i: number) =>
  setValue(
    'company_data.news',
    (getValues('company_data.news') || []).filter((_, idx) => idx !== i)
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {!id && <UrlSubmissionForm onDataReceived={handleExtractedData} />}

        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit AI Tool' : 'Add New AI Tool'}</CardTitle>
            <CardDescription>
              {id
                ? 'Update the information for this AI tool.'
                : 'Fill out the form to add a new AI tool and company profile.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'location', 'revenue', 'valuation', 'funding', 'linkedin', 'twitter'].map(
                  (fkey) => (
                    <FormField
                      key={fkey}
                      control={control}
                      name={`company_data.${fkey}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {fkey.charAt(0).toUpperCase() + fkey.slice(1).replace('_', ' ')}
                          </FormLabel>

                          <FormControl>
                            <Input {...field} type={['linkedin', 'twitter'].includes(fkey) ? 'url' : 'text'} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
<Separator />

<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-medium">News</h3>
    <Button type="button" variant="outline" size="sm" onClick={addNewsItem}>
      <Plus className="h-4 w-4 mr-1" />
      Add News
    </Button>
  </div>

  {news.map((_, idx) => (
    <div key={idx} className="space-y-2 p-4 border rounded relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => removeNewsItem(idx)}
      >
        <X className="h-4 w-4" />
      </Button>

      <FormField
        control={control}
        name={`company_data.news.${idx}.title`}
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
        control={control}
        name={`company_data.news.${idx}.date`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`company_data.news.${idx}.url`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL</FormLabel>
            <FormControl>
              <Input {...field} type="url" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  ))}
</div>

                {/* Founder */}
                <div className="col-span-full space-y-2">
                  <h4 className="text-md font-medium">Founder</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['name', 'title', 'linkedin', 'twitter'].map((fkey) => (
                      <FormField
                        key={fkey}
                        control={control}
                        name={`company_data.founder.${fkey}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {fkey.charAt(0).toUpperCase() + fkey.slice(1).replace('_', ' ')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type={['linkedin', 'twitter'].includes(fkey) ? 'url' : 'text'}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              </div>
            </CardContent>

            <Separator />

            {/* Agent Information */}
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['title', 'website'].map((fkey) => (
                    <FormField
                      key={fkey}
                      control={control}
                      name={`agent_data.${fkey}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {fkey.charAt(0).toUpperCase() + fkey.slice(1).replace('_', ' ')}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type={fkey === 'website' ? 'url' : 'text'} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <FormField
                  control={control}
                  name="agent_data.description"
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
                  {['image', 'thumbnail'].map((fkey) => (
                    <FormField
                      key={fkey}
                      control={control}
                      name={`agent_data.${fkey}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {fkey.charAt(0).toUpperCase() + fkey.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Categories & Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Categories & Tags</h3>

                {/* Categories */}
                <div>
                  <FormLabel>Categories</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {categories.map((c, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                        {c}
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
                  {formState.errors.agent_data?.categories && (
                    <p className="text-sm text-red-500 mt-1">
                      {formState.errors.agent_data.categories.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2 mb-3">
                    {tags.map((t, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1 text-sm">
                        {t}
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
                  control={control}
                  name="agent_data.pricing_type"
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

                {watch('agent_data.pricing_type') !== 'Free' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="agent_data.pricing_details.starting_price"
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
                        control={control}
                        name="agent_data.pricing_details.has_free_trial"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between">
                            <FormLabel>Has Free Trial</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {watch('agent_data.pricing_details.has_free_trial') && (
                        <FormField
                          control={control}
                          name="agent_data.pricing_details.trial_days"
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
                {features.map((_, idx) => (
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
                      control={control}
                      name={`agent_data.features.${idx}.name` as any}
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
                      control={control}
                      name={`agent_data.features.${idx}.description` as any}
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
                {useCases.map((_, idx) => (
                  <div key={idx} className="flex items-center">
                    <FormField
                      control={control}
                      name={`agent_data.use_cases.${idx}` as any}
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
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {compatiblePlatforms.map((p, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                      {p}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-4 w-4"
                        onClick={() => removePlatform(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    placeholder="Add a platform..."
                    className="mr-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPlatform();
                      }
                    }}
                  />
                  <Button type="button" onClick={addPlatform} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Integrations */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Integrations</h3>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {integrations.map((it, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 text-sm">
                      {it}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 p-0 h-4 w-4"
                        onClick={() => removeIntegration(i)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <Input
                    value={newIntegrationItem}
                    onChange={(e) => setNewIntegrationItem(e.target.value)}
                    placeholder="Add an integration..."
                    className="mr-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addIntegration();
                      }
                    }}
                  />
                  <Button type="button" onClick={addIntegration} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              <Separator />

              {/* API Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Information</h3>
                <FormField
                  control={control}
                  name="agent_data.api_available"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>API Available</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {watch('agent_data.api_available') && (
                  <FormField
                    control={control}
                    name="agent_data.api_documentation"
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
                    control={control}
                    name="agent_data.creator"
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
                    control={control}
                    name="agent_data.creator_website"
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
                  control={control}
                  name="agent_data.version"
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
