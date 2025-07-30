/**
 * Trusted Types Policies for Next.js Compatibility
 * Handles safe creation of trusted types for various Next.js use cases
 */

declare global {
  interface Window {
    trustedTypes: {
      defaultPolicy: TrustedTypePolicy | null;
      createPolicy: (name: string, policy: TrustedTypePolicyOptions) => TrustedTypePolicy;
      getPolicy: (name: string) => TrustedTypePolicy | null;
    };
  }
}

interface TrustedTypePolicy {
  createHTML: (input: string) => string;
  createScript: (input: string) => string;
  createScriptURL: (input: string) => string;
}

interface TrustedTypePolicyOptions {
  createHTML?: (input: string) => string;
  createScript?: (input: string) => string;
  createScriptURL?: (input: string) => string;
}

export function initializeTrustedTypePolicies() {
  if (typeof window === 'undefined' || !window.trustedTypes) {
    return;
  }

  try {
    // Default policy for general script execution
    if (!window.trustedTypes.defaultPolicy) {
      window.trustedTypes.createPolicy('default', {
        createHTML: (string: string) => {
          // Allow safe HTML patterns
          if (string.includes('<script') && !string.includes('nonce=')) {
            throw new Error('Unsafe script tag without nonce');
          }
          return string;
        },
        createScript: (string: string) => {
          // Allow Next.js specific patterns
          if (
            string.includes('__NEXT_DATA__') ||
            string.includes('_N_E') ||
            string.includes('__webpack_require__') ||
            string.includes('webpackJsonp') ||
            string.startsWith('(self.webpackChunk') ||
            string.includes('React') ||
            string.includes('ReactDOM')
          ) {
            return string;
          }
          
          // Allow empty strings and simple expressions
          if (!string || string.trim().length === 0) {
            return string;
          }
          
          // Block potentially dangerous patterns
          if (
            string.includes('eval(') ||
            string.includes('Function(') ||
            string.includes('setTimeout(') ||
            string.includes('setInterval(')
          ) {
            console.warn('Blocked potentially dangerous script:', string.substring(0, 100));
            return '';
          }
          
          return string;
        },
        createScriptURL: (string: string) => {
          // Allow same-origin scripts and trusted CDNs
          const allowedOrigins = [
            location.origin,
            'https://maps.googleapis.com',
            'https://maps.google.com',
            'https://www.googletagmanager.com'
          ];
          
          if (allowedOrigins.some(origin => string.startsWith(origin))) {
            return string;
          }
          
          throw new Error(`Blocked script URL from untrusted origin: ${string}`);
        }
      });
    }

    // Next.js specific policy for dynamic imports and chunks
    if (!window.trustedTypes.getPolicy('nextjs')) {
      window.trustedTypes.createPolicy('nextjs', {
        createScript: (string: string) => {
          // Allow Next.js runtime and chunk loading
          if (
            string.includes('__NEXT_DATA__') ||
            string.includes('_N_E') ||
            string.includes('next/dist/') ||
            string.includes('__webpack_require__') ||
            string.includes('webpackJsonp') ||
            string.startsWith('(self.webpackChunk') ||
            string.includes('import(') ||
            string.includes('System.import') ||
            // Allow React DevTools and hot reload
            string.includes('__REACT_DEVTOOLS_') ||
            string.includes('__webpack_hmr') ||
            string.includes('webpackHotUpdate')
          ) {
            return string;
          }
          
          // Fallback to default policy
          return window.trustedTypes.defaultPolicy?.createScript(string) || string;
        }
      });
    }

    // Webpack chunk loading policy
    if (!window.trustedTypes.getPolicy('webpack-chunk')) {
      window.trustedTypes.createPolicy('webpack-chunk', {
        createScript: (string: string) => {
          // Allow webpack chunk patterns
          if (
            string.includes('webpackChunk') ||
            string.includes('__webpack_require__') ||
            string.includes('webpack_require') ||
            string.startsWith('(self.webpackChunk') ||
            string.startsWith('(window.webpackChunk') ||
            // Allow chunk manifest and runtime
            string.includes('webpackJsonp') ||
            string.includes('__webpack_hash__')
          ) {
            return string;
          }
          
          throw new Error('Invalid webpack chunk script');
        }
      });
    }

    // Dynamic imports policy
    if (!window.trustedTypes.getPolicy('next-dynamic')) {
      window.trustedTypes.createPolicy('next-dynamic', {
        createScript: (string: string) => {
          // Allow dynamic import patterns
          if (
            string.includes('import(') ||
            string.includes('__webpack_require__.e(') ||
            string.includes('Promise.all([') ||
            // Allow React.lazy and Suspense patterns
            string.includes('React.lazy') ||
            string.includes('lazy(')
          ) {
            return string;
          }
          
          throw new Error('Invalid dynamic import script');
        }
      });
    }

    console.log('✅ Trusted Types policies initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize Trusted Types policies:', error);
    // Don't throw - allow app to continue with reduced security
  }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTrustedTypePolicies);
  } else {
    initializeTrustedTypePolicies();
  }
}