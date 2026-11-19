import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Btn, Card, Empty, Header, List, Screen } from '../../../src/ui';
import { useData } from '../../../src/data';
import { register } from '../../../src/tickets';
import { openUrl } from '../../../src/actions';
import { LEGAL_LINKS } from '../../../src/links';
import { colors, fonts } from '../../../src/theme';

const ROLES = ['Buyer', 'Press', 'Brand', 'Showroom', 'Other'];

export default function Register() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useData();
  const router = useRouter();
  const e = data.events.find((x) => x.id === id);
  const [f, setF] = useState({ first: '', last: '', email: '', role: '', consent: false });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const header = <Header section="fashion" label="01 · FASHION WEEK" title="REGISTER" />;
  if (!e) return <Screen section="fashion" header={header}><Empty text="Event not found." /></Screen>;

  const input = { backgroundColor: colors.bg, borderRadius: 10, paddingHorizontal: 12, height: 40, fontFamily: fonts.semibold, fontSize: 12, color: colors.ink } as const;
  const label = { fontFamily: fonts.extra, fontSize: 9, letterSpacing: 0.8, color: colors.ink, marginTop: 10, marginBottom: 4 } as const;

  async function submit() {
    setErr('');
    if (!f.role) return setErr('Please select your role.');
    setBusy(true);
    try {
      await register(e!.id, { ...f, first: f.first.trim(), last: f.last.trim(), email: f.email.trim() });
      router.replace(`/fashion-week/ticket/${e!.id}`);
    } catch (x: any) { setErr(x.message); } finally { setBusy(false); }
  }

  return (
    <Screen section="fashion" header={header}>
      <List>
        <Card>
          <Text style={{ fontFamily: fonts.black, fontSize: 14, color: colors.ink }}>{e.name.toUpperCase()}</Text>
          <Text style={label}>FIRST NAME</Text>
          <TextInput style={input} value={f.first} onChangeText={(v) => setF({ ...f, first: v })} autoComplete="given-name" />
          <Text style={label}>LAST NAME</Text>
          <TextInput style={input} value={f.last} onChangeText={(v) => setF({ ...f, last: v })} autoComplete="family-name" />
          <Text style={label}>EMAIL</Text>
          <TextInput style={input} value={f.email} onChangeText={(v) => setF({ ...f, email: v })} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <Text style={label}>ROLE</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {ROLES.map((r) => (
              <Pressable key={r} onPress={() => setF({ ...f, role: r })} style={{ paddingHorizontal: 12, height: 28, borderRadius: 14, justifyContent: 'center', backgroundColor: f.role === r ? colors.ink : colors.bg }}>
                <Text style={{ fontFamily: fonts.extra, fontSize: 9, color: f.role === r ? colors.bg : colors.ink }}>{r.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={() => setF({ ...f, consent: !f.consent })} style={{ flexDirection: 'row', gap: 8, marginTop: 14, alignItems: 'flex-start' }}>
            <View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: colors.ink, alignItems: 'center', justifyContent: 'center', backgroundColor: f.consent ? colors.ink : 'transparent' }}>
              {f.consent && <Feather name="check" size={12} color={colors.bg} />}
            </View>
            <Text style={{ flex: 1, fontFamily: fonts.semibold, fontSize: 9.5, lineHeight: 14, color: '#2A2824' }}>
              I agree to the processing of my data to manage my registration and share it with the event organizer.{' '}
              <Text style={{ textDecorationLine: 'underline' }} onPress={() => openUrl(LEGAL_LINKS[0].url)}>Privacy policy</Text>
            </Text>
          </Pressable>
          {err ? <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: '#B3261E', marginTop: 10 }}>{err}</Text> : null}
          <View style={{ marginTop: 14 }}>
            <Btn primary label={busy ? 'Sending…' : 'Register'} disabled={busy || !f.consent || !f.first.trim() || !f.last.trim() || !f.email.trim()} onPress={submit} />
          </View>
        </Card>
      </List>
    </Screen>
  );
}
