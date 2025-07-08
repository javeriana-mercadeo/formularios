/**
 * Style Loader Module
 * Handles loading and managing CSS modules for the form system
 */

class StyleLoader {
    constructor() {
        this.loadedStyles = new Set();
        this.basePath = '';
    }

    /**
     * Set the base path for CSS files
     * @param {string} path - Base path for CSS files
     */
    setBasePath(path) {
        this.basePath = path.endsWith('/') ? path : path + '/';
    }

    /**
     * Load CSS file dynamically
     * @param {string} cssPath - Path to CSS file
     * @param {string} id - Optional ID for the link element
     */
    async loadCSS(cssPath, id = null) {
        const fullPath = this.basePath + cssPath;
        
        // Check if already loaded
        if (this.loadedStyles.has(fullPath)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = fullPath;
            
            if (id) {
                link.id = id;
            }

            link.onload = () => {
                this.loadedStyles.add(fullPath);
                resolve();
            };
            
            link.onerror = () => {
                reject(new Error(`Failed to load CSS: ${fullPath}`));
            };

            document.head.appendChild(link);
        });
    }

    /**
     * Load multiple CSS files
     * @param {Array<string>} cssPaths - Array of CSS file paths
     */
    async loadMultipleCSS(cssPaths) {
        const promises = cssPaths.map(path => this.loadCSS(path));
        return Promise.all(promises);
    }

    /**
     * Load the complete form styles
     * @param {Object} options - Loading options
     * @param {boolean} options.includeTheme - Whether to include custom theme
     * @param {string} options.themePath - Path to custom theme file
     */
    async loadFormStyles(options = {}) {
        const { includeTheme = false, themePath = 'themes/custom-theme.css' } = options;

        try {
            // Load main form styles (includes all imports)
            await this.loadCSS('styles/form-styles.css', 'form-styles');

            // Load custom theme if requested
            if (includeTheme) {
                await this.loadCSS(themePath, 'form-theme');
            }

            return true;
        } catch (error) {
            console.error('Error loading form styles:', error);
            return false;
        }
    }

    /**
     * Load individual style modules
     * @param {Array<string>} modules - Array of module names
     */
    async loadModules(modules) {
        const stylePaths = modules.map(module => `styles/${module}.css`);
        return this.loadMultipleCSS(stylePaths);
    }

    /**
     * Apply custom CSS variables
     * @param {Object} variables - CSS custom properties
     */
    applyCustomVariables(variables) {
        const root = document.documentElement;
        
        Object.entries(variables).forEach(([property, value]) => {
            const cssProperty = property.startsWith('--') ? property : `--${property}`;
            root.style.setProperty(cssProperty, value);
        });
    }

    /**
     * Remove loaded styles
     * @param {string} id - ID of the style element to remove
     */
    removeStyles(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    /**
     * Check if styles are loaded
     * @param {string} path - Path to check
     */
    isLoaded(path) {
        const fullPath = this.basePath + path;
        return this.loadedStyles.has(fullPath);
    }

    /**
     * Get all loaded styles
     */
    getLoadedStyles() {
        return Array.from(this.loadedStyles);
    }

    /**
     * Clear all loaded styles tracking
     */
    clearLoadedStyles() {
        this.loadedStyles.clear();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleLoader;
}

// Global availability
window.StyleLoader = StyleLoader;