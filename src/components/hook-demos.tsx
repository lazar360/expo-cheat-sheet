import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Pressable, Text, TextInput, View, type PressableProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

function DemoButton({ title, ...props }: PressableProps & { title: string }) {
  return (
    <Pressable
      {...props}
      className="rounded-3xl bg-selected px-4 py-2 active:opacity-70 dark:bg-selected-dark">
      <Text className="text-sm font-bold text-black dark:text-white">{title}</Text>
    </Pressable>
  );
}

function DemoText({ children }: { children: ReactNode }) {
  return <Text className="text-base font-medium text-black dark:text-white">{children}</Text>;
}

function Note({ children }: { children: ReactNode }) {
  return <Text className="text-sm text-secondary dark:text-secondary-dark">{children}</Text>;
}

// useState : une valeur mémorisée qui redessine le composant quand elle change.
export function UseStateDemo() {
  const [count, setCount] = useState(0);

  return (
    <View className="flex-row flex-wrap items-center gap-2">
      <DemoButton title="+1" onPress={() => setCount((value) => value + 1)} />
      <DemoButton title="Reset" onPress={() => setCount(0)} />
      <DemoText>Compteur : {count}</DemoText>
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
    <View className="flex-row flex-wrap items-center gap-2">
      <DemoButton
        title={running ? 'Pause' : 'Démarrer'}
        onPress={() => setRunning((value) => !value)}
      />
      <DemoText>Chrono : {seconds} s</DemoText>
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
    <View className="gap-2">
      <TextInput
        ref={inputRef}
        value={text}
        onChangeText={setText}
        placeholder="Tapez quelque chose…"
        placeholderTextColor={theme.textSecondary}
        className="rounded-lg border border-selected px-4 py-2 text-base text-black dark:border-selected-dark dark:text-white"
      />
      <View className="flex-row flex-wrap items-center gap-2">
        <DemoButton title="Focus" onPress={() => inputRef.current?.focus()} />
        <DemoButton title="Vider" onPress={() => setText('')} />
      </View>
      <View className="flex-row flex-wrap items-center gap-2">
        <DemoButton title="Clic silencieux" onPress={() => (silentClicks.current += 1)} />
        <DemoButton title="Afficher" onPress={() => setShown(silentClicks.current)} />
        <DemoText>Clics : {shown}</DemoText>
      </View>
      <Note>
        Les clics silencieux sont comptés dans un ref : l&apos;écran ne bouge pas tant qu&apos;on
        ne copie pas la valeur dans un state.
      </Note>
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
    <View className="gap-2">
      <DemoText>
        {primeCount} nombres premiers jusqu&apos;à {limit}
      </DemoText>
      <View className="flex-row flex-wrap items-center gap-2">
        <DemoButton title="Limite ×2" onPress={() => setLimit((value) => value * 2)} />
        <DemoButton title={`Autre clic (${clicks})`} onPress={() => setClicks((v) => v + 1)} />
      </View>
      <Note>« Autre clic » redessine l&apos;écran sans relancer le calcul.</Note>
    </View>
  );
}

// useCallback : garder la même fonction entre les rendus.
export function UseCallbackDemo() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((value) => value + 1), []);
  const decrement = useCallback(() => setCount((value) => value - 1), []);

  return (
    <View className="flex-row flex-wrap items-center gap-2">
      <DemoButton title="−1" onPress={decrement} />
      <DemoButton title="+1" onPress={increment} />
      <DemoText>Compteur : {count}</DemoText>
    </View>
  );
}

// useContext : lire une valeur fournie par un parent, sans la passer en props.
const LanguageContext = createContext<'fr' | 'en'>('fr');

function Greeting() {
  const language = useContext(LanguageContext);
  return <DemoText>{language === 'fr' ? 'Bonjour !' : 'Hello!'}</DemoText>;
}

export function UseContextDemo() {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  return (
    <LanguageContext value={language}>
      <View className="flex-row flex-wrap items-center gap-2">
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
    <View className="flex-row flex-wrap items-center gap-2">
      <DemoButton title="Basculer" onPress={toggle} />
      <DemoText>{isOn ? '💡 Allumé' : '🌑 Éteint'}</DemoText>
    </View>
  );
}
