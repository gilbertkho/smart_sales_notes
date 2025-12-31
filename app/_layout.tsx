import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { initDatabase } from '@/src/database/db_service';
import Drawer from 'expo-router/drawer';
import { SQLiteProvider } from 'expo-sqlite';
import { RootSiblingParent } from 'react-native-root-siblings';


export const unstable_settings = {
  anchor: '(home)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (    
    <SQLiteProvider
      databaseName="smart_sales.db"
      onInit={(db) => initDatabase(db)}
      useSuspense
    >
      <RootSiblingParent>
        <Drawer>
          <Drawer.Screen name="(home)/index" options={{title: 'Home', headerShown: true}} />
          <Drawer.Screen name="cart/index" options={{ title:'Cart', headerShown: true }} />
          <Drawer.Screen name="cart/detail" options={{ title:'Detail', headerShown: false, drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="settings/index" options={{ title:'Settings', headerShown: true }} />
          <Drawer.Screen name="(tabs)" options={{title: 'Tabs', headerShown: true, drawerItemStyle: { display: 'none' }}} />
          <Drawer.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', drawerItemStyle: { display: 'none' } }} />
        </Drawer>
        <StatusBar style="auto" />
      </RootSiblingParent>
    </SQLiteProvider>
  );
}
