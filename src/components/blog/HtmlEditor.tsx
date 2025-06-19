
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Link, Bold, Italic, List, Eye, Code } from 'lucide-react';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

const HtmlEditor = ({ 
  value, 
  onChange, 
  label = "Content", 
  placeholder = "Write your content here...",
  rows = 12,
  required = false 
}: HtmlEditorProps) => {
  const [activeTab, setActiveTab] = useState('edit');

  const insertHtml = (htmlTag: string, closingTag?: string) => {
    const textarea = document.getElementById('html-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    if (closingTag) {
      newText = value.substring(0, start) + htmlTag + selectedText + closingTag + value.substring(end);
    } else {
      newText = value.substring(0, start) + htmlTag + value.substring(end);
    }
    
    onChange(newText);
    
    // Set cursor position after the inserted HTML
    setTimeout(() => {
      const newPosition = start + htmlTag.length + (selectedText ? selectedText.length : 0);
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter the URL:');
    const linkText = prompt('Enter the link text:') || 'Link';
    
    if (url) {
      insertHtml(`<a href="${url}" target="_blank">`, `</a>`);
    }
  };

  const htmlSnippets = [
    { label: 'Link', action: insertLink, icon: Link },
    { label: 'Bold', action: () => insertHtml('<strong>', '</strong>'), icon: Bold },
    { label: 'Italic', action: () => insertHtml('<em>', '</em>'), icon: Italic },
    { label: 'List Item', action: () => insertHtml('<li>', '</li>'), icon: List },
  ];

  const commonSnippets = [
    { label: 'Heading 2', html: '<h2>Your Heading</h2>' },
    { label: 'Heading 3', html: '<h3>Your Heading</h3>' },
    { label: 'Paragraph', html: '<p>Your paragraph text here.</p>' },
    { label: 'Unordered List', html: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>' },
    { label: 'Ordered List', html: '<ol>\n  <li>First item</li>\n  <li>Second item</li>\n  <li>Third item</li>\n</ol>' },
    { label: 'Link', html: '<a href="https://example.com" target="_blank">Link text</a>' },
    { label: 'Image', html: '<img src="image-url.jpg" alt="Description" class="w-full rounded-lg" />' },
  ];

  return (
    <div className="space-y-4">
      <Label htmlFor="html-content">{label} {required && '*'}</Label>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Edit HTML
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="space-y-4">
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
            {htmlSnippets.map((snippet) => (
              <Button
                key={snippet.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={snippet.action}
                className="flex items-center gap-1"
              >
                <snippet.icon className="w-3 h-3" />
                {snippet.label}
              </Button>
            ))}
          </div>
          
          <Textarea
            id="html-content"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`${placeholder}

Examples:
• Links: <a href="https://example.com" target="_blank">Link text</a>
• Bold: <strong>Bold text</strong>
• Italic: <em>Italic text</em>
• Headings: <h2>Heading</h2>
• Lists: <ul><li>Item</li></ul>

You can copy and paste HTML from other sources!`}
            rows={rows}
            required={required}
            className="font-mono text-sm"
            style={{ minHeight: '300px' }}
          />
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Quick HTML Snippets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {commonSnippets.map((snippet) => (
                  <Button
                    key={snippet.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange(value + '\n' + snippet.html)}
                    className="justify-start text-left h-auto p-2"
                  >
                    <div>
                      <div className="font-medium">{snippet.label}</div>
                      <div className="text-xs text-gray-500 font-mono">
                        {snippet.html.length > 40 ? snippet.html.substring(0, 40) + '...' : snippet.html}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-medium mb-4">Content Preview</h4>
              {value ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: value }}
                />
              ) : (
                <p className="text-gray-500 italic">No content to preview. Switch to "Edit HTML" tab to add content.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
        <strong>Tips:</strong>
        <ul className="mt-1 space-y-1">
          <li>• You can copy and paste HTML from other sources directly into the editor</li>
          <li>• Use the quick action buttons above to insert common HTML elements</li>
          <li>• Switch to Preview tab to see how your content will look</li>
          <li>• All HTML tags are supported including links, images, lists, and formatting</li>
        </ul>
      </div>
    </div>
  );
};

export default HtmlEditor;
