'use server';
import type React from 'react';
import Dashboard from './dashboard';
import { fetchLinks } from '../lib/data';

export default async function DashboardContainer() {
  const initialLinks = await fetchLinks();

  return <Dashboard initialLinks={initialLinks} />;
}
