// src/components/TutorialModal.js
import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

export default function TutorialModal({ visible, onClose, theme, steps }) {
  const t = {
    cardBg: theme?.cardBg ?? "#ffffff",
    buttonBg: theme?.buttonBg ?? "#6d5ffd",
    buttonText: theme?.buttonText ?? "#ffffff",
    headerText: theme?.headerText ?? "#000000",
    inputText: theme?.inputText ?? "#333333",
    border: theme?.border ?? "rgba(0,0,0,0.12)",
    trackBg: theme?.trackBg ?? "rgba(0,0,0,0.08)",
  };

  const defaultSteps = useMemo(
    () => [
      {
        key: "welcome",
        title: "Welcome",
        body:
          "This quick tour shows how to use the Risk Calculator. Scroll down to see all steps.",
        img:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
      },
      {
        key: "inputs",
        title: "Enter Your Inputs",
        body:
          "Fill in Stoploss %, Account Risk %, and Account Capital. Margin and Risk are computed instantly.",
        img:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop",
      },
      {
        key: "defaults",
        title: "Set Defaults & Theme",
        body:
          "Use the menu to save default Risk % and Capital. Toggle dark/light themes anytime.",
        img:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
      },
      {
        key: "done",
        title: "You’re All Set",
        body:
          "That’s it! You can revisit this tutorial from the Sidebar whenever you like.",
        isLast: true,
      },
    ],
    []
  );

  const data = steps && steps.length ? steps : defaultSteps;

  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(true);

  const handleScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const total = Math.max(1, contentSize.height - layoutMeasurement.height);
    const p = Math.min(1, Math.max(0, contentOffset.y / total));
    setProgress(p);
    setShowBar(p < 0.999);
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.centerWrap}>
        <View style={[styles.card, { backgroundColor: t.cardBg, borderColor: t.border }]}>
          <Text style={[styles.header, { color: t.headerText }]}>Quick Tutorial</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
          >
            {data.map((s, idx) => (
              <View key={s.key ?? `step-${idx}`} style={styles.stepBlock}>
                {s.img && (
                  <Image
                    source={{ uri: s.img }}
                    resizeMode="cover"
                    style={styles.hero}
                    accessible
                    accessibilityLabel={`${s.title ?? "Step image"} illustration`}
                  />
                )}
                {s.title && <Text style={[styles.title, { color: t.headerText }]}>{s.title}</Text>}
                {s.body && <Text style={[styles.body, { color: t.inputText }]}>{s.body}</Text>}
              </View>
            ))}

            <TouchableOpacity
              onPress={onClose}
              style={[styles.cta, { backgroundColor: t.buttonBg }]}
              accessibilityRole="button"
              accessibilityLabel="Close tutorial"
            >
              <Text style={[styles.ctaText, { color: t.buttonText }]}>Got It</Text>
            </TouchableOpacity>
          </ScrollView>

          {showBar && (
            <View
              style={[styles.progressTrack, { backgroundColor: t.trackBg }]}
              accessibilityRole="progressbar"
              accessibilityValue={{ now: Math.round(progress * 100), min: 0, max: 100 }}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: t.buttonBg, // matches button color
                  },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  header: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  stepBlock: {
    marginTop: 10,
  },
  hero: {
    width: "100%",
    height: SCREEN_W > 600 ? 220 : 170,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.95,
  },
  cta: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: {
    fontWeight: "800",
    fontSize: 14,
  },
  progressTrack: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 5,
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
});
