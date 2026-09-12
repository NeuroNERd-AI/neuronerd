import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Placeholder } from '@/components/ui/Placeholder';

export function NotFoundPage() {
  return <div className="mx-auto max-w-4xl"><PageHeader title="Page not found" description="The page you are looking for does not exist." /><Placeholder title="Nothing here yet" description="Return to your dashboard to continue."><Link to="/dashboard" className="btn-primary">Go to dashboard</Link></Placeholder></div>;
}
