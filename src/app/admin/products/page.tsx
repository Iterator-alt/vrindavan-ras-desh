'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  stock: number;
  isActive: boolean;
  featured: boolean;
  category: Category;
}

export default function ProductsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    images: [] as string[],
    categoryId: '',
    stock: '0',
    isActive: true,
    featured: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?includeInactive=true');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];

    try {
      const response = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          body: file,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const newBlob = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newBlob.url],
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save product');
      }

      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
      resetForm();
      fetchProducts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || '',
      images: product.images,
      categoryId: product.category.id,
      stock: product.stock.toString(),
      isActive: product.isActive,
      featured: product.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');

      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      compareAtPrice: '',
      images: [],
      categoryId: '',
      stock: '0',
      isActive: true,
      featured: false,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (status === 'loading' || loading) {
    return <div className="container" style={{ paddingTop: '120px' }}>Loading...</div>;
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Product Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="cta-button"
          style={{ fontSize: '0.9rem', padding: '10px 24px' }}
        >
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Radha Krishna Idol"
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the product..."
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }}
                required
              />
            </div>

            {/* Price and Discount Price */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="299"
                  min="0"
                  step="0.01"
                  style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Original Price (₹) <span style={{ fontSize: '0.85rem', color: '#666' }}>(for discount)</span>
                </label>
                <input
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  placeholder="499"
                  min="0"
                  step="0.01"
                  style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Category and Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="10"
                  min="0"
                  style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Product Images */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Product Photos
              </label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {formData.images.map((img, index) => (
                  <div key={index} style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <img src={img} alt={`Product ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{ width: '120px', height: '120px', border: '2px dashed #ddd', borderRadius: '5px', background: '#f9f9f9', cursor: uploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#999' }}
                >
                  {uploading ? '...' : '+'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Click + to upload product photos</p>
            </div>

            {/* Checkboxes */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span>Active (visible in store)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span>Featured Product</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="cta-button" style={{ flex: 1 }}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{ flex: 1, padding: '14px 36px', background: '#ddd', color: '#333', border: 'none', borderRadius: '50px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>All Products ({products.length})</h2>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '3rem 0' }}>
            No products yet. Click "Add New Product" to get started!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Stock</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {product.images[0] && (
                          <img src={product.images[0]} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: '600' }}>{product.name}</div>
                          {product.featured && (
                            <span style={{ fontSize: '0.75rem', background: '#FFD700', color: '#333', padding: '2px 8px', borderRadius: '3px', marginTop: '4px', display: 'inline-block' }}>
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{product.category.name}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ fontWeight: '600' }}>₹{product.price}</div>
                      {product.compareAtPrice && (
                        <div style={{ fontSize: '0.85rem', color: '#999', textDecoration: 'line-through' }}>
                          ₹{product.compareAtPrice}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{product.stock}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', background: product.isActive ? '#d4edda' : '#f8d7da', color: product.isActive ? '#155724' : '#721c24' }}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleEdit(product)}
                        style={{ padding: '6px 16px', marginRight: '0.5rem', background: '#FF9933', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{ padding: '6px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
