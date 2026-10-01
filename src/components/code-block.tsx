import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

export function CodeBlock({ children }: { children: string }) {
  return (
    <ThemedView type="backgroundSelected" style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ThemedText type="code" style={styles.code}>
          {children.trim()}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  code: {
    lineHeight: 18,
  },
});
