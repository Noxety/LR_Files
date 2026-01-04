import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Calendar, User, AlertTriangle, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Task {
  id: number;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  creator: {
    id: number;
    name: string;
  };
  assignee?: {
    id: number;
    name: string;
  };
  tasks: Task[];
  progress_percentage: number;
  is_overdue: boolean;
}

interface Props {
  projects: {
    data: Project[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  userRole: 'learner' | 'teacher' | 'admin';
}

export default function ProjectsIndex({ projects, userRole }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Projects',
      href: '/projects',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Projects" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-600">Manage your project workflow</p>
          </div>
          
          <Link href={route('projects.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.data.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      <Link 
                        href={route('projects.show', project.id)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {project.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      by {project.creator.name}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{project.progress_percentage}%</span>
                  </div>
                  <Progress value={project.progress_percentage} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {formatDate(project.due_date)}
                    </div>
                    {project.is_overdue && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Overdue
                      </div>
                    )}
                  </div>
                  
                  {project.assignee && (
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      Assigned to: {project.assignee.name}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {project.tasks.length} tasks
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={route('projects.show', project.id)}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    
                    <Link href={route('projects.edit', project.id)}>
                      <Button size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.data.length === 0 && (
          <div className="text-center py-12">
            <Plus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              Create your first project to get started with project management.
            </p>
            <Link href={route('projects.create')}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
