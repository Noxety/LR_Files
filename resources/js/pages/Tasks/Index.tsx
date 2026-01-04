import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, User, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  project: {
    id: number;
    title: string;
  };
  assignee?: {
    id: number;
    name: string;
  };
  creator: {
    id: number;
    name: string;
  };
  is_overdue: boolean;
  progress: number;
}

interface Props {
  tasks: {
    data: Task[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  userRole: 'learner' | 'teacher' | 'admin';
}

export default function TasksIndex({ tasks, userRole }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Tasks',
      href: '/tasks',
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
      case 'todo':
        return 'bg-gray-100 text-gray-800';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'review':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
      case 'todo':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tasks" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-gray-600">Manage your task workflow</p>
          </div>
          
          <Link href={route('tasks.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.data.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      <Link 
                        href={route('tasks.show', task.id)}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {task.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Project: {task.project.title}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {task.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {task.description}
                  </p>
                )}
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Due: {formatDate(task.due_date)}
                    </div>
                    {task.is_overdue && (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Overdue
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Created by: {task.creator.name}
                    </div>
                  </div>
                  
                  {task.assignee && (
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      Assigned to: {task.assignee.name}
                    </div>
                  )}
                  
                  {(task.estimated_hours || task.actual_hours) && (
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Est: {task.estimated_hours || 0}h</span>
                      <span>Actual: {task.actual_hours || 0}h</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getStatusIcon(task.status)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={route('tasks.show', task.id)}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    
                    <Link href={route('tasks.edit', task.id)}>
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

        {tasks.data.length === 0 && (
          <div className="text-center py-12">
            <Plus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              Create your first task to get started with task management.
            </p>
            <Link href={route('tasks.create')}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
