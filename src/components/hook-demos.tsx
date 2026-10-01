import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type PressableProps } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function DemoButton({ title, ...props }: PressableProps & { title: string }) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type="backgroundSelected" style={styles.button}>
        <ThemedText type="smallBold">{title}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

// useState : une valeur mémorisée qui redessine le composant quand elle change.
export function UseStateDemo() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.row}>
      <DemoButton title="+1" onPress={() => setCount((value) => value + 1)} />
      <DemoButton title="Reset" onPress={() => setCount(0)} />
      <ThemedText>Compteur : {count}</ThemedText>
    </View>
  );
}

// useEffect : lancer un effet de bord (timer, abonnement…) et le nettoyer.
export function UseEffectDemo() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <View style={styles.row}>
      <DemoButton
        title={running ? 'Pause' : 'Démarrer'}
        onPress={() => setRunning((value) => !value)}
      />
      <ThemedText>Chrono : {seconds} s</ThemedText>
    </View>
  );
}

// useRef : une valeur qui persiste SANS déclencher de rendu, ou une référence vers un composant.
export function UseRefDemo() {
  const inputRef = useRef<TextInput>(null);
  const silentClicks = useRef(0);
  const [shown, setShown] = useState(0);
  const [text, setText] = useState('');
  const theme = useTheme();

  return (
    <View style={styles.column}>
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        placeholder="Tapez quelque chose…"
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
      />
      <View style={styles.row}>
        <DemoButton title="Focus" onPress={() => inputRef.current?.focus()} />
        <DemoButton title="Vider" onPress={() => setText('')} />
      </View>
      <View style={styles.row}>
        <DemoButton title="Clic silencieux" onPress={() => (silentClicks.current += 1)} />
        <DemoButton title="Afficher" onPress={() => setShown(silentClicks.current)} />
        <ThemedText>Clics : {shown}</ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Les clics silencieux sont comptés dans un ref : l&apos;écran ne bouge pas tant
        qu&apos;on ne copie pas la valeur dans un state.
      </ThemedText>
    </View>
  );
}

function isPrime(n: number) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// useMemo : mettre en cache le résultat d'un calcul coûteux.
export function UseMemoDemo() {
  const [limit, setLimit] = useState(10000);
  const [clicks, setClicks] = useState(0);

  const primeCount = useMemo(() => {
    let total = 0;
    for (let n = 2; n <= limit; n++) {
      if (isPrime(n)) total++;
    }
    return total;
  }, [limit]);

  return (
    <View style={styles.column}>
      <ThemedText>
        {primeCount} nombres premiers jusqu&apos;à {limit}
      </ThemedText>
      <View style={styles.row}>
        <DemoButton title="Limite ×2" onPress={() => setLimit((value) => value * 2)} />
        <DemoButton title={`Autre clic (${clicks})`} onPress={() => setClicks((v) => v + 1)} />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        « Autre clic » redessine l&apos;écran sans relancer le calcul.
      </ThemedText>
    </View>
  );
}

// useCallback : garder la même fonction entre les rendus.
export function UseCallbackDemo() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((value) => value + 1), []);
  const decrement = useCallback(() => setCount((value) => value - 1), []);

  return (
    <View style={styles.row}>
      <DemoButton title="−1" onPress={decrement} />
      <DemoButton title="+1" onPress={increment} />
      <ThemedText>Compteur : {count}</ThemedText>
    </View>
  );
}

// useContext : lire une valeur fournie par un parent, sans la passer en props.
const LanguageContext = createContext<'fr' | 'en'>('fr');

function Greeting() {
  const language = useContext(LanguageContext);
  return <ThemedText>{language === 'fr' ? 'Bonjour !' : 'Hello!'}</ThemedText>;
}

export function UseContextDemo() {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  return (
    <LanguageContext value={language}>
      <View style={styles.row}>
        <DemoButton
          title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
          onPress={() => setLanguage((value) => (value === 'fr' ? 'en' : 'fr'))}
        />
        <Greeting />
      </View>
    </LanguageContext>
  );
}

// Hook personnalisé : regrouper de la logique réutilisable dans une fonction « use… ».
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle] as const;
}

export function CustomHookDemo() {
  const [isOn, toggle] = useToggle();

  return (
    <View style={styles.row}>
      <DemoButton title="Basculer" onPress={toggle} />
      <ThemedText>{isOn ? '💡 Allumé' : '🌑 Éteint'}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  column: {
    gap: Spacing.two,
  },
  button: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  pressed: {
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
});
