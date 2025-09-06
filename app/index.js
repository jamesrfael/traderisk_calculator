// app/index.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Octicons from "react-native-vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { themes, ThemeContext, useTheme } from "../src/theme";
import getStyles from "../src/styles/createStyles";
import SideBar from "../src/components/SideBar";
import TutorialModal from "../src/components/TutorialModal";

const { width } = Dimensions.get("window");
const STORAGE_KEYS = { capital: "defCapital", riskPct: "defRiskPct", theme: "appTheme" };
const ONBOARD_KEY = "hasSeenTutorial_v1";

const money = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return "$0.00";
  const fixed = num.toFixed(2);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${parts.join(".")}`;
};

export default function Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [sl, setSL] = useState("");
  const [r, setR] = useState("");
  const [c, setC] = useState("");

  const [defR, setDefR] = useState(null);
  const [defC, setDefC] = useState(null);

  const [themeName, setThemeName] = useState("dark");

  const drawerWidth = Math.round(width * 0.8);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Tutorial modal visibility (shown on first run and via Sidebar)
  const [tutorialVisible, setTutorialVisible] = useState(false);

  const slideX = useRef(new Animated.Value(-drawerWidth)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const [savedC, savedR, savedTheme] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.capital),
          AsyncStorage.getItem(STORAGE_KEYS.riskPct),
          AsyncStorage.getItem(STORAGE_KEYS.theme),
        ]);
        if (savedC) {
          setC(savedC);
          setDefC(savedC);
        }
        if (savedR) {
          setR(savedR);
          setDefR(savedR);
        }
        if (savedTheme) setThemeName(savedTheme);

        // First-time tutorial check
        const seen = await AsyncStorage.getItem(ONBOARD_KEY);
        if (!seen) setTutorialVisible(true);
      } catch (e) {
        setTutorialVisible(true);
      }
    })();
  }, []);

  const openDrawer = () => {
    setIsDrawerVisible(true);
    Animated.parallel([
      Animated.timing(slideX, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 0.5,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(slideX, {
        toValue: -drawerWidth,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDrawerVisible(false);
      setAboutOpen(false);
    });
  };

  const cNum = useMemo(() => parseFloat(c), [c]);
  const rNum = useMemo(() => parseFloat(r), [r]);
  const slNum = useMemo(() => parseFloat(sl), [sl]);

  const risk = cNum * (rNum / 100);
  const margin = risk / (slNum / 100 || 1);

  const promptSetDefault = async (which) => {
    const current = which === "r" ? r : c;
    if (!current) {
      Alert.alert("Set Default", "Type a value first.");
      return;
    }
    if (which === "r") {
      await AsyncStorage.setItem(STORAGE_KEYS.riskPct, current);
      setDefR(current);
      Alert.alert("Saved", `Default Risk % set to ${current}`);
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.capital, current);
      setDefC(current);
      Alert.alert("Saved", `Default Capital set to ${current}`);
    }
  };

  const clearAll = () => {
    setSL("0");
    setR(defR ?? "");
    setC(defC ?? "");
  };

  const toggleTheme = async () => {
    const next = themeName === "dark" ? "light" : "dark";
    setThemeName(next);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, next);
  };

  const theme = themes[themeName];
  const styles = getStyles(theme, drawerWidth);

  const closeTutorial = async () => {
    setTutorialVisible(false);
    try {
      await AsyncStorage.setItem(ONBOARD_KEY, "1");
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding" })}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={openDrawer} style={styles.menuBtn} accessibilityLabel="Open menu">
                <Octicons name="three-bars" size={22} color={theme.headerText} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>TradeRisk Calculator</Text>
            </View>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              {themeName === "dark" ? (
                <Octicons name="sun" size={22} color={theme.headerText} />
              ) : (
                <Octicons name="moon" size={22} color={theme.headerText} />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
              <FieldPercent label="Stoploss %" placeholder="0%" value={sl} onChangeText={setSL} />
              <FieldPercent
                label="Account Risk"
                placeholder="0%"
                value={r}
                onChangeText={setR}
                hint={defR ? `Default: ${defR}%` : undefined}
                rightBtnLabel="Set Default"
                onRightPress={() => promptSetDefault("r")}
              />
              <FieldMoney
                label="Account Capital"
                placeholder="0"
                value={c}
                onChangeText={setC}
                hint={defC ? `Default: ${money(parseFloat(defC) || 0)}` : undefined}
                rightBtnLabel="Set Default"
                onRightPress={() => promptSetDefault("c")}
              />

              <View style={styles.outBox}>
                <Text style={styles.outLabel}>Margin</Text>
                <Text style={styles.outValue}>{money(margin)}</Text>
              </View>

              <View style={styles.outBox}>
                <Text style={styles.outLabel}>Risk Amount</Text>
                <Text style={styles.outValue}>{money(risk)}</Text>
              </View>

              <View style={styles.actions}>
                <PrimaryButton label="Clear All" onPress={clearAll} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {isDrawerVisible && (
        <SideBar
          fade={fade}
          slideX={slideX}
          insets={insets}
          aboutOpen={aboutOpen}
          setAboutOpen={setAboutOpen}
          closeDrawer={closeDrawer}
          onTutorialPress={() => {
            setTutorialVisible(true); // open on demand
            closeDrawer();
          }}
          onNavigate={(route) => {
            closeDrawer();
            router.push(`/${route}`);
          }}
          clearDefaults={() => {
            AsyncStorage.multiRemove([STORAGE_KEYS.capital, STORAGE_KEYS.riskPct]).then(() => {
              setDefR(null);
              setDefC(null);
              Alert.alert("Cleared", "Default Capital and Default Risk % removed.");
            });
          }}
        />
      )}

      {/* Shows on first run (from ONBOARD_KEY) and on demand via Sidebar */}
      <TutorialModal visible={tutorialVisible} onClose={closeTutorial} theme={theme} />
    </ThemeContext.Provider>
  );
}

function FieldPercent({ label, value, onChangeText, placeholder, hint, rightBtnLabel, onRightPress }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const displayValue = value !== "" ? `${value}%` : "";
  const numericLen = displayValue.endsWith("%") ? displayValue.length - 1 : displayValue.length;
  const [selection, setSelection] = React.useState({ start: numericLen, end: numericLen });

  React.useEffect(() => {
    setSelection({ start: numericLen, end: numericLen });
  }, [numericLen]);

  const sanitize = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    return parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;
    // keeps only digits and a single dot
  };

  return (
    <View style={styles.fieldWrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {!!hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          value={displayValue}
          onChangeText={(text) => onChangeText(sanitize(text))}
          selection={selection}
          onSelectionChange={(e) => {
            const { start, end } = e.nativeEvent.selection;
            setSelection({ start: Math.min(start, numericLen), end: Math.min(end, numericLen) });
          }}
          onFocus={() => setSelection({ start: numericLen, end: numericLen })}
          placeholder={`${(placeholder || "0").replace(/%/g, "")}%`}
          placeholderTextColor={theme.hint}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        {!!rightBtnLabel && (
          <TouchableOpacity style={styles.miniBtn} onPress={onRightPress}>
            <Text style={styles.miniBtnText}>{rightBtnLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function FieldMoney({ label, value, onChangeText, placeholder, hint, rightBtnLabel, onRightPress }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const displayValue = value ? `$${value}` : "";

  const sanitize = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    return parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;
  };

  return (
    <View style={styles.fieldWrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {!!hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          value={displayValue}
          onChangeText={(text) => onChangeText(sanitize(text))}
          placeholder={`$${placeholder || "0"}`}
          placeholderTextColor={theme.hint}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        {!!rightBtnLabel && (
          <TouchableOpacity style={styles.miniBtn} onPress={onRightPress}>
            <Text style={styles.miniBtnText}>{rightBtnLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function PrimaryButton({ label, onPress }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const isDark = theme.background === themes.dark.background;
  const gradientColors = isDark ? ["#563fd9", "#8b5cf6"] : ["#0f1115", "#4b5563"];

  return (
    <TouchableOpacity onPress={onPress} style={styles.primaryBtn}>
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientLayer}>
        <Text style={{ color: theme.buttonText, fontWeight: "800" }}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
