import DashboardShell from './components/DashboardShell';

/**
 * App
 * Root of CoC Legend Sync. Dark mode is locked at the page level
 * (no theme toggle, no light-mode section) per the design brief.
 */
export default function App() {
  return (
    <div className="dark">
      <DashboardShell />
    </div>
  );
}