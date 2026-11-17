import { Text, View } from 'react-native';

// The editor lives in admin.web.tsx; on phones the route just explains where to go.
export default function AdminNative() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
      <Text style={{ textAlign: 'center' }}>L'area admin è disponibile solo da browser, sul sito dell'app, alla pagina /admin.</Text>
    </View>
  );
}
