// src/components/TutorialModal.js
import React, { useMemo, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_W } = Dimensions.get("window");

// Auto-sizing image that keeps the correct aspect ratio based on the source
function AutoImage({ source, alt, style }) {
  const [ratio, setRatio] = useState(16 / 9);

  useEffect(() => {
    if (typeof source === "number") {
      // local require()
      const asset = Image.resolveAssetSource(source);
      if (asset?.width && asset?.height) {
        setRatio(asset.width / asset.height);
      }
    } else if (source?.uri) {
      // remote uri
      Image.getSize(
        source.uri,
        (w, h) => setRatio(w / h),
        () => {} // ignore errors; keep default ratio
      );
    }
  }, [source]);

  return (
    <Image
      source={source}
      resizeMode="contain"
      style={[styles.hero, style, { aspectRatio: ratio }]}
      accessible
      accessibilityLabel={alt ?? "tutorial image"}
    />
  );
}

/**
 * Props:
 * - visible?: boolean (controlled mode)
 * - onClose?: () => void
 * - autoFirstRun?: boolean (uncontrolled mode; shows once for new users)
 * - storageKey?: string (defaults to "hasSeenTutorial")
 * - theme?: colors
 * - steps?: custom steps
 */
export default function TutorialModal({
  visible,
  onClose,
  autoFirstRun = false,
  storageKey = "hasSeenTutorial",
  theme,
  steps,
}) {
  const t = {
    cardBg: theme?.cardBg ?? "#ffffff",
    buttonBg: theme?.buttonBg ?? "#6d5ffd",
    buttonText: theme?.buttonText ?? "#ffffff",
    headerText: theme?.headerText ?? "#000000",
    inputText: theme?.inputText ?? "#333333",
    border: theme?.border ?? "rgba(0,0,0,0.12)",
    trackBg: theme?.trackBg ?? "rgba(0,0,0,0.08)",
  };

  // Local images
  const IMGS = {
    tut1: require("../../assets/tutorial_img/tut1.jpg"),
    tut2: require("../../assets/tutorial_img/tut2.jpg"),
    tut3: require("../../assets/tutorial_img/tut3.jpg"),
    tut4: require("../../assets/tutorial_img/tut4.jpg"),
    tut5: require("../../assets/tutorial_img/tut5.jpg"),
    tut6: require("../../assets/tutorial_img/tut6.jpg"),
    tut7: require("../../assets/tutorial_img/tut7.jpg"),
  };

  // EXACT format: text -> image(s)
  const defaultSteps = useMemo(
    () => [
      {
        key: "capital",
        body:
          "Enter your Account Capital, which is your total trading balance. For example, if you have $1,000, type 1000 in the field.",
        img: IMGS.tut1,
      },
      {
        key: "risk",
        body:
          "Set your Risk % per trade, which is how much of your account you are willing to risk on a single trade. The recommended range is 1%–2%. For example, 2% of a $1,000 account equals a maximum loss of $20.",
        img: IMGS.tut2,
      },
      {
        key: "stoploss",
        body:
          "Enter your Stop-Loss %, which you can find in the Short & Long Position Tools Stats in TradingView. For example, in the image, you’ll see 3.12% for the long position and 2.68% for the short position. Input this value in the Stop-Loss % field.",
        images: [IMGS.tut3, IMGS.tut4],
      },
      {
        key: "marginType",
        body:
          "Make sure your Margin Order Size is set to USDT. This ensures that your position size is based on the USDT value you entered, regardless of the leverage you choose. Remember: leverage doesn’t matter—position sizing does.",
        img: IMGS.tut5,
      },
      {
        key: "results",
        body:
          "The calculator will then display your Total Margin and Risk Amount. In this example, it shows a total margin of $641.03, with a risk of $20.00, which equals 2% of your $1,000 account.",
        img: IMGS.tut6,
      },
      {
        key: "placeOrder",
        body:
          "Next, place your order with a margin of $641.03. Set the stop-loss price on your trading platform, and you’ll see that the risk amount is approximately the same as the one displayed in the calculator.",
        img: IMGS.tut7,
      },
      {
        key: "conclusion",
        title: "",
        body:
          "The TradeRisk Calculator helps you determine the right position size for every trade, protecting your capital and keeping your risk in check.\n\nYou can’t control the markets, but you can control your losses. Risk management isn’t about predicting the future, it’s about surviving it.\n\nFocus on controlling what’s within your power, and the profits will take care of themselves.",
        isLast: true,
      },
    ],
    []
  );

  const data = steps && steps.length ? steps : defaultSteps;

  // Progress bar
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(true);

  // Uncontrolled mode (auto first-run)
  const [autoVisible, setAutoVisible] = useState(false);
  const [checkingFirstRun, setCheckingFirstRun] = useState(autoFirstRun);

  useEffect(() => {
    let mounted = true;
    const checkFirstLaunch = async () => {
      if (!autoFirstRun) return;
      try {
        const hasSeen = await AsyncStorage.getItem(storageKey);
        if (mounted) setAutoVisible(!hasSeen); // show if never seen
      } catch {
        if (mounted) setAutoVisible(true); // fail open
      } finally {
        if (mounted) setCheckingFirstRun(false);
      }
    };
    checkFirstLaunch();
    return () => {
      mounted = false;
    };
  }, [autoFirstRun, storageKey]);

  const handleScroll = (e) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const total = Math.max(1, contentSize.height - layoutMeasurement.height);
    const p = Math.min(1, Math.max(0, contentOffset.y / total));
    setProgress(p);
    setShowBar(p < 0.999);
  };

  const closeAndRemember = async () => {
    // Controlled mode
    if (typeof visible === "boolean" && onClose) {
      onClose();
    }
    // Uncontrolled mode
    if (autoFirstRun) {
      setAutoVisible(false);
      try {
        await AsyncStorage.setItem(storageKey, "true");
      } catch {}
    }
  };

  // Determine final visibility
  const isVisible =
    typeof visible === "boolean" ? visible : autoFirstRun ? autoVisible : false;

  // Optional tiny loader while we check first-run
  if (checkingFirstRun) {
    return (
      <Modal transparent visible>
        <View style={styles.loaderWrap}>
          <ActivityIndicator />
        </View>
      </Modal>
    );
  }

  return (
    <Modal animationType="fade" transparent visible={isVisible} onRequestClose={closeAndRemember}>
      <View style={styles.centerWrap}>
        <View style={[styles.card, { backgroundColor: t.cardBg, borderColor: t.border }]}>
          <Text style={[styles.header, { color: t.headerText }]}>
            How to Use the TradeRisk Calculator
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
          >
            {data.map((s, idx) => (
              <View key={s.key ?? `step-${idx}`} style={styles.stepBlock}>
                {s.title && <Text style={[styles.title, { color: t.headerText }]}>{s.title}</Text>}

                {/* Body text first */}
                {s.body && <Text style={[styles.body, { color: t.inputText }]}>{s.body}</Text>}

                {/* Then image(s) */}
                {s.img && !s.images && (
                  <AutoImage
                    source={s.img}
                    alt={`${s.title ?? "Step image"} illustration`}
                    style={{ marginTop: 10 }}
                  />
                )}
                {Array.isArray(s.images) &&
                  s.images.map((imgSrc, i) => (
                    <AutoImage
                      key={`${s.key}-img-${i}`}
                      source={imgSrc}
                      alt={`${s.title ?? "Step image"} ${i + 1} illustration`}
                      style={{ marginTop: i === 0 ? 10 : 8 }}
                    />
                  ))}

                {s.isLast && (
                  <TouchableOpacity
                    onPress={closeAndRemember}
                    style={[styles.cta, { backgroundColor: t.buttonBg }]}
                    accessibilityRole="button"
                    accessibilityLabel="Close tutorial"
                  >
                    <Text style={[styles.ctaText, { color: t.buttonText }]}>Got It</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {!data.some((s) => s.isLast) && (
              <TouchableOpacity
                onPress={closeAndRemember}
                style={[styles.cta, { backgroundColor: t.buttonBg }]}
                accessibilityRole="button"
                accessibilityLabel="Close tutorial"
              >
                <Text style={[styles.ctaText, { color: t.buttonText }]}>Got It</Text>
              </TouchableOpacity>
            )}
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
                    backgroundColor: t.buttonBg,
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
  loaderWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
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
  // Fixed-width (fills card), auto-height via aspectRatio (set dynamically)
  hero: {
    width: "100%",
    height: undefined,
    borderRadius: 10,
    marginBottom: 10,
    // aspectRatio injected per image
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
