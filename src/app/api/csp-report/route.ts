import { NextRequest, NextResponse } from 'next/server';

interface CSPReport {
  'csp-report': {
    'blocked-uri': string;
    'document-uri': string;
    'original-policy': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'source-file': string;
    'line-number': number;
    'column-number': number;
    'status-code': number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const report: CSPReport = await request.json();
    const cspReport = report['csp-report'];

    // Log CSP violation for monitoring
    console.warn('🚨 CSP Violation Report:', {
      blockedUri: cspReport['blocked-uri'],
      documentUri: cspReport['document-uri'],
      violatedDirective: cspReport['violated-directive'],
      effectiveDirective: cspReport['effective-directive'],
      sourceFile: cspReport['source-file'],
      lineNumber: cspReport['line-number'],
      columnNumber: cspReport['column-number'],
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    });

    // In production, you might want to send this to a monitoring service
    // like Sentry, DataDog, or a custom analytics endpoint

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('Failed to process CSP report:', error);
    return NextResponse.json({ error: 'Invalid report' }, { status: 400 });
  }
}