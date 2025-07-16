'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to Gambit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              A clean Next.js application built with Radix UI primitives and modern design patterns.
            </p>
            <div className="flex gap-4">
              <Button>Get Started</Button>
              <Button variant="secondary">Learn More</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🏗️</span>
                Clean Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Built with Radix UI primitives for maximum flexibility and accessibility.
              </p>
              <Button 
                variant="secondary" 
                onClick={() => console.log('Clean Architecture clicked')}
              >
                Explore
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📚</span>
                Storybook Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Comprehensive component documentation with interactive examples.
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('http://localhost:6006', '_blank')}
              >
                View Stories
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎨</span>
                Design System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Modern design system with consistent theming and dark mode support.
              </p>
              <Button 
                variant="ghost"
                onClick={() => console.log('Design System clicked')}
              >
                Discover
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
