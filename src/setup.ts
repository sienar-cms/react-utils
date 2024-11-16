import { registerProvider } from '@/providers.tsx';
import AuthProvider from '@/components/AuthProvider.tsx';
import InfrastructureProvider from '@/components/InfrastructureProvider.tsx';

export default function setup() {
	registerProvider(AuthProvider);
	registerProvider(InfrastructureProvider);
}