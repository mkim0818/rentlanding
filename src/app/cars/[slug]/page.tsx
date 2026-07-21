import { notFound } from 'next/navigation';
import { cars } from '@/lib/cars';
import CarDetailClient from './CarDetailClient';

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) return {};
  return {
    title: `${car.brand} ${car.model} ${car.trim} | ○○렌터카`,
    description: `${car.brand} ${car.model} 장기렌트 월 ${Math.round(car.baseMonthlyPrice / 10_000)}만원. 차량가 ${Math.round(car.carPrice / 10_000).toLocaleString()}만원.`,
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = cars.find((c) => c.slug === slug);
  if (!car) notFound();
  const idx = cars.indexOf(car);
  return <CarDetailClient car={car} idx={idx} total={cars.length} />;
}
