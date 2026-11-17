import { Pressable, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../src/theme';
import { Logo, SectionStack } from '../src/ui';

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 16, paddingBottom: 30 }}>
      <View style={{ paddingHorizontal: 14 }}>
        <Pressable hitSlop={14} onPress={() => router.push('/search')} accessibilityLabel="Search">
          <Feather name="search" size={22} color={colors.ink} />
        </Pressable>
        <View style={{ marginTop: 18 }}><Logo size={28} /></View>
        <Text style={{ fontFamily: fonts.black, fontSize: 56, letterSpacing: -2, color: colors.ink, marginTop: 8 }}>WAOOO</Text>
        <Text style={{ fontFamily: fonts.extra, fontSize: 10, letterSpacing: 0.8, color: colors.ink, marginTop: 2 }}>MILAN FASHION WEEK, UNLOCKED.</Text>
      </View>
      <View style={{ marginTop: 48 }}>
        <SectionStack show={['info', 'market', 'fashion']} big />
      </View>
    </ScrollView>
  );
}
