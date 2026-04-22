import type { SignalEvidenceItem } from '@/lib/types';
import SignalEvidenceCard from './SignalEvidenceCard';

export default function SignalEvidenceGrid({ evidence }: { evidence: SignalEvidenceItem[] }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {evidence.map((item) => (
        <SignalEvidenceCard key={`${item.key}-${item.label}`} item={item} />
      ))}
    </section>
  );
}
