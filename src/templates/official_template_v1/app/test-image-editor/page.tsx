"use client"

import { useState } from 'react'
import { SmartCard } from '@/components/smart-card'
import { BaseViewItem } from '@/lib/data'

export default function TestImageEditor() {
  const [testItem, setTestItem] = useState<BaseViewItem>({
    id: 'test-1',
    title: 'Test Image Card',
    viewMode: 'multi-images',
    multiImages: [],
  })

  const handleUpdate = (field: string, value: any) => {
    setTestItem(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Image Editor Test</h1>
      
      <div className="grid gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Hover over the card and click the settings icon (gear)</li>
            <li>Choose "3D Image Card" as the display mode</li>
            <li>Either paste an image URL or upload an image file</li>
            <li>Once an image appears in the preview, click "Edit Image"</li>
            <li>Use the image editor to:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Drag to reposition the image</li>
                <li>Use the zoom slider or scroll/pinch to zoom</li>
                <li>Rotate the image in 90° increments</li>
              </ul>
            </li>
            <li>Click "Apply Changes" to save the edited image</li>
          </ol>
        </div>

        <div className="h-[400px] border rounded-lg">
          <SmartCard
            item={testItem}
            onUpdate={handleUpdate}
            className="h-full"
          >
            <div className="p-6">
              <p>Default text content</p>
            </div>
          </SmartCard>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Current State:</h3>
          <pre className="text-xs bg-muted p-4 rounded overflow-auto">
            {JSON.stringify(testItem, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}