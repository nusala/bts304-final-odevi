const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Root variables
css = css.replace(/:root\s*\{[\s\S]*?--transition-slow:[^\}]*\}/, :root {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f1f5f9;
    --bg-card: #ffffff;
    --bg-card-hover: #f1f5f9;
    --glass: rgba(255, 255, 255, 0.8);
    --glass-border: rgba(0, 0, 0, 0.06);
    --glass-strong: rgba(255, 255, 255, 0.95);

    --primary: #4f46e5;
    --primary-light: #818cf8;
    --primary-dark: #3730a3;
    --primary-glow: rgba(79, 70, 229, 0.2);
    --secondary: #0ea5e9;
    --secondary-light: #38bdf8;
    --accent: #e11d48;
    --accent-light: #fb7185;
    --success: #10b981;
    --success-light: rgba(16, 185, 129, 0.15);
    --warning: #f59e0b;
    --warning-light: rgba(245, 158, 11, 0.15);
    --danger: #ef4444;
    --danger-light: rgba(239, 68, 68, 0.15);
    --info: #3b82f6;
    --info-light: rgba(59, 130, 246, 0.15);

    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-muted: #94a3b8;

    --sidebar-width: 240px;
    --header-height: 60px;
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    --shadow-glow: 0 0 15px rgba(79, 70, 229, 0.1);

    --transition-fast: 0.15s ease;
    --transition-normal: 0.25s ease;
    --transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
});

// 2. Body background
css = css.replace(/body\s*\{[\s\S]*?line-height:[^\}]*\}/, ody {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 13px;
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.5;
});

css = css.replace(/body::before\s*\{[\s\S]*?z-index:\s*0;\n\}/, ody::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(ellipse at 20% 50%, rgba(79, 70, 229, 0.03) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(14, 165, 233, 0.02) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(225, 29, 72, 0.01) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
});

// 3. Sidebar background
css = css.replace(/background: rgba\(18, 18, 26, 0.85\);/, 'background: rgba(255, 255, 255, 0.85);');

// 4. Sizing changes
css = css.replace(/font-size: 36px;(\s+margin-bottom: 8px;\s+filter: drop-shadow.*pulse-glow)/, 'font-size: 26px;'); // brand-icon
css = css.replace(/font-size: 22px;(\s+font-weight: 800;)/, 'font-size: 18px;'); // brand-title
css = css.replace(/padding: 12px 18px;(\s+border-radius: var\(--radius-md\);\s+color: var\(--text-secondary\);\s+text-decoration: none;\s+font-size: )14px;/, 'padding: 10px 14px;;'); // nav-item
css = css.replace(/font-size: 20px;(\s+width: )28px;/, 'font-size: 16px;;'); // nav-icon
css = css.replace(/font-size: 28px;(\s+font-weight: 700;)/, 'font-size: 22px;'); // page-title
css = css.replace(/font-size: 36px;(\s+font-weight: 800;)/, 'font-size: 26px;'); // stat-card-value
css = css.replace(/font-size: 13px;(\s+color: var\(--text-secondary\);\s+font-weight: )500;/, 'font-size: 12px;;'); // stat-card-label
css = css.replace(/padding: 14px 18px;/g, 'padding: 10px 14px;'); // data-table padding
css = css.replace(/font-size: 14px;(\s+color: var\(--text-primary\);)/, 'font-size: 13px;'); // data-table td
css = css.replace(/gap: 8px;(\s+padding: )10px 20px;(\s+border: none;\s+border-radius: var\(--radius-sm\);\s+font-family: 'Inter', sans-serif;\s+font-size: )14px;/, 'gap: 6px; 16px;;'); // btn
css = css.replace(/padding: 12px 16px;(\s+background: var\(--bg-primary\);)/, 'padding: 10px 14px;background: var(--bg-secondary);'); // form-input
css = css.replace(/padding: 4px 12px;(\s+border-radius: var\(--radius-full\);\s+font-size: )12px;/, 'padding: 3px 10px;;'); // badge

fs.writeFileSync(cssPath, css);
console.log('CSS updated successfully');
