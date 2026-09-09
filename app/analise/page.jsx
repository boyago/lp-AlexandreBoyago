import AnalysisDashboard from './AnalysisDashboard'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Análise privada | AI Game Lab',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, nosnippet: true } },
  referrer: 'no-referrer',
}

export default function AnalysisPage() { return <AnalysisDashboard /> }
