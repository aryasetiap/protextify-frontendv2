# 🎨 Protextify Design System

Dokumentasi lengkap sistem desain Protextify dengan brand color utama `#23407a`.

## 🎯 Brand Colors

### Primary Colors

- **Primary**: `#23407a` - Warna utama brand
- **Primary Dark**: `#1a2f5c` - Untuk hover states dan emphasis
- **Primary Light**: `#3b5fa4` - Untuk subtle backgrounds
- **Primary Lighter**: `#4f6bb5` - Untuk very light backgrounds

### Color Usage Guidelines

```css
/* Primary Actions */
.btn-primary {
  background-color: #23407a;
}

/* Hover States */
.btn-primary:hover {
  background-color: #1a2f5c;
}

/* Focus States */
.focus-ring {
  ring-color: #23407a;
}

/* Links */
.link-primary {
  color: #23407a;
}
```

## 🔤 Typography Scale

### Headings

- **Display**: 48px (3rem) - Hero sections
- **H1**: 36px (2.25rem) - Page titles
- **H2**: 30px (1.875rem) - Section headers
- **H3**: 24px (1.5rem) - Subsection headers
- **H4**: 20px (1.25rem) - Content headers
- **H5**: 18px (1.125rem) - Small headers
- **H6**: 16px (1rem) - Smallest headers

### Body Text

- **Lead**: 20px (1.25rem) - Introduction text
- **Large**: 18px (1.125rem) - Emphasis text
- **Regular**: 16px (1rem) - Default body text
- **Small**: 14px (0.875rem) - Secondary text
- **XS**: 12px (0.75rem) - Captions and labels

### Usage Examples

```jsx
<h1 className="heading-1">Page Title</h1>
<h2 className="heading-2">Section Title</h2>
<p className="body-regular">Regular paragraph text</p>
<span className="body-small text-muted">Helper text</span>
```

## 📏 Spacing Scale

### Scale System

- **1**: 4px (0.25rem)
- **2**: 8px (0.5rem)
- **3**: 12px (0.75rem)
- **4**: 16px (1rem)
- **5**: 20px (1.25rem)
- **6**: 24px (1.5rem)
- **8**: 32px (2rem)
- **10**: 40px (2.5rem)
- **12**: 48px (3rem)
- **16**: 64px (4rem)

### Usage Guidelines

```jsx
// Component spacing
<div className="p-6"> {/* 24px padding */}
<div className="mb-4"> {/* 16px margin bottom */}
<div className="space-y-3"> {/* 12px gap between children */}
```

## 🔘 Component Tokens

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #23407a;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
}

/* Secondary Button */
.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

/* Outline Button */
.btn-outline {
  background: transparent;
  color: #23407a;
  border: 2px solid #23407a;
}
```

### Form Controls

```css
/* Input Field */
.input-field {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 16px;
}

/* Focus State */
.input-field:focus {
  border-color: transparent;
  ring: 2px solid #23407a;
  ring-offset: 2px;
}
```

### Cards

```css
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## 🎨 Semantic Colors

### Success

- **Green 50**: `#ecfdf5` - Success backgrounds
- **Green 500**: `#10b981` - Success text/icons
- **Green 600**: `#059669` - Success buttons

### Warning

- **Yellow 50**: `#fffbeb` - Warning backgrounds
- **Yellow 500**: `#f59e0b` - Warning text/icons
- **Yellow 600**: `#d97706` - Warning buttons

### Error

- **Red 50**: `#fef2f2` - Error backgrounds
- **Red 500**: `#ef4444` - Error text/icons
- **Red 600**: `#dc2626` - Error buttons

### Info

- **Blue 50**: `#eff6ff` - Info backgrounds
- **Blue 500**: `#3b82f6` - Info text/icons
- **Blue 600**: `#2563eb` - Info buttons

## 🔍 Usage Examples

### Alert Components

```jsx
<div className="alert alert-success">
  <CheckCircle className="h-5 w-5" />
  <span>Success message</span>
</div>

<div className="alert alert-error">
  <XCircle className="h-5 w-5" />
  <span>Error message</span>
</div>
```

### Badge Components

```jsx
<span className="badge badge-primary">Active</span>
<span className="badge badge-success">Completed</span>
<span className="badge badge-warning">Pending</span>
```

### Layout Components

```jsx
<div className="container">
  <div className="card">
    <div className="card-header">
      <h3 className="heading-4">Card Title</h3>
    </div>
    <div className="card-body">
      <p className="body-regular">Card content</p>
    </div>
    <div className="card-footer">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

# Layout Components Usage Guide

## Components Overview

### 1. Breadcrumb Component

```jsx
import { Breadcrumb } from "../../components/layout";

// Auto-generated breadcrumb
<Breadcrumb />

// Custom breadcrumb
<Breadcrumb
  customItems={[
    { label: "Dashboard", path: "/dashboard" },
    { label: "Kelas", path: "/dashboard/classes" },
    { label: "Detail Kelas", path: null }, // null = current page
  ]}
/>

// Without home link
<Breadcrumb showHome={false} />
```

### 2. UserMenu Component

```jsx
import { UserMenu } from "../../components/layout";

// Header variant (default)
<UserMenu />

// Sidebar variant
<UserMenu variant="sidebar" />

// Mobile variant
<UserMenu variant="mobile" />

// Customized
<UserMenu
  variant="header"
  showFullName={true}
  showRole={true}
  className="custom-class"
/>
```

### 3. Layout Usage

```jsx
// In router configuration
import { MainLayout, DashboardLayout, AuthLayout } from "../layouts";

{
  path: "/",
  element: <MainLayout />,
  children: [...]
}

{
  path: "/dashboard",
  element: <DashboardLayout />,
  children: [...]
}
```

## Features

- ✅ Fully responsive design
- ✅ Mobile-optimized navigation
- ✅ Role-based menu items
- ✅ Auto-generated breadcrumbs
- ✅ Keyboard navigation support
- ✅ Accessible components
- ✅ Brand color consistency

## Responsive Breakpoints

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

## 📱 Responsive Guidelines

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Typography

```jsx
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

<p className="text-sm sm:text-base lg:text-lg">
  Responsive body text
</p>
```

### Responsive Spacing

```jsx
<div className="p-4 sm:p-6 lg:p-8">
  <div className="space-y-4 sm:space-y-6">Content with responsive spacing</div>
</div>
```

## 🌙 Dark Mode Support

Design system sudah siap untuk dark mode dengan CSS custom properties:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --gray-50: #1f2937;
    --gray-100: #374151;
    --gray-900: #f9fafb;
  }
}
```

## ♿ Accessibility Guidelines

### Focus States

```css
.focus-ring {
  focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2;
}
```

### Color Contrast

- Semua text memenuhi WCAG AA standard (4.5:1 ratio)
- Interactive elements memiliki sufficient contrast
- Color tidak digunakan sebagai satu-satunya cara untuk menyampaikan informasi

### Interactive Elements

```jsx
// Gunakan aria-label untuk screen readers
<button aria-label="Close dialog" className="btn btn-ghost">
  <X className="h-4 w-4" />
</button>

// Gunakan proper heading hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
```

## 🚀 Best Practices

### Do's

- ✅ Gunakan design tokens dari constants.js
- ✅ Ikuti spacing scale yang konsisten
- ✅ Gunakan semantic color names
- ✅ Test accessibility dengan screen readers
- ✅ Gunakan utility classes untuk consistency

### Don'ts

- ❌ Jangan hardcode colors di component
- ❌ Jangan skip heading levels (h1 → h3)
- ❌ Jangan gunakan spacing arbitrary (margin: 13px)
- ❌ Jangan lupakan focus states
- ❌ Jangan gunakan color saja untuk status

### Component Development

```jsx
// Good: Using design tokens
const Button = ({ variant = "primary", size = "md", children }) => {
  return (
    <button className={cn("btn", `btn-${variant}`, `btn-${size}`)}>
      {children}
    </button>
  );
};

// Bad: Hardcoded styles
const Button = ({ children }) => {
  return (
    <button style={{ backgroundColor: "#23407a", padding: "8px 16px" }}>
      {children}
    </button>
  );
};
```

---

## 📋 Checklist Implementation

- [x] Setup design tokens di index.css
- [x] Configure brand colors (#23407a)
- [x] Create typography scale
- [x] Setup semantic colors
- [x] Create utility classes
- [x] Document color palette
- [x] Setup responsive guidelines
- [x] Accessibility considerations
- [x] Component tokens
- [x] Usage examples

**Design system siap digunakan untuk pengembangan komponen UI! 🎉**
