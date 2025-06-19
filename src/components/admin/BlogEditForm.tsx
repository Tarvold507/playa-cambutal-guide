
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EditFormData } from '@/hooks/admin/types';

interface BlogEditFormProps {
  editForm: EditFormData;
  onFormChange: (updates: Partial<EditFormData>) => void;
}

const BlogEditForm = ({ editForm, onFormChange }: BlogEditFormProps) => {
  const handleInputChange = (field: string, value: string) => {
    onFormChange({ [field]: value });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    onFormChange({ tags });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={editForm.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Blog post title"
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          value={editForm.slug || ''}
          onChange={(e) => handleInputChange('slug', e.target.value)}
          placeholder="blog-post-slug"
          required
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={editForm.excerpt || ''}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
          placeholder="Brief description of the blog post"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={editForm.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Blog post content"
          rows={10}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={editForm.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
          placeholder="e.g., Travel, Food, Adventure"
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={editForm.tags ? editForm.tags.join(', ') : ''}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={editForm.status || 'draft'} onValueChange={(value) => handleInputChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="featured_image_url">Featured Image URL</Label>
        <Input
          id="featured_image_url"
          value={editForm.featured_image_url || ''}
          onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">SEO Settings</h3>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input
              id="seo_title"
              value={editForm.seo_title || ''}
              onChange={(e) => handleInputChange('seo_title', e.target.value)}
              placeholder="SEO optimized title"
            />
          </div>

          <div>
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea
              id="seo_description"
              value={editForm.seo_description || ''}
              onChange={(e) => handleInputChange('seo_description', e.target.value)}
              placeholder="SEO meta description"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="seo_keywords">SEO Keywords</Label>
            <Input
              id="seo_keywords"
              value={editForm.seo_keywords || ''}
              onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditForm;
