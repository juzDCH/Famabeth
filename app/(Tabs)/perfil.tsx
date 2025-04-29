import { Redirect } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import AccountScreen from '../screens/Usuario/account';

export default function PerfilScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/screens/Usuario/login" />;
  }

  return <AccountScreen />;
}