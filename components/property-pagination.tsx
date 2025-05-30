"use client"

import { Button } from "@/components/ui/button"

export function PropertyPagination() {
  return (
    <div className="mt-12 flex items-center justify-center">
      <nav className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="h-8 w-8" disabled>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8 bg-blue-50">
          1
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8">
          2
        </Button>
        <Button variant="outline" size="sm" className="h-8 w-8">
          3
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </nav>
    </div>
  )
}
