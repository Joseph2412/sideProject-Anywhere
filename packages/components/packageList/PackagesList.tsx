import { Package } from '@repo/ui';

export const PackagesList = ({ packages }: { packages: Package[] }) => {
  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>{pkg.title}</div>
      ))}
    </div>
  );
};
