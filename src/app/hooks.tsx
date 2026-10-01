import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CodeBlock } from '@/components/code-block';
import {
  CustomHookDemo,
  UseCallbackDemo,
  UseContextDemo,
  UseEffectDemo,
  UseMemoDemo,
  UseRefDemo,
  UseStateDemo,
} from '@/components/hook-demos';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HookSectionProps = {
  title: string;
  description: ReactNode;
  code: string;
  demo: ReactNode;
};

function HookSection({ title, description, code, demo }: HookSectionProps) {
  return (
    <Collapsible title={title}>
      <View style={styles.section}>
        <ThemedText type="small">{description}</ThemedText>
        <CodeBlock>{code}</CodeBlock>
        <ThemedText type="smallBold">Essayez :</ThemedText>
        {demo}
      </View>
    </Collapsible>
  );
}

export default function HooksScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      keyboardShouldPersistTaps="handled">
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Les hooks</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Des fonctions « use… » qui donnent à un composant{'\n'}de la mémoire, des effets et
            plus encore.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.rules}>
          <ThemedText type="smallBold">Les 2 règles des hooks</ThemedText>
          <ThemedText type="small">
            1. Les appeler en haut du composant, jamais dans un if, une boucle ou une fonction
            imbriquée.
          </ThemedText>
          <ThemedText type="small">
            2. Les appeler uniquement dans un composant React ou dans un autre hook.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <HookSection
            title="useState — mémoriser une valeur"
            description="Garde une valeur entre les rendus. Appeler le setter change la valeur et redessine le composant."
            code={`
const [count, setCount] = useState(0);

setCount(5);                  // nouvelle valeur
setCount((value) => value + 1); // d'après l'ancienne`}
            demo={<UseStateDemo />}
          />

          <HookSection
            title="useEffect — effets de bord"
            description="Exécute du code après le rendu : timer, abonnement, appel réseau… La fonction retournée nettoie l'effet. Le tableau de dépendances indique quand le relancer."
            code={`
useEffect(() => {
  if (!running) return;
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // nettoyage
}, [running]); // relancé quand running change

// [] : une seule fois au montage
// pas de tableau : après chaque rendu`}
            demo={<UseEffectDemo />}
          />

          <HookSection
            title="useRef — valeur sans rendu"
            description="Une boîte { current } qui persiste entre les rendus mais ne redessine PAS l'écran quand elle change. Sert aussi à accéder à un composant (focus d'un champ…). À lire dans les gestionnaires d'événements, pas pendant le rendu."
            code={`
const inputRef = useRef<TextInput>(null);
<TextInput ref={inputRef} />
inputRef.current?.focus();

const clicks = useRef(0);
clicks.current += 1; // aucun rendu`}
            demo={<UseRefDemo />}
          />

          <HookSection
            title="useMemo — mettre un calcul en cache"
            description="Mémorise le résultat d'un calcul coûteux et ne le refait que si une dépendance change."
            code={`
const primeCount = useMemo(
  () => countPrimes(limit),
  [limit], // recalculé seulement si limit change
);`}
            demo={<UseMemoDemo />}
          />

          <HookSection
            title="useCallback — garder la même fonction"
            description="Comme useMemo, mais pour une fonction : renvoie la même référence tant que les dépendances ne changent pas. Utile quand on la passe à un enfant optimisé ou à un useEffect. Ce projet active le React Compiler, qui fait ce travail automatiquement : useMemo et useCallback y sont rarement nécessaires."
            code={`
const increment = useCallback(
  () => setCount((value) => value + 1),
  [], // aucune dépendance : toujours la même fonction
);`}
            demo={<UseCallbackDemo />}
          />

          <HookSection
            title="useContext — partager sans props"
            description="Lit une valeur fournie par un composant parent, quel que soit le niveau d'imbrication. Idéal pour le thème, la langue, l'utilisateur connecté…"
            code={`
const LanguageContext = createContext('fr');

<LanguageContext value="en">
  <Greeting />
</LanguageContext>

function Greeting() {
  const language = useContext(LanguageContext);
}`}
            demo={<UseContextDemo />}
          />

          <HookSection
            title="Hook personnalisé — réutiliser de la logique"
            description={
              <>
                Une fonction dont le nom commence par « use » et qui appelle d&apos;autres hooks.
                Exemple dans ce projet :{' '}
                <ThemedText type="code">src/hooks/use-theme.ts</ThemedText>.
              </>
            }
            code={`
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle] as const;
}

const [isOn, toggle] = useToggle();`}
            demo={<CustomHookDemo />}
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: 'center',
  },
  rules: {
    gap: Spacing.two,
    marginHorizontal: Spacing.four,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
  section: {
    gap: Spacing.three,
  },
});
