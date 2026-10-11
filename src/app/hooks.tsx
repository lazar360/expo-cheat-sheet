import { SymbolView } from 'expo-symbols';
import { useState, type ReactNode } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
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
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Props attendues par HookSection.
type HookSectionProps = {
  title: string;
  description: ReactNode;
  code: string;
  demo: ReactNode;
};

// HookSection : une section dépliable (titre cliquable → explication, code et démo).
function HookSection({ title, description, code, demo }: HookSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <View>
      <Pressable
        onPress={() => setIsOpen((value) => !value)}
        className="flex-row items-center gap-2 active:opacity-70">
        <View className="h-6 w-6 items-center justify-center rounded-xl bg-element dark:bg-element-dark">
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="bold"
            tintColor={theme.text}
            style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }}
          />
        </View>
        <Text className="text-sm font-medium text-black dark:text-white">{title}</Text>
      </Pressable>

      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View className="ml-6 mt-4 gap-4 rounded-2xl bg-element p-6 dark:bg-element-dark">
            <Text className="text-sm font-medium text-black dark:text-white">{description}</Text>
            <CodeBlock>{code}</CodeBlock>
            <Text className="text-sm font-bold text-black dark:text-white">Essayez :</Text>
            {demo}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// HooksScreen : l'écran de l'onglet Hooks, qui assemble l'en-tête, les règles et les sections.
// Les démos (UseStateDemo, etc.) viennent de src/components/hook-demos.tsx.
export default function HooksScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  // Les marges de zone sûre sont calculées à l'exécution : elles restent en style.
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
      className="flex-1 bg-white dark:bg-black"
      contentInset={insets}
      contentContainerClassName="flex-row justify-center"
      contentContainerStyle={contentPlatformStyle}
      keyboardShouldPersistTaps="handled">
      <View className="max-w-[800px] grow">
        <View className="items-center gap-4 px-6 py-16">
          <Text className="text-[32px] font-semibold leading-[44px] text-black dark:text-white">
            Les hooks
          </Text>
          <Text className="text-center text-base font-medium text-secondary dark:text-secondary-dark">
            Des fonctions « use… » qui donnent à un composant{'\n'}de la mémoire, des effets et
            plus encore.
          </Text>
        </View>

        <View className="mx-6 gap-2 rounded-3xl bg-element p-6 dark:bg-element-dark">
          <Text className="text-sm font-bold text-black dark:text-white">
            Les 2 règles des hooks
          </Text>
          <Text className="text-sm font-medium text-black dark:text-white">
            1. Les appeler en haut du composant, jamais dans un if, une boucle ou une fonction
            imbriquée.
          </Text>
          <Text className="text-sm font-medium text-black dark:text-white">
            2. Les appeler uniquement dans un composant React ou dans un autre hook.
          </Text>
        </View>

        <View className="gap-8 px-6 pt-8">
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
                <Text className="font-mono text-xs">src/hooks/use-theme.ts</Text>.
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
        </View>
      </View>
    </ScrollView>
  );
}
