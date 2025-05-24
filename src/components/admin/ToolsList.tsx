// src/components/admin/ToolsList.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/superbase'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2 } from 'lucide-react'

interface Agent {
  id: string
  title: string
  description: string
  website: string
  thumbnail: string
  categories: string[]
  pricing_type: string
  creator: string | null
  last_updated: string | null
}

export default function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [filtered, setFiltered] = useState<Agent[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toDelete, setToDelete] = useState<Agent | null>(null)
  const navigate = useNavigate()

  // load all agents from Supabase
  const loadAgents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('agents')
      .select(`
        id,
        title,
        description,
        website,
        thumbnail,
        categories,
        pricing_type,
        creator,
        last_updated
      `)
      .order('last_updated', { ascending: false })

    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      // cast to Agent[] so TS knows the shape
      setAgents(data as Agent[])
      setFiltered(data as Agent[])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAgents()
  }, [])

  // client-side search filtering
  useEffect(() => {
    setFiltered(
      agents.filter((ag) =>
        ag.title.toLowerCase().includes(search.toLowerCase()) ||
        ag.description.toLowerCase().includes(search.toLowerCase()) ||
        (ag.creator?.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    )
  }, [search, agents])

  // delete a single agent
  const handleDelete = async () => {
    if (!toDelete) return
    setLoading(true)

    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', toDelete.id)

    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      await loadAgents()
      setToDelete(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg">Loading agents...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700">Error: {error}</p>
        <p className="text-sm text-red-600 mt-1">
          Please check your network or Supabase setup and try again.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User-Created Agents</h1>
          <p className="text-gray-500">{agents.length} agents found</p>
        </div>
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => navigate('/agents/new')}>Add New Agent</Button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Title</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Pricing</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ag) => (
                <TableRow key={ag.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      {ag.thumbnail && (
                        <img
                          src={ag.thumbnail}
                          alt={ag.title}
                          className="w-8 h-8 rounded object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/placeholder.svg'
                          }}
                        />
                      )}
                      <span>{ag.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ag.categories.slice(0, 3).map((c, i) => (
                        <Badge key={i} variant="outline">
                          {c}
                        </Badge>
                      ))}
                      {ag.categories.length > 3 && (
                        <Badge variant="outline">+{ag.categories.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ag.pricing_type === 'Free' ? 'default' : 'secondary'}>
                      {ag.pricing_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{ag.creator || 'Unknown'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => navigate(`/agents/edit/${ag.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => setToDelete(ag)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">
            No agents found. Try another search term or add new agents.
          </p>
        </div>
      )}

      <AlertDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this agent?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{toDelete?.title}" and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
