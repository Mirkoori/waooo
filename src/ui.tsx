import React, { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, SectionKey, sections } from './theme';

type IconName = React.ComponentProps<typeof Feather>['name'];

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.22, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.bg, fontFamily: fonts.black, fontSize: size * 0.56, lineHeight: size * 0.62 }}>W</Text>
      <View style={{ flexDirection: 'row', gap: size * 0.07, marginTop: size * 0.02 }}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ width: size * 0.12, height: size * 0.12, borderRadius: size, backgroundColor: colors.bg }} />
        ))}
      </View>
    </View>
  );
}

/** Colored page header with back / search buttons. Used by every screen but the home. */
export function Header({
  section, label, title, big,
}: { section: SectionKey; label?: string; title: string; big?: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const s = sections[section];
  return (
    <View style={[styles.header, { backgroundColor: s.color, paddingTop: insets.top + 16 }]}>
      <View style={styles.headerRow}>
        <Pressable hitSlop={14} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} accessibilityLabel="Back">
          <Feather name="arrow-left" size={22} color={colors.ink} />
        </Pressable>
        <Pressable hitSlop={14} onPress={() => router.push('/search')} accessibilityLabel="Search">
          <Feather name="search" size={22} color={colors.ink} />
        </Pressable>
      </View>
      {big ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 22 }}>
            <Text style={styles.headerNum}>{s.n}</Text>
            <Text style={styles.headerTitleMid}>{title}</Text>
          </View>
          <Text style={styles.headerBig}>{big}</Text>
        </>
      ) : (
        <>
          <Text style={styles.headerLabel}>{label}</Text>
          <Text style={styles.headerTitle}>{title}</Text>
        </>
      )}
    </View>
  );
}

export function Screen({ section, header, children, stack }: { section: SectionKey; header: ReactNode; children: ReactNode; stack?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: stack ? 0 : 40 }} showsVerticalScrollIndicator={false}>
        {header}
        {children}
      </ScrollView>
    </View>
  );
}

export function List({ children }: { children: ReactNode }) {
  return <View style={{ paddingHorizontal: 14, paddingTop: 14, gap: 8 }}>{children}</View>;
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: ViewStyle; onPress?: () => void }) {
  const C: any = onPress ? Pressable : View;
  return (
    <C onPress={onPress} style={[styles.card, style]}>
      {children}
    </C>
  );
}

/** Hub row: bold title, light description, chevron. */
export function HubRow({ title, subtitle, href }: { title: string; subtitle: string; href: Href }) {
  const router = useRouter();
  return (
    <Pressable style={styles.hubRow} onPress={() => router.push(href)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.hubTitle}>{title}</Text>
        <Text style={styles.hubSub}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.ink} />
    </Pressable>
  );
}

export function Btn({ label, onPress, icon, primary, flex, disabled }: { label: string; onPress: () => void; icon?: IconName; primary?: boolean; flex?: boolean; disabled?: boolean }) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.btn, primary ? styles.btnPrimary : styles.btnGhost, flex && { flex: 1 }, disabled && { opacity: 0.35 }]}
    >
      {icon && <Feather name={icon} size={12} color={primary ? colors.bg : colors.ink} style={{ marginRight: 6 }} />}
      <Text style={[styles.btnText, { color: primary ? colors.bg : colors.ink }]}>{label.toUpperCase()}</Text>
    </Pressable>
  );
}

export function BtnRow({ children, stretch }: { children: ReactNode; stretch?: boolean }) {
  return <View style={{ flexDirection: 'row', flexWrap: stretch ? 'nowrap' : 'wrap', gap: 8, marginTop: 10 }}>{children}</View>;
}

export function DateBadge({ top, bottom }: { top: string; bottom: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeTop}>{top.toUpperCase()}</Text>
      <Text style={styles.badgeBottom}>{bottom}</Text>
    </View>
  );
}

export function Pill({ label, color = colors.market }: { label: string; color?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: color }]}>
      <Text style={styles.pillText}>{label.toUpperCase()}</Text>
    </View>
  );
}

export function MonthHeading({ children }: { children: string }) {
  return <Text style={styles.monthHeading}>{children.toUpperCase()}</Text>;
}

export function Row({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 }}>
      <Feather name={icon} size={12} color={colors.ink} style={{ marginTop: 2, marginRight: 6 }} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

export function NoteBox({ label = 'Notes', text }: { label?: string; text: string }) {
  return (
    <View style={styles.note}>
      <Text style={styles.noteLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
}

export function Empty({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

export function SearchField({ value, onChangeText, placeholder, autoFocus }: { value: string; onChangeText: (t: string) => void; placeholder: string; autoFocus?: boolean }) {
  return (
    <View style={styles.search}>
      <Feather name="search" size={16} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoFocus={autoFocus}
        autoCorrect={false}
        style={styles.searchInput}
      />
    </View>
  );
}

/**
 * Stacked section cards — each overlaps the previous one. `show` is top to bottom;
 * `big` (home) shows subtitles and the FW27 lettering on the last card.
 */
export function SectionStack({ show, big }: { show: SectionKey[]; big?: boolean }) {
  const router = useRouter();
  return (
    <View>
      {show.map((key, i) => {
        const s = sections[key];
        const isLast = i === show.length - 1;
        return (
          <Pressable
            key={key}
            onPress={() => router.replace(s.href)}
            style={[
              styles.stackCard,
              { backgroundColor: s.color, marginTop: i === 0 ? 0 : -46, minHeight: isLast ? (big ? 166 : 120) : 100 },
            ]}
          >
            <View style={styles.stackTop}>
              <Text style={styles.stackNum}>{s.n}</Text>
              <Text style={styles.stackTitle}>{s.title}</Text>
              <Feather name="arrow-right" size={18} color={colors.ink} />
            </View>
            {big ? <Text style={styles.stackSub}>{s.subtitle}</Text> : null}
            {isLast && big ? <Text style={styles.stackBig}>FW27</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 14, paddingBottom: 22, borderBottomLeftRadius: 26, borderBottomRightRadius: 26 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLabel: { fontFamily: fonts.extra, fontSize: 9, letterSpacing: 1, color: colors.ink, marginTop: 22 },
  headerTitle: { fontFamily: fonts.black, fontSize: 28, color: colors.ink, marginTop: 4 },
  headerNum: { fontFamily: fonts.extra, fontSize: 10, color: colors.ink, marginRight: 8 },
  headerTitleMid: { fontFamily: fonts.black, fontSize: 22, color: colors.ink },
  headerBig: { fontFamily: fonts.black, fontSize: 76, color: colors.ink, letterSpacing: -3, marginTop: 8, lineHeight: 84 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 12 },
  hubRow: { backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 11, flexDirection: 'row', alignItems: 'center' },
  hubTitle: { fontFamily: fonts.black, fontSize: 13, color: colors.ink },
  hubSub: { fontFamily: fonts.semibold, fontSize: 10, color: '#3A3833', marginTop: 3 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 14, height: 28, borderRadius: 14, borderWidth: 1.2, borderColor: colors.ink },
  btnPrimary: { backgroundColor: colors.ink },
  btnGhost: { backgroundColor: 'transparent' },
  btnText: { fontFamily: fonts.extra, fontSize: 9, letterSpacing: 0.6 },
  badge: { alignSelf: 'flex-start', width: 54, minHeight: 54, borderRadius: 9, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, paddingHorizontal: 2 },
  badgeTop: { fontFamily: fonts.extra, fontSize: 8, color: colors.bg },
  badgeBottom: { fontFamily: fonts.black, fontSize: 15, color: colors.bg, textAlign: 'center', marginTop: 1 },
  pill: { paddingHorizontal: 10, height: 18, borderRadius: 9, justifyContent: 'center', alignSelf: 'flex-start' },
  pillText: { fontFamily: fonts.extra, fontSize: 8, letterSpacing: 0.6, color: colors.ink },
  monthHeading: { fontFamily: fonts.extra, fontSize: 10, letterSpacing: 0.8, color: '#3A3833', marginTop: 10, marginBottom: 2 },
  rowText: { fontFamily: fonts.semibold, fontSize: 10, color: '#2A2824', flex: 1 },
  note: { backgroundColor: colors.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, marginTop: 8 },
  noteLabel: { fontFamily: fonts.extra, fontSize: 7, letterSpacing: 0.8, color: colors.muted },
  noteText: { fontFamily: fonts.extra, fontSize: 9, color: colors.ink, marginTop: 2 },
  empty: { fontFamily: fonts.semibold, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 40, paddingHorizontal: 30 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 22, paddingHorizontal: 14, height: 40, gap: 8 },
  searchInput: { flex: 1, fontFamily: fonts.semibold, fontSize: 12, color: colors.ink, padding: 0 },
  stackCard: { borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 18, borderBottomRightRadius: 18, marginHorizontal: 14, paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: -2 }, elevation: 2 },
  stackTop: { flexDirection: 'row', alignItems: 'center' },
  stackNum: { fontFamily: fonts.extra, fontSize: 9, color: colors.ink, width: 22 },
  stackTitle: { fontFamily: fonts.black, fontSize: 15, color: colors.ink, flex: 1 },
  stackSub: { fontFamily: fonts.extra, fontSize: 8, letterSpacing: 0.4, color: colors.ink, marginTop: 6, marginLeft: 22, lineHeight: 12 },
  stackBig: { fontFamily: fonts.black, fontSize: 70, letterSpacing: -3, color: colors.ink, marginTop: 14, lineHeight: 78 },
});
